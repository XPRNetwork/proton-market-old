import TemplateCard from '../TemplateCard';
import {
  Container,
  Row,
  LeftColumn,
  RightColumn,
  ElementTitle,
} from './CreatePageLayout.styled';
import { CarouselCollection } from '../CollectionsCarousel';

type Props = {
  children: JSX.Element;
  templateVideo: string;
  templateImage: string;
  templateName: string;
  selectedCollection: CarouselCollection;
  maxSupply: string;
};

const CreatePageLayout = ({
  children,
  templateVideo,
  templateImage,
  templateName,
  selectedCollection,
  maxSupply,
}: Props): JSX.Element => {
  return (
    <Container>
      <Row>
        <LeftColumn>{children}</LeftColumn>
        <RightColumn>
          <ElementTitle>Preview</ElementTitle>
          <TemplateCard
            templateVideo={templateVideo}
            templateImage={templateImage}
            templateName={templateName}
            collectionImage={selectedCollection.img}
            collectionDisplayName={selectedCollection.name}
            collectionName={selectedCollection.collection_name}
            maxSupply={maxSupply}
            noHoverEffect
            noIpfsConversion
            isStatic
            autoPlay
            hasPlaceholderIcon={!selectedCollection.name}
          />
        </RightColumn>
      </Row>
    </Container>
  );
};

export default CreatePageLayout;
