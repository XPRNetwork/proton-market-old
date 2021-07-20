import { useState, useEffect, FC, Dispatch, SetStateAction } from 'react';
import {
  Title,
  SubTitle,
  Step,
  ElementTitle,
  ErrorMessage,
} from '../CreatePageLayout/CreatePageLayout.styled';
import CollectionsCarousel from '../CollectionsCarousel';
import Button from '../Button';
import {
  useAuthContext,
  useCreateAssetContext,
  CREATE_PAGE_STATES,
} from '../../components/Provider';
import { getAuthorsCollections, Collection } from '../../services/collections';

const ChooseCollection: FC<{
  setPageState: Dispatch<SetStateAction<string>>;
}> = ({ setPageState }) => {
  const { currentUser, isLoadingUser } = useAuthContext();
  const {
    setSelectedCollection,
    setNewCollection,
    setIsUncreatedCollectionSelected,
    selectedCollection,
    newCollection,
  } = useCreateAssetContext();
  const [collectionsList, setCollectionsList] = useState<Collection[]>([]);
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
      setPageState(CREATE_PAGE_STATES.CREATE_TEMPLATE);
    }
  };

  return (
    <>
      <Step>Step 1 of 2</Step>
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
