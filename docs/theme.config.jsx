import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';

export default {
  logo: <span>@httpx</span>,
  project: {
    link: 'https://github.com/belgattitude/httpx',
  },
  docsRepositoryBase: 'https://github.com/belgattitude/httpx/tree/main/docs',
  editLink: {
    text: 'Edit this page on GitHub',
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter } = useConfig();
    const url =
      process.env.SITE_URL +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta property="og:url" content={url} />
        <meta
          property="og:title"
          content={frontMatter.title || '@httpx documentation'}
        />
        <meta
          property="og:description"
          content={frontMatter.description || '@httpx documentation'}
        />
      </>
    );
  },
};
