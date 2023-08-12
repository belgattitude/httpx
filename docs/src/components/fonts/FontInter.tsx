import { Inter } from 'next/font/google';
import type { FC, PropsWithChildren } from 'react';

export const fontInter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-family-inter',
});

export const FontLoaderInter: FC<PropsWithChildren> = (props) => (
  <div className={`${fontInter.className} ${fontInter.variable}`}>
    {props.children}
  </div>
);
