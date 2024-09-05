import { MultiSelect } from 'primereact/multiselect';
import { type FC, useState } from 'react';

import { cn } from '../utils';

type City = {
  name: string;
  code: string;
};
const cities: City[] = [
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
];

type Props = {
  className?: string | undefined;
};
export const CityMultiSelect: FC<Props> = (props) => {
  const { className } = props;
  const [selectedCities, setSelectedCities] = useState<City[]>();

  return (
    <div className={cn('', className)}>
      <MultiSelect
        value={selectedCities}
        onChange={(e) => setSelectedCities(e.value as City[])}
        options={cities}
        optionLabel="name"
        display="chip"
        placeholder="Select Cities"
        maxSelectedLabels={3}
        filter={true}
        className="w-full"
      />
    </div>
  );
};
