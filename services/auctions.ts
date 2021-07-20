import { toQueryString } from '../utils';
import { getFromApi } from '../utils/browser-fetch';
import { Asset } from './assets';

interface Auction {
  auction_id: string;
  assets: Asset[];
  bids: Bid[];
  buyer: string;
  seller: string;
  state: string;
  claimed_by_buyer: boolean;
  claimed_by_seller: boolean;
  created_at_time: string;
  end_time: string;
  price: {
    amount: string;
    token_precision: number;
    token_symbol: number;
  };
}

interface Bid {
  account: string;
  amount: string;
  created_at_time: string;
  number: number;
  txid: string;
}

/**
 * Get all auctions a user has created
 * @param seller The account name of the seller of the auction assets
 * @returns {Auction[]}
 */

export const getAllAuctionsBySeller = async (
  seller: string
): Promise<Auction[]> => {
  try {
    const limit = 100;
    let auctions = [];
    let hasResults = true;
    let page = 1;

    while (hasResults) {
      const queryObject = {
        seller,
        page,
        limit,
      };
      const queryParams = toQueryString(queryObject);
      const result = await getFromApi<Auction[]>(
        `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicmarket/v1/auctions?${queryParams}`
      );

      if (!result.success) {
        throw new Error((result.message as unknown) as string);
      }

      if (result.data.length < limit) {
        hasResults = false;
      }

      auctions = auctions.concat(result.data);
      page += 1;
    }

    return auctions;
  } catch (e) {
    throw new Error(e);
  }
};
