'use client';

import { PrimeReactProvider } from 'primereact/api';
import type { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

const providerValue = {
  // Will add  as a pass through preset based on PrimeOne Design
  // @link https://primereact.org/tailwind/#unstyledmode
  unstyled: false,
  pt: {},
  ptOptions: {
    mergeSections: true,
    mergeProps: true,
    classNameMergeFunction: twMerge,
  },
};

export const PrimeReactTailwindProvider: FC<PropsWithChildren> = (props) => {
  return (
    <PrimeReactProvider value={providerValue}>
      {props.children}
    </PrimeReactProvider>
  );
};
