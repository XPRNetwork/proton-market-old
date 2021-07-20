import { FC } from 'react';
import {
  Card,
  Row,
  Title,
  Text,
  GreyText,
  CollectionNameButton,
  PlaceholderIcon,
} from './PreviewTemplateCard.styled';
import CollectionIcon, { IconContainer } from '../CollectionIcon';
import TemplateImage from '../TemplateImage';
import TemplateVideo from '../TemplateVideo';

type Props = {
  templateVideo?: string;
  templateImage?: string;
  templateName: string;
  collectionImage?: string;
  collectionDisplayName?: string;
  collectionName: string;
  maxSupply: string;
  hasPlaceholderIcon?: boolean;
};

const PreviewTemplateCard: FC<Props> = ({
  collectionName,
  templateName,
  maxSupply,
  collectionDisplayName,
  collectionImage,
  templateVideo,
  templateImage,
  hasPlaceholderIcon,
}) => {
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
    <Card tabIndex={0}>
      <Row>
        <CollectionNameButton>
          {collectionIcon}
          <Text>{collectionDisplayName || collectionName}</Text>
        </CollectionNameButton>
      </Row>
      {templateVideo ? (
        <TemplateVideo src={templateVideo} autoPlay={true} />
      ) : (
        <TemplateImage
          templateImgSrc={templateImage}
          templateName={templateName}
        />
      )}
      <Title>{templateName}</Title>
      <GreyText>
        Edition size: {maxSupply === '0' ? 'Unlimited' : maxSupply}
      </GreyText>
    </Card>
  );
};

PreviewTemplateCard.defaultProps = {
  collectionName: 'Collection',
  templateName: 'Name',
  maxSupply: null,
};

export default PreviewTemplateCard;
