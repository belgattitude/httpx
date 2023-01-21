import { HttpBadGateway, HttpForbidden } from '@httpx/exception';
import { toJson, fromJson } from '@httpx/exception/serializer';
import type { FC } from 'react';
import { parse, stringify } from 'superjson';

const SimpleSerialize: FC = () => {
  const cause = new HttpForbidden();
  const err = new HttpBadGateway({
    url: 'http://localhost:3000',
    cause,
  });
  const converted = fromJson(toJson(err));
  return (
    <div>
      <div>SimpleSerialize</div>
      <div>{JSON.stringify(converted)}</div>
    </div>
  );
};

export const SuperJsonSerialize: FC = () => {
  const cause = new HttpForbidden();
  const err = new HttpBadGateway({
    url: 'http://localhost:3000',
    cause,
  });
  const stringified = stringify(err);
  const converted = parse(stringified);

  return (
    <div className={'rounded-xl p-8 border-2'}>
      <div>Superjson</div>
      <div>{JSON.stringify(converted)}</div>
    </div>
  );
};

export const Scenarios = () => {
  return (
    <div>
      <SimpleSerialize />
      <SuperJsonSerialize />
    </div>
  );
};
