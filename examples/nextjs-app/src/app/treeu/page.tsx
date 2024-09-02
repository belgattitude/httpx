'use client';

import { CityMultiSelect } from '../../components/prime/CityMultiSelect';

export default function TreeUDemoPage() {
  return (
    <div className={'p-10'}>
      <div className={'flex gap-5 max-w-3'}>
        <CityMultiSelect className={'w-[200px]'} />
      </div>
    </div>
  );
}
