import { KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  Row,
  Title,
  Text,
  GreyText,
  Tag,
  CollectionNameButton,
  PlaceholderPrice,
  PlaceholderIcon,
} from './TemplateCard.styled';
import CollectionIcon, { IconContainer } from '../CollectionIcon';
import { fileReader } from '../../utils';
import TemplateImage from '../TemplateImage';
import TemplateVideo from '../TemplateVideo';
import {
  IPFS_RESOLVER_VIDEO,
  IPFS_RESOLVER_IMAGE,
  RESIZER_IMAGE,
} from '../../utils/constants';
import {
  useCreateAssetContext,
  useAuthContext,
} from '../../components/Provider';

type Props = {
  collectionName: string;
  collectionDisplayName?: string;
  templateName: string;
  maxSupply: string;
  isUsersTemplates?: boolean;
  redirectPath?: string;
  totalAssets?: string;
  assetsForSale?: string;
  collectionImage?: string;
  templateVideo?: string;
  templateImage?: string;
  price?: string;
  hasMultiple?: boolean;
  noHoverEffect?: boolean;
  imageHoverEffect?: boolean;
  isStatic?: boolean;
  noIpfsConversion?: boolean;
  autoPlay?: boolean;
  hasPlaceholderIcon?: boolean;
  createdAt?: string;
};

const TemplateCard = ({
  collectionName,
  templateName,
  maxSupply,
  redirectPath,
  isUsersTemplates,
  collectionDisplayName,
  totalAssets,
  assetsForSale,
  collectionImage,
  templateVideo,
  templateImage,
  price,
  noHoverEffect,
  hasMultiple,
  noIpfsConversion,
  isStatic,
  autoPlay,
  hasPlaceholderIcon,
  imageHoverEffect,
  createdAt,
}: Props): JSX.Element => {
  const { cachedNewlyCreatedAssets } = useCreateAssetContext();
  const { currentUser } = useAuthContext();
  const [templateVideoSrc, setTemplateVideoSrc] = useState<string>('');
  const [templateImgSrc, setTemplateImgSrc] = useState<string>('');
  const [fallbackImgSrc, setFallbackImgSrc] = useState<string>('');

  useEffect(() => {
    if (Date.now() - 600000 < Number(createdAt) && isMyTemplate) {
      // created within the last 10 minutes to deal with propagation lag
      if (cachedNewlyCreatedAssets[templateVideo]) {
        fileReader((result) => {
          setTemplateVideoSrc(result);
        }, cachedNewlyCreatedAssets[templateVideo]);
      }
      if (cachedNewlyCreatedAssets[templateImage]) {
        fileReader((result) => {
          setTemplateImgSrc(result);
        }, cachedNewlyCreatedAssets[templateImage]);
      }
    } else {
      const videoSrc = noIpfsConversion
        ? templateVideo
        : `${IPFS_RESOLVER_VIDEO}${templateVideo}`;
      const imageSrc =
        noIpfsConversion || !templateImage
          ? templateImage
          : `${RESIZER_IMAGE}${IPFS_RESOLVER_IMAGE}${templateImage}`;
      const fallbackImageSrc =
        !noIpfsConversion && templateImage
          ? `${IPFS_RESOLVER_IMAGE}${templateImage}`
          : '';

      setTemplateVideoSrc(videoSrc);
      setTemplateImgSrc(imageSrc);
      setFallbackImgSrc(fallbackImageSrc);
    }
  }, [templateVideo, templateImage]);

  const router = useRouter();
  const isMyTemplate =
    currentUser && router.query.chainAccount === currentUser.actor;
  const openDetailPage = () => {
    if (!isStatic) {
      router.push(redirectPath);
    }
  };
  const openCollectionPage = (e: MouseEvent) => {
    if (!isStatic) {
      e.stopPropagation();
      router.push(`/${collectionName}`);
    }
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isStatic) {
      openDetailPage();
    }
  };

  const priceTag =
    isUsersTemplates && assetsForSale && totalAssets ? (
      <Tag>
        {assetsForSale}/{totalAssets} FOR SALE
      </Tag>
    ) : null;

  const collectionIcon = hasPlaceholderIcon ? (
    <IconContainer margin="24px 16px 24px 0">
      <PlaceholderIcon />
    </IconContainer>
  ) : (
    <CollectionIcon
      name={collectionName}
      image={collectionImage}
      margin="24px 16px 24px 0"
    />
  );

  return (
    <Card
      tabIndex={0}
      hasMultiple={hasMultiple}
      noHoverEffect={noHoverEffect}
      imageHoverEffect={imageHoverEffect}
      onClick={redirectPath ? openDetailPage : null}
      onKeyDown={redirectPath ? handleEnterKey : null}
      isStatic={isStatic}>
      <Row>
        <CollectionNameButton isStatic={isStatic} onClick={openCollectionPage}>
          {collectionIcon}
          <Text>{collectionDisplayName || collectionName}</Text>
        </CollectionNameButton>
      </Row>
      {templateVideo ? (
        <TemplateVideo
          src={templateVideoSrc}
          priceTag={priceTag}
          autoPlay={autoPlay}
        />
      ) : (
        <TemplateImage
          templateImgSrc={templateImgSrc}
          fallbackImgSrc={fallbackImgSrc}
          templateName={templateName}
          priceTag={priceTag}
        />
      )}
      <Title>{templateName}</Title>
      <GreyText>
        Edition size: {maxSupply === '0' ? 'Unlimited' : maxSupply}
      </GreyText>
      {price ? <Text>{price}</Text> : <PlaceholderPrice aria-hidden />}
    </Card>
  );
};

TemplateCard.defaultProps = {
  collectionName: 'Collection',
  templateName: 'Name',
  maxSupply: 0,
  hasMultiple: false,
};

export default TemplateCard;
