import { useRef } from 'react';
import LazyLoad from 'react-lazyload';
import { ImageContainer } from './TemplateImage.styled';
import { PlaceholderAsset } from '../TemplateCard/TemplateCard.styled';
import ImageWrapper from '../ImageWrapper';

type Props = {
  templateImgSrc?: string;
  fallbackImgSrc?: string;
  templateName: string;
  priceTag?: JSX.Element;
  ipfsHash?: string;
};

const TemplateImageChild = ({
  templateName,
  templateImgSrc,
  fallbackImgSrc,
  ipfsHash,
}: {
  templateName: string;
  templateImgSrc: string;
  fallbackImgSrc: string;
  ipfsHash: string;
}): JSX.Element => {
  const refPlaceholder = useRef<HTMLDivElement>();

  const removePlaceholder = () => {
    if (refPlaceholder && refPlaceholder.current) {
      refPlaceholder.current.remove();
    }
  };

  return (
    <div>
      <PlaceholderAsset ref={refPlaceholder} />
      <LazyLoad height="100%" offset={100} once>
        <ImageWrapper
          src={templateImgSrc}
          alt={templateName}
          ipfsHash={ipfsHash}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImgSrc;
            removePlaceholder();
          }}
          onLoad={removePlaceholder}
        />
      </LazyLoad>
    </div>
  );
};

const TemplateImage = ({
  templateName,
  templateImgSrc,
  priceTag,
  fallbackImgSrc,
  ipfsHash = '',
}: Props): JSX.Element => {
  if (!fallbackImgSrc) {
    fallbackImgSrc = '/placeholder-template-image.png';
  }

  return (
    <ImageContainer className="template-image-container">
      <TemplateImageChild
        templateName={templateName}
        fallbackImgSrc={fallbackImgSrc}
        templateImgSrc={templateImgSrc}
        ipfsHash={ipfsHash}
      />
      {priceTag}
    </ImageContainer>
  );
};

export default TemplateImage;
