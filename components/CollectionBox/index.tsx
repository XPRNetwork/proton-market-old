import { BoxContainer, CollectionName } from './CollectionBox.styled';
import CollectionIcon from '../CollectionIcon';
import { CarouselCollection } from '../CollectionsCarousel';

type CollectionBoxProps = {
  collection: CarouselCollection;
  active?: boolean;
};

const CollectionBox = ({
  collection,
  active,
}: CollectionBoxProps): JSX.Element => {
  const { collection_name, name, img } = collection;

  return (
    <BoxContainer active={active}>
      <CollectionIcon name={collection_name} image={img} width="40px" />
      <CollectionName>{name || collection_name}</CollectionName>
    </BoxContainer>
  );
};

export default CollectionBox;
