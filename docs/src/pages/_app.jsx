import '../styles/global.css';

import { fontInter } from '../components/fonts/FontInter';

export default function App({ Component, pageProps }) {
  return (
    <main className={`${fontInter.variable} ${fontInter.className} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
}
