import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  Title,
  SubTitle,
  Step,
  ElementTitle,
  ErrorMessage,
} from '../CreatePageLayout/CreatePageLayout.styled';
import CollectionsCarousel, {
  NewCollection,
  CarouselCollection,
} from '../CollectionsCarousel';
import { getAuthorsCollections, Collection } from '../../services/collections';
import { useAuthContext } from '../../components/Provider';
import Button from '../../components/Button';

type Props = {
  collectionsList: Collection[];
  setSelectedCollection: Dispatch<SetStateAction<CarouselCollection>>;
  setNewCollection: Dispatch<SetStateAction<NewCollection>>;
  setIsUncreatedCollectionSelected: Dispatch<SetStateAction<boolean>>;
  selectedCollection: CarouselCollection;
  newCollection?: NewCollection;
  goToCreateTemplate: () => void;
  setCollectionsList: Dispatch<SetStateAction<Collection[]>>;
};

const ChooseCollection = ({
  collectionsList,
  setSelectedCollection,
  setNewCollection,
  setIsUncreatedCollectionSelected,
  selectedCollection,
  newCollection,
  goToCreateTemplate,
  setCollectionsList,
}: Props): JSX.Element => {
  const { currentUser, isLoadingUser } = useAuthContext();
  const [fetchError, setFetchError] = useState<string>('');
  const [noneSelectedError, setNoneSelectedError] = useState<string>('');
  const [isLoadingCollections, setIsLoadingCollections] = useState<boolean>(
    true
  );

  useEffect(() => {
    if (currentUser && !isLoadingUser) {
      getUserCollections();
    }
  }, [currentUser, isLoadingUser]);

  const getUserCollections = async () => {
    if (currentUser) {
      try {
        setIsLoadingCollections(true);
        const collections = await getAuthorsCollections(currentUser.actor);
        setCollectionsList(collections);
        setFetchError('');
        setIsLoadingCollections(false);
      } catch (e) {
        setIsLoadingCollections(false);
        setFetchError(e.message || e.error);
      }
    }
  };

  const validateAndProceed = () => {
    if (!selectedCollection.name || !selectedCollection.collection_name) {
      setNoneSelectedError(
        'Please select or create a collection before proceeding.'
      );
    } else {
      setNoneSelectedError('');
      goToCreateTemplate();
    }
  };

  return (
    <>
      <Step>Step 1 of 3</Step>
      <Title>Choose a collection</Title>
      <SubTitle>
        A small fee per NFT may be charged reflecting network costs.
      </SubTitle>
      <ElementTitle>Collections</ElementTitle>
      <CollectionsCarousel
        collectionsList={collectionsList}
        selectedCollection={selectedCollection}
        newCollection={newCollection}
        getUserCollections={getUserCollections}
        setSelectedCollection={setSelectedCollection}
        setNewCollection={setNewCollection}
        setIsUncreatedCollectionSelected={setIsUncreatedCollectionSelected}
        error={fetchError}
        isLoading={isLoadingCollections}
      />
      {noneSelectedError ? (
        <ErrorMessage>{noneSelectedError}</ErrorMessage>
      ) : null}
      <Button onClick={validateAndProceed}>Continue</Button>
    </>
  );
};

export default ChooseCollection;
