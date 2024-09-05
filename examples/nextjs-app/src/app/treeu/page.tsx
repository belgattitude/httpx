'use client';

import { CityMultiSelect } from '../../components/prime/CityMultiSelect';
import { FolderTreeSelect } from '../../components/prime/FolderTreeSelect';

export default function TreeUDemoPage() {
  return (
    <div className={'p-10'}>
      <div className={'flex flex-col gap-5 w-[200px]'}>
        <CityMultiSelect />
        <FolderTreeSelect />
      </div>
    </div>
  );
}
