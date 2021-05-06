import {
  IPFS_RESOLVER_IMAGE,
  IPFS_RESOLVER_VIDEO,
} from '../../utils/constants';
import Head from 'next/head';

type Props = {
  templateName?: string;
  collectionName: string;
  collectionDisplayName?: string;
  collectionAuthor: string;
  image?: string;
  video?: string;
  model?: string;
};

export const AssetMeta = (props: Props): JSX.Element => {
  const title = props.templateName || 'NFT';
  const description = `${
    props.collectionDisplayName || props.collectionName
  } by ${props.collectionAuthor}`;

  let metas = [
    {
      key: 'ogtitle',
      name: 'og:title',
      content: title,
    },
    {
      key: 'twtitle',
      name: 'twitter:title',
      content: title,
    },
    {
      key: 'ogdescription',
      name: 'og:description',
      content: description,
    },
    {
      key: 'twdescription',
      name: 'twitter:description',
      content: description,
    },
  ];

  if (props.video) {
    const videoUrl = `${IPFS_RESOLVER_VIDEO}${props.video}`;
    const videoWidth = '480';
    const videoHeight = '480';

    metas = metas.concat([
      {
        key: 'twcard',
        name: 'twitter:card',
        content: 'player',
      },
      {
        key: 'twplayer',
        name: 'twitter:player',
        content: videoUrl,
      },
      {
        key: 'twplayerheight',
        name: 'twitter:player:height',
        content: videoHeight,
      },
      {
        key: 'twplayerwidth',
        name: 'twitter:player:width',
        content: videoWidth,
      },
      {
        key: 'ogvideo',
        name: 'og:video',
        content: videoUrl,
      },
      {
        key: 'ogvideoheight',
        name: 'og:video:height',
        content: videoHeight,
      },
      {
        key: 'ogvideowidth',
        name: 'og:video:width',
        content: videoWidth,
      },
      {
        key: 'ogtype',
        name: 'og:type',
        content: 'video',
      },
    ]);
  } else if (props.model) {
    const modelUrl = `${IPFS_RESOLVER_IMAGE}${props.model}`;

    metas = metas.concat([
      {
        key: 'ogtype',
        name: 'og:type',
        content: 'threed.asset',
      },
      {
        key: 'ogmodel',
        name: 'og:asset',
        content: modelUrl,
      },
    ]);
  } else if (props.image) {
    const imageUrl = `${IPFS_RESOLVER_IMAGE}${props.image}`;

    metas = metas.concat([
      {
        key: 'twcard',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        key: 'twimage',
        name: 'twitter:image',
        content: imageUrl,
      },
      {
        key: 'ogimage',
        name: 'og:image',
        content: imageUrl,
      },
    ]);
  }

  return (
    <Head>
      {metas.map((meta) => (
        <meta key={meta.key} name={meta.name} content={meta.content} />
      ))}
    </Head>
  );
};

export default AssetMeta;
