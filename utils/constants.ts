export const EMPTY_BALANCE = '0.00 XUSDC';
export const TOKEN_SYMBOL = 'XUSDC';
export const TOKEN_CONTRACT = 'xtokens';
export const TOKEN_PRECISION = 6;
export const SHORTENED_TOKEN_PRECISION = 2;
export const DEFAULT_COLLECTION = 'monsters';
export const PRICE_OF_RAM_IN_XPR = 0.0222;
export const PAGINATION_LIMIT = 12;
export const LG_FILE_UPLOAD_TYPES_TEXT =
  'PNG, GIF, JPG, WEBP, or MP4. Max 30 MB.';
export const SM_FILE_UPLOAD_TYPES_TEXT = 'PNG, GIF, JPG, or WEBP. Max 5 MB.';
export const LG_FILE_UPLOAD_TYPES = {
  'image/png': true,
  'image/jpg': true,
  'image/jpeg': true,
  'image/gif': true,
  'image/webp': true,
  'video/mp4': true,
  'audio/mpeg': false,
  'audio/mp3': false,
};
export const SM_FILE_UPLOAD_TYPES = {
  'image/png': true,
  'image/jpg': true,
  'image/jpeg': true,
  'image/gif': true,
  'image/webp': true,
};
export const LG_FILE_SIZE_UPLOAD_LIMIT = 30 * 1000000; // 30 MB
export const SM_FILE_SIZE_UPLOAD_LIMIT = 5 * 1000000; // 5 MB
export const RESIZER_IMAGE = 'https://bloks.io/cdn-cgi/image/width=500/';
export const IPFS_RESOLVER_IMAGE = 'https://ipfs.io/ipfs/';
export const IPFS_RESOLVER_VIDEO = 'https://ipfs.io/ipfs/';
export const DEFAULT_SCHEMA = {
  series: 'uint16',
  name: 'string',
  desc: 'string',
  image: 'string',
  audio: 'string',
  video: 'string',
};
export const RAM_AMOUNTS = {
  CREATE_COLLECTION_SCHEMA_TEMPLATE: 2000,
  MINT_ASSET: 151,
  LIST_SALE: 768,
  FREE_INITIAL_SPECIAL_MINT_CONTRACT_RAM: 1510,
};
export const TAB_TYPES = {
  ITEM: 'ITEM',
  GLOBAL: 'GLOBAL',
  ITEMS: 'ITEMS',
  CREATIONS: 'CREATIONS',
};
export const FEATURED_HOMEPAGE_COLLECTIONS = [
  { name: 'boardtodeath', displayName: 'Board To Death' },
  { name: 'restingbface', displayName: 'RBF' },
  { name: 'madisyn', displayName: 'Hodl Smiley' },
  { name: 'protonpups', displayName: 'ProtonPups' },
  { name: 'cryptocoins1', displayName: 'Crypto Coins' },
  { name: 'cryptocadets', displayName: 'Crypto Cadets' },
  {
    name: 'japanesebuba',
    displayName: 'Buba The Pig Collection',
  },
  { name: 'kawaiicrypto', displayName: 'Kawaii Crypto to the Moon!' },
];

export const FIRST_PROTON_MARKET_ASSET_ID = 4398046511103;

export const META = {
  twitterHandle: '@protonxpr',
  siteName: 'Proton Market',
  bannerImage: 'https://protonmarket.com/banner-rectangle.png',
  description:
    'Start creating and selling your own NFTs! The best way to monetize your talent. Free to get started.',
};

export interface RouterQuery {
  [query: string]: string;
}
export interface QueryParams {
  collection_name?: string;
  owner?: string;
  state?: string;
  sender?: string;
  seller?: string;
  asset_id?: string;
  template_id?: string;
  limit?: string | number;
  sort?: string;
  order?: string;
  page?: number;
  symbol?: string;
}
