import { KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  Row,
  Title,
  Text,
  GreyText,
  CollectionNameButton,
  PlaceholderPrice,
  ShimmerBlock,
} from '../TemplateCard/TemplateCard.styled';
import CollectionIcon from '../CollectionIcon';
import TemplateImage from '../TemplateImage';
import TemplateVideo from '../TemplateVideo';
import {
  IPFS_RESOLVER_VIDEO,
  IPFS_RESOLVER_IMAGE,
  RESIZER_IMAGE_SM,
} from '../../utils/constants';
import { addPrecisionDecimal } from '../../utils';
import { Template } from '../../services/templates';
import { getLowestPriceAsset } from '../../services/sales';

type Props = {
  template: Template;
};

const SearchTemplateCard = ({ template }: Props): JSX.Element => {
  const {
    template_id,
    name,
    collection: { collection_name, img, name: collectionDisplayName },
    immutable_data: { image, video },
    max_supply,
    issued_supply,
  } = template;

  const [templateVideoSrc, setTemplateVideoSrc] = useState<string>('');
  const [templateImgSrc, setTemplateImgSrc] = useState<string>('');
  const [fallbackImgSrc, setFallbackImgSrc] = useState<string>('');
  const [templateLowestPrice, setTemplateLowestPrice] = useState<string>('');
  const [isLoadingLowestPrice, setIsLoadingLowestPrice] = useState<boolean>(
    true
  );

  useEffect(() => {
    const videoSrc = `${IPFS_RESOLVER_VIDEO}${video}`;
    const imageSrc = !image
      ? image
      : `${RESIZER_IMAGE_SM}${IPFS_RESOLVER_IMAGE}${image}`;
    const fallbackImageSrc = image ? `${IPFS_RESOLVER_IMAGE}${image}` : '';

    setTemplateVideoSrc(videoSrc);
    setTemplateImgSrc(imageSrc);
    setFallbackImgSrc(fallbackImageSrc);
  }, [video, img]);

  useEffect(() => {
    (async () => {
      const saleForTemplateAsc = await getLowestPriceAsset(
        collection_name,
        template_id
      );
      const lowestPriceSale = saleForTemplateAsc[0];
      const lowestPrice =
        lowestPriceSale && lowestPriceSale.listing_price
          ? `${addPrecisionDecimal(
              lowestPriceSale.listing_price,
              lowestPriceSale.price.token_precision
            )} ${lowestPriceSale.listing_symbol}`
          : '';

      setTemplateLowestPrice(lowestPrice);
      setIsLoadingLowestPrice(false);
    })();
  }, []);

  const router = useRouter();
  const redirectPath = `/${collection_name}/${template_id}`;
  const hasMultiple = !isNaN(parseInt(issued_supply))
    ? parseInt(issued_supply) > 1
    : false;

  const openDetailPage = () => {
    router.push(redirectPath);
  };

  const openCollectionPage = (e: MouseEvent) => {
    e.stopPropagation();
    router.push(`/${collection_name}`);
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      openDetailPage();
    }
  };

  const priceSection = isLoadingLowestPrice ? (
    <ShimmerBlock aria-hidden />
  ) : templateLowestPrice ? (
    <Text>{templateLowestPrice}</Text>
  ) : (
    <PlaceholderPrice aria-hidden />
  );

  return (
    <Card
      tabIndex={0}
      hasMultiple={hasMultiple}
      onClick={openDetailPage}
      onKeyDown={handleEnterKey}>
      <Row>
        <CollectionNameButton onClick={openCollectionPage}>
          <CollectionIcon
            name={collection_name}
            image={img}
            margin="24px 16px 24px 0"
          />
          <Text>{collectionDisplayName || collection_name}</Text>
        </CollectionNameButton>
      </Row>
      {video ? (
        <TemplateVideo src={templateVideoSrc} autoPlay={false} />
      ) : (
        <TemplateImage
          templateImgSrc={templateImgSrc}
          ipfsHash={image}
          fallbackImgSrc={fallbackImgSrc}
          templateName={name}
        />
      )}
      <Title>{name}</Title>
      <GreyText>
        Edition size: {max_supply === '0' ? 'Unlimited' : max_supply}
      </GreyText>
      {priceSection}
    </Card>
  );
};

export default SearchTemplateCard;
