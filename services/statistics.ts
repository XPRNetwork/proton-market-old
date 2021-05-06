import { getFromApi } from '../utils/browser-fetch';
import { toQueryString } from '../utils';
import { Collection } from './collections';
import {
  TOKEN_SYMBOL,
  TOKEN_PRECISION,
  SHORTENED_TOKEN_PRECISION,
  FIRST_PROTON_MARKET_ASSET_ID,
} from '../utils/constants';
import { Asset } from './assets';

type Statistics = {
  nftsCreated: string;
  transactions: string;
  totalSales: string;
  salesToday: string;
};

const getTotalVolumeAndSales = async (): Promise<{
  sales: string;
  volume: string;
}> => {
  try {
    const res = await getFromApi<{ result: { volume: string; sales: string } }>(
      `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicmarket/v1/stats/sales?symbol=${TOKEN_SYMBOL}`
    );

    if (!res.success) {
      throw new Error((res.message as unknown) as string);
    }

    const { volume, sales } = res.data.result;

    return {
      volume,
      sales,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getDailyTotalSales = async (): Promise<number> => {
  const d = new Date();
  const last24Hours = d.setUTCHours(d.getUTCHours() - 24);
  const limit = 100;
  let page = 1;
  let salesToday = 0;
  let hasResults = true;

  try {
    while (hasResults) {
      const queryObject = {
        symbol: TOKEN_SYMBOL,
        order: 'desc',
        sort: 'volumes',
        page,
        limit,
        after: last24Hours,
      };
      const queryParams = toQueryString(queryObject);

      const res = await getFromApi<{ results: Collection[] }>(
        `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicmarket/v1/stats/collections?${queryParams}`
      );

      if (!res.success) {
        throw new Error((res.message as unknown) as string);
      }

      for (const collection of res.data.results) {
        const collectionSaleVolume = isNaN(parseInt(collection.volume))
          ? 0
          : parseInt(collection.volume);
        salesToday += collectionSaleVolume;
      }

      page += 1;
      if (res.data.results.length < limit) {
        hasResults = false;
        page = 1;
      }
    }

    return salesToday;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getNFTsCreatedCount = async (): Promise<number> => {
  try {
    const queryObject = {
      page: 1,
      limit: 1,
      order: 'desc',
      sort: 'asset_id',
    };
    const queryString = toQueryString(queryObject);
    const res = await getFromApi<Asset[]>(
      `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/assets?${queryString}`
    );

    if (!res.success) {
      throw new Error((res.message as unknown) as string);
    }

    const count = isNaN(parseInt(res.data[0].asset_id))
      ? 0
      : parseInt(res.data[0].asset_id) - FIRST_PROTON_MARKET_ASSET_ID;
    return count;
  } catch (e) {
    throw new Error(e);
  }
};

export const getStatistics = async (): Promise<Statistics> => {
  let nftsCreated = 0;
  let transactions = 0;
  let totalSales = 0;
  let salesToday = 0;

  try {
    const { volume, sales } = await getTotalVolumeAndSales();
    transactions = isNaN(parseInt(sales)) ? 0 : parseInt(sales);
    totalSales = isNaN(parseInt(volume)) ? 0 : parseInt(volume);

    salesToday = await getDailyTotalSales();
    nftsCreated = await getNFTsCreatedCount();

    return {
      nftsCreated: nftsCreated.toString(),
      transactions: transactions.toString(),
      totalSales: (totalSales / 10 ** TOKEN_PRECISION).toFixed(
        SHORTENED_TOKEN_PRECISION
      ),
      salesToday: (salesToday / 10 ** TOKEN_PRECISION).toFixed(
        SHORTENED_TOKEN_PRECISION
      ),
    };
  } catch (e) {
    console.warn(e.message);
    return {
      nftsCreated: nftsCreated.toString(),
      transactions: transactions.toString(),
      totalSales: (totalSales / 10 ** TOKEN_PRECISION).toFixed(
        SHORTENED_TOKEN_PRECISION
      ),
      salesToday: (salesToday / 10 ** TOKEN_PRECISION).toFixed(
        SHORTENED_TOKEN_PRECISION
      ),
    };
  }
};
