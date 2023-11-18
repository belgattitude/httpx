import {
  type HttpException,
  HttpNotFound,
  HttpRequestTimeout,
} from '@httpx/exception';
import { fromJson, toJson } from '@httpx/exception/serializer';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Scenarios } from '../components/Scenarios';

type ApiData =
  | {
      data: {
        id: string;
      };
      success: true;
    }
  | {
      error: string;
      success: false;
    };

type Props = {
  apiData: ApiData;
};

export default function ssrRoute(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { apiData } = props;
  const error: Error | null = apiData.success ? null : fromJson(apiData.error);
  console.log('apiData', apiData);
  return (
    <div>
      <h1>Should display the error below</h1>
      <pre>{JSON.stringify(error, null, 2)}</pre>
      <div>{JSON.stringify(apiData)}</div>
      <Scenarios />
    </div>
  );
}

const fetchApiDataAlwaysRequestTimeout = async (): Promise<
  Props['apiData']
  // eslint-disable-next-line @typescript-eslint/require-await
> => {
  throw new HttpRequestTimeout({
    message: 'Fake request timeout',
    url: 'http://localhost:3001',
  });
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  _context
) => {
  let apiData: ApiData;
  try {
    apiData = await fetchApiDataAlwaysRequestTimeout();
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return {
        notFound: true,
      };
    }
    apiData = {
      error: toJson(e as HttpException),
      success: false,
    };
  }
  return {
    props: {
      apiData,
    },
  };
};
