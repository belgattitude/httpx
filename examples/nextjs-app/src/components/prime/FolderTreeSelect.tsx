import { TreeSelect, type TreeSelectChangeEvent } from 'primereact/treeselect';
import React, { type FC, useEffect, useState } from 'react';

import { cn } from '../utils';
import { NodeService } from './NodeService';

type Props = {
  className?: string | undefined;
};

type Data = Awaited<ReturnType<typeof NodeService.getTreeNodes>>;

export const FolderTreeSelect: FC<Props> = (props) => {
  const [nodes, setNodes] = useState<Data>([]);
  const [selectedNodeKeys, setSelectedNodeKeys] =
    useState<TreeSelectChangeEvent['value']>(null);
  const { className } = props;

  useEffect(() => {
    NodeService.getTreeNodes()
      .then((data) => setNodes(data))
      .catch((e) => {
        console.error('Error fetching nodes:', e);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cn('', className)}>
      <TreeSelect
        value={selectedNodeKeys}
        options={nodes}
        onChange={(e) => setSelectedNodeKeys(e.value)}
        metaKeySelection={false}
        selectionMode="checkbox"
        display="chip"
        filter={true}
        className="w-full"
        placeholder="Select Items"
      />
    </div>
  );
};
