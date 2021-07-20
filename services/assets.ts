import { Schema, Template } from './templates';
import { Collection } from './collections';
import { getAssetSale, getAllTemplateSales } from './sales';
import { addPrecisionDecimal, toQueryString } from '../utils';
import { getFromApi } from '../utils/browser-fetch';
import { getUserOffers } from './offers';

export type Asset = {
  name: string;
  data: Record<string, unknown>;
  owner: string;
  template: Template;
  asset_id: string;
  saleId: string;
  mutable_data?: Record<string, unknown>;
  immutable_data?: Record<string, unknown>;
  template_mint?: string;
  schema_mint?: string;
  collection_mint?: string;
  backed_tokens?: string[] | [];
  burned_by_account?: string | null;
  burned_at_block?: string | null;
  burned_at_time?: string | null;
  updated_at_block?: string;
  updated_at_time?: string;
  transferred_at_block?: string;
  transferred_at_time?: string;
  minted_at_block?: string;
  minted_at_time?: string;
  contract?: string;
  is_transferable?: boolean;
  is_burnable?: boolean;
  collection?: Collection;
  schema?: Schema;
  isForSale?: boolean;
  salePrice?: string;
};

export type RawPrices = {
  [assetId: string]: {
    rawPrice: string;
    saleId: string;
  };
};

interface SaleData {
  saleId: string;
  templateMint: string;
  salePrice: string;
  assetId: string;
}

interface FullSaleData extends SaleData {
  rawPrice: string;
}

type SaleDataByAssetId = {
  [assetId: string]: SaleData;
};

export type FullSaleDataByAssetId = {
  [assetId: string]: FullSaleData;
};

type UserTemplateAssetDetails = {
  assets: Asset[];
  saleData: FullSaleDataByAssetId;
};

/**
 * Gets a list of all user owned assets of a specific template
 * Mostly used in viewing all your owned assets and see which one is listed for sale at a glance.
 * @param owner       The account name of the owner of the assets to look up
 * @param templateId  The ID of the template of a group of assets
 * @returns {Asset[]} Returns array of Assets owned by the user of a specified template
 */

export const getAllUserAssetsByTemplate = async (
  owner: string,
  templateId: string
): Promise<Asset[]> => {
  try {
    const limit = 100;
    let assets = [];
    let hasResults = true;
    let page = 1;

    while (hasResults) {
      const queryObject = {
        owner,
        page,
        order: 'asc',
        sort: 'template_mint',
        template_id: templateId,
        limit,
      };
      const queryString = toQueryString(queryObject);
      const result = await getFromApi<Asset[]>(
        `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/assets?${queryString}`
      );

      if (!result.success) {
        throw new Error((result.message as unknown) as string);
      }

      if (result.data.length < limit) {
        hasResults = false;
      }

      assets = assets.concat(result.data);
      page += 1;
    }

    return assets;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Gets an index of sale IDs organized by asset ID.
 * Mostly used in viewing all your owned assets and see which one is listed for sale at a glance.
 * @param owner                 The account name of the owner of the assets to look up
 * @param templateId            The ID of the template of a group of assets
 * @returns {SaleDataByAssetId} Returns object of sale asset data organized by asset ID
 */

const getSaleDataByAssetId = async (
  owner: string,
  templateId: string
): Promise<SaleDataByAssetId> => {
  const { assets } = await getAllTemplateSales(templateId, owner);
  const sales = {};
  for (const asset of assets) {
    sales[asset.assetId] = asset;
  }
  return sales;
};

/**
 * Gets a list of all user owned assets and checks whether there are open offers.
 * Mostly used in viewing all your owned assets and see which one is listed for sale at a glance.
 * @param owner                         The account name of the owner of the assets to look up
 * @param templateId                    The ID of the template of a group of assets
 * @returns {UserTemplateAssetDetails}  Returns array of assets, raw prices organized by asset ID, and sale IDs organized by asset ID
 */

export const getUserTemplateAssets = async (
  owner: string,
  templateId: string
): Promise<UserTemplateAssetDetails> => {
  try {
    const assets = await getAllUserAssetsByTemplate(owner, templateId);

    const userOffers = await getUserOffers(owner);

    if (!userOffers || !userOffers.length) {
      return {
        assets,
        saleData: {},
      };
    }

    const saleData = await getSaleDataByAssetId(owner, templateId);

    const saleDataWithRawPrice = {};
    for (const assetId in saleData) {
      const { salePrice } = saleData[assetId];
      saleDataWithRawPrice[assetId] = {
        rawPrice: salePrice.replace(/[,]/g, ''),
        ...saleData[assetId],
      };
    }

    const assetsWithSaleData = assets.map((asset) => ({
      ...asset,
      ...saleDataWithRawPrice[asset.asset_id],
    }));

    return {
      assets: assetsWithSaleData,
      saleData: saleDataWithRawPrice,
    };
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Gets the detail of a specific asset and returns it with a "isForSale" flag
 * Mostly used in checking your own asset detail to determine what details to display (cancel listing, vs put up for sale).
 * @param  {string} assetId The asset id number you're trying to look up
 * @return {Asset}          Returns asset information, with additional flag "isForSale",
 *                          after checking if any listed sales exist for that asset_id
 */

export const getAssetDetails = async (assetId: string): Promise<Asset> => {
  const currentAssetResponse = await getFromApi<Asset>(
    `${process.env.NEXT_PUBLIC_NFT_ENDPOINT}/atomicassets/v1/assets/${assetId}`
  );

  if (!currentAssetResponse.success) {
    throw new Error((currentAssetResponse.message as unknown) as string);
  }

  const saleForThisAsset = await getAssetSale(assetId);

  let isForSale = false;
  let salePrice = '';
  let saleId = '';

  if (saleForThisAsset && saleForThisAsset.length > 0) {
    const [sale] = saleForThisAsset;
    const {
      listing_price,
      listing_symbol,
      sale_id,
      price: { token_precision },
    } = sale;
    isForSale = true;
    saleId = sale_id;
    salePrice = `${addPrecisionDecimal(
      listing_price,
      token_precision
    )} ${listing_symbol}`;
  }

  return {
    ...currentAssetResponse.data,
    isForSale,
    salePrice,
    saleId,
  };
};
