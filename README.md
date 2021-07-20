
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
docker build market

docker images

docker run -p 3000:3000 -i -d [image id]
```

### npm

```
git clone https://github.com/ProtonProtocol/market.git

npm install

npm run dev
```

### Set up a Cloud Firestore

This project uses Firebase for the dynamic configuration of homepage templates.
Please refer to the [Firebase
documentation](https://firebase.google.com/docs/firestore) to set up your
firestore.

Note you'll need to set the following environment variables:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`

If you do not want to implement Firebase, remove the invocation of
`useFirebaseFeaturedTemplates` and fetch templates directly from Atomic Assets
(for example, with the
`http://proton.api.atomicassets.io/atomicassets/docs/swagger/#/templates/get_v1_templates`
endpoint).

The API response will contain an array of templates which you can pass as the
`items` prop of the `Grid` component rendered.

```js
// pages/index.tsx

const MarketPlace = (): JSX.Element => {
  const featuredTemplates = useFirebaseFeaturedTemplates();
  return (
    <PageLayout>
      <Banner modalType={MODAL_TYPES.CLAIM} />
      <ExploreCard />
      <HomepageStatistics />
      <Title>New &amp; Noteworthy</Title>
      <Grid items={featuredTemplates} />
    </PageLayout>
  );
};
```

## Environment

Create a copy of `.env.template` and name it `.env.local`:

* `NEXT_PUBLIC_CHAIN_ENDPOINTS` is used for initializing the Proton Web SDK.
* `NEXT_PUBLIC_BLOCK_EXPLORER` is used for connecting to the Proton Block Explorer.
* `NEXT_PUBLIC_NFT_ENDPOINT` is used for connecting to the Atomic Assets API.
* `NEXT_PUBLIC_GA_TRACKING_ID` is used for initializing Google Analytics.
* `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, and `FIREBASE_PROJECT_ID` are used
  for initializing Firebase for the homepage's featured NFTs.
* `PINATA_API_KEY` and `PINATA_SECRET` are used for connecting to [Pinata](https://pinata.cloud/) for IPFS upload.

For mainnet:
```
NEXT_PUBLIC_CHAIN_ENDPOINTS='https://proton.eoscafeblock.com, https://proton.greymass.com'
NEXT_PUBLIC_BLOCK_EXPLORER='https://proton.bloks.io/block/'
NEXT_PUBLIC_NFT_ENDPOINT='https://proton.api.atomicassets.io'
NEXT_PUBLIC_GA_TRACKING_ID='string'
FIREBASE_API_KEY=string
FIREBASE_AUTH_DOMAIN=string
FIREBASE_PROJECT_ID=string
PINATA_API_KEY=string
PINATA_SECRET=string
```

For testnet:
```
NEXT_PUBLIC_CHAIN_ENDPOINTS='https://testnet.protonchain.com'
NEXT_PUBLIC_BLOCK_EXPLORER='https://proton-test.bloks.io/block/'
NEXT_PUBLIC_NFT_ENDPOINT='https://test.proton.api.atomicassets.io'
NEXT_PUBLIC_GA_TRACKING_ID='string'
FIREBASE_API_KEY=string
FIREBASE_AUTH_DOMAIN=string
FIREBASE_PROJECT_ID=string
PINATA_API_KEY=string
PINATA_SECRET=string
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
