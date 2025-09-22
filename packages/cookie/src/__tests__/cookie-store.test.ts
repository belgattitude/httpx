import { CookieStore } from '../cookie-store';

/**
 * Minimal fake cookie environment to simulate document.cookie behavior in tests.
 * - write() receives a full Set-Cookie style string (name=value; Attr=...; ...)
 * - It stores only live cookies in a map (name -> value), respecting deletions via Max-Age=0 or past Expires.
 * - read() returns the document.cookie string ("name=value; name2=value2").
 */
function createFakeCookieEnv() {
  const jar = new Map<string, string>();
  const writes: string[] = [];

  const write = (cookieString: string) => {
    writes.push(cookieString);

    // Example: name=value; Path=/; Max-Age=60; SameSite=Lax; Secure
    const parts = cookieString.split(';');
    const pair = parts[0]!;
    const [rawName, ...rest] = pair.split('=');
    if (!rawName) return;
    const name = rawName.trim();
    const value = rest.join('='); // value can contain '='

    // Attributes
    const attrs = parts.slice(1).map((p) => p.trim());
    const maxAgeAttr = attrs.find((a) => /^Max-Age=/i.test(a));
    const expiresAttr = attrs.find((a) => /^Expires=/i.test(a));

    const isDeletion =
      (value === '' &&
        ((maxAgeAttr && /^Max-Age=0$/i.test(maxAgeAttr)) ??
          (expiresAttr &&
            /GMT$/i.test(expiresAttr) &&
            new Date(expiresAttr.split('=')[1]!).getTime() <= 0))) ??
      false;

    if (isDeletion) {
      jar.delete(name);
      return;
    }
    // Otherwise set/update cookie
    jar.set(name, value);
  };

  const read = () => {
    return Array.from(jar.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  };

  return { read, write, writes, jar };
}

describe('CookieStore', () => {
  it('sets and gets a small value (single chunk)', () => {
    const fake = createFakeCookieEnv();
    const store = new CookieStore({
      readCookieString: fake.read,
      writeCookieString: fake.write,
      chunkSize: 1024,
    });

    store.set('token', 'abc');

    expect(fake.read()).toContain('token=1'); // index cookie count
    expect(fake.read()).toContain('token.__chunk_1=abc');

    const val = store.get('token');
    expect(val).toBe('abc');
  });

  it('sets and gets an empty value', () => {
    const fake = createFakeCookieEnv();
    const store = new CookieStore({
      readCookieString: fake.read,
      writeCookieString: fake.write,
    });

    store.set('empty', '');

    // Only index cookie with 0
    expect(fake.read()).toContain('empty=0');
    expect(store.get('empty')).toBe('');
  });

  it('chunks a large value and reconstructs correctly', () => {
    const fake = createFakeCookieEnv();
    const store = new CookieStore({
      readCookieString: fake.read,
      writeCookieString: fake.write,
      chunkSize: 10,
    });

    const big = 'ABCDEFGHIJ' + 'KLMNOPQRST' + 'UVWXYZ'; // length 10 + 10 + 6 = 26 -> 3 chunks with size 10
    store.set('big', big);

    // Check index cookie count
    expect(fake.read()).toContain('big=3');
    // Check chunk cookie contents
    const doc = fake.read();
    expect(doc).toContain('big.__chunk_1=ABCDEFGHIJ');
    expect(doc).toContain('big.__chunk_2=KLMNOPQRST');
    expect(doc).toContain('big.__chunk_3=UVWXYZ');

    expect(store.get('big')).toBe(big);
  });

  it('clear removes index and all chunk cookies', () => {
    const fake = createFakeCookieEnv();
    const store = new CookieStore({
      readCookieString: fake.read,
      writeCookieString: fake.write,
      chunkSize: 5,
    });

    store.set('session', 'helloworld'); // length 10 -> 2 chunks
    expect(store.get('session')).toBe('helloworld');

    store.clear('session');

    const doc = fake.read();
    expect(doc.includes('session=')).toBe(false);
    expect(doc.includes('session.__chunk_1=')).toBe(false);
    expect(doc.includes('session.__chunk_2=')).toBe(false);
  });

  it('clear performs best-effort cleanup when index cookie is missing', () => {
    const fake = createFakeCookieEnv();
    const store = new CookieStore({
      readCookieString: fake.read,
      writeCookieString: fake.write,
    });

    // Simulate leftover chunk cookies without index
    fake.write('orphan.__chunk_1=AAA; Path=/');
    fake.write('orphan.__chunk_2=BBB; Path=/');

    // Ensure they are present
    expect(fake.read()).toContain('orphan.__chunk_1=AAA');
    expect(fake.read()).toContain('orphan.__chunk_2=BBB');

    store.clear('orphan');

    const doc = fake.read();
    expect(doc.includes('orphan.__chunk_1=')).toBe(false);
    expect(doc.includes('orphan.__chunk_2=')).toBe(false);
  });

  it('applies cookie options (Path, Domain, Secure, SameSite, Max-Age) on writes', () => {
    const fake = createFakeCookieEnv();
    const store = new CookieStore({
      readCookieString: fake.read,
      writeCookieString: fake.write,
      chunkSize: 2,
    });

    store.set('opts', 'abcd', {
      path: '/x',
      domain: 'example.com',
      secure: true,
      sameSite: 'Lax',
      maxAgeSeconds: 60,
    });

    // At least one of the writes should include all attributes.
    const joinedWrites = fake.writes.join('\n');
    expect(joinedWrites).toMatch(/; Path=\/x/);
    expect(joinedWrites).toMatch(/; Domain=example\.com/);
    expect(joinedWrites).toMatch(/; Secure/);
    expect(joinedWrites).toMatch(/; SameSite=Lax/);
    expect(joinedWrites).toMatch(/; Max-Age=60/);
  });
});
