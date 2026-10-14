import { HttpBadGateway, HttpForbidden } from "@httpx/exception";
import { fromJson, toJson } from "@httpx/exception/serializer";
import type { FC } from "react";
import { parse, stringify } from "superjson";

const SimpleSerialize: FC = () => {
  const cause = new HttpForbidden();
  const err = new HttpBadGateway({
    cause,
    url: "http://localhost:3000",
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
    cause,
    url: "http://localhost:3000",
  });
  const stringified = stringify(err);
  const converted = parse(stringified);

  return (
    <div className="rounded-xl border-2 p-8">
      <div>Superjson</div>
      <div>{JSON.stringify(converted)}</div>
    </div>
  );
};

export const Scenarios = () => (
  <div>
    <SimpleSerialize />
    <SuperJsonSerialize />
  </div>
);
