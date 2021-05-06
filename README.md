
# Proton Marketplace

This application shows the basic functionality of NFTs on the Proton chain through the use of the [Proton Web SDK](https://www.npmjs.com/package/@proton/web-sdk).

This is built off of atomicassets NFT framework.

- [API Documentation for atomicassets (mainnet)](https://proton.api.atomicassets.io/atomicassets/docs/swagger/)
- [API Documentation for atomicmarket (mainnet)](https://proton.api.atomicassets.io/atomicmarket/docs/swagger/)
- [API Documentation for atomicassets (testnet)](https://test.proton.api.atomicassets.io/atomicassets/docs/swagger/)
- [API Documentation for atomicmarket (testnet)](https://test.proton.api.atomicassets.io/atomicmarket/docs/swagger/)

## To build and run locally

### Docker

Run a docker container:

```
docker build nft-demo .

docker images

docker run -p 3000:3000 -i -d [image id]
```

### npm

```
git clone https://github.com/ProtonProtocol/nft-demo.git

npm install

npm run dev
```

## Environment

Create a copy of `.env.template` and name it `.env.local`:

For mainnet:
```
NEXT_PUBLIC_CHAIN_ENDPOINTS='https://proton.eoscafeblock.com, https://proton.greymass.com'
NEXT_PUBLIC_BLOCK_EXPLORER='https://proton.bloks.io/block/'
NEXT_PUBLIC_NFT_ENDPOINT='https://proton.api.atomicassets.io'
```

For testnet:
```
NEXT_PUBLIC_CHAIN_ENDPOINTS='https://testnet.protonchain.com'
NEXT_PUBLIC_BLOCK_EXPLORER='https://proton-test.bloks.io/block/'
NEXT_PUBLIC_NFT_ENDPOINT='https://test.proton.api.atomicassets.io'
```

## Marketplace

The marketplace page consists of templates of a specific `collection_name`.

### Custom flags

- The `Template` object is extended with the following custom property: `lowestPrice`.
  - `lowestPrice` (string) is determined by checking the Sales API for assets listed for sale and finding the lowest price of the assets of that particular template.

## My NFTs

The `My NFTs` page consists of the current user's assets. Each user is only allowed to view their own collection page in this demo.

### Custom flags

- The `Asset` object is extended with the following custom properties: `isForSale` and `salePrice`.
  - `isForSale` (boolean) is determined by checking the Sales API for currently listed sales using the `asset_id` and `seller` (current user's `chainAccount`)
  - `salePrice` (string) is determined by checking the Sales API and combining an asset's `listing_price` and `listing_symbol`
