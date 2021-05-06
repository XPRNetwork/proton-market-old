/* eslint-disable jsx-a11y/media-has-caption */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import MobileCreatePagePlaceholder from '../components/MobileCreatePagePlaceholder';
import { useAuthContext } from '../components/Provider';
import { Collection } from '../services/collections';
import ProtonSDK from '../services/proton';
import uploadToIPFS from '../services/upload';
import { useNavigatorUserAgent } from '../hooks';
import { fileReader } from '../utils';
import {
  CarouselCollection,
  NewCollection,
} from '../components/CollectionsCarousel';
import NftCreateSuccess from '../components/NftCreateSuccess';
import CreatePageLayout from '../components/CreatePageLayout';
import ChooseCollection from '../components/ChooseCollection';
import CreateTemplate from '../components/CreateTemplate';
import InitialMint from '../components/InitialMint';
import { SHORTENED_TOKEN_PRECISION } from '../utils/constants';
import { useCreateAssetContext } from '../components/Provider';
import fees, { MintFee } from '../services/fees';

const MintFeeInitial = {
  specialMintFee: {
    display: Number('0').toFixed(SHORTENED_TOKEN_PRECISION).toString(),
    raw: 0,
  },
  accountRamFee: {
    display: Number('0').toFixed(SHORTENED_TOKEN_PRECISION).toString(),
    raw: 0,
  },
  userSpecialMintContractRam: 0,
  userAccountRam: 0,
  totalFee: Number('0').toFixed(SHORTENED_TOKEN_PRECISION).toString(),
};

export const CREATE_PAGE_STATES = {
  CHOOSE_COLLECTION: 'CHOOSE_COLLECTION',
  CREATE_TEMPLATE: 'CREATE_TEMPLATE',
  MINT_ASSETS: 'MINT_ASSETS',
  SUCCESS: 'SUCCESS',
};

const placeholderCollection = {
  collection_name: '',
  name: '',
  img: '',
};

const Create = (): JSX.Element => {
  const { updateCachedNewlyCreatedAssets } = useCreateAssetContext();
  const router = useRouter();
  const { currentUser, isLoadingUser } = useAuthContext();
  const { isDesktop } = useNavigatorUserAgent();
  const [
    selectedCollection,
    setSelectedCollection,
  ] = useState<CarouselCollection>(placeholderCollection);
  const [newCollection, setNewCollection] = useState<NewCollection>();
  const [templateName, setTemplateName] = useState<string>('');
  const [templateDescription, setTemplateDescription] = useState<string>('');
  const [templateImage, setTemplateImage] = useState<string>('');
  const [templateVideo, setTemplateVideo] = useState<string>('');
  const [maxSupply, setMaxSupply] = useState<string>();
  const [mintAmount, setMintAmount] = useState<string>();
  const [templateUploadedFile, setTemplateUploadedFile] = useState<File | null>(
    null
  );
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string>('');
  const [collectionsList, setCollectionsList] = useState<Collection[]>([]);
  const [createNftError, setCreateNftError] = useState<string>('');
  const [mintFee, setMintFee] = useState<MintFee>(MintFeeInitial);
  const [
    isUncreatedCollectionSelected,
    setIsUncreatedCollectionSelected,
  ] = useState<boolean>(false);
  const [pageState, setPageState] = useState<string>(
    CREATE_PAGE_STATES.CHOOSE_COLLECTION
  );

  useEffect(() => {
    if (templateUploadedFile && window) {
      const filetype = templateUploadedFile.type;
      if (filetype.includes('video')) {
        const readerSetTemplateVideo = (result) => {
          setTemplateImage('');
          setTemplateVideo(result);
        };
        fileReader(readerSetTemplateVideo, templateUploadedFile);
      } else {
        const readerSetTemplateImage = (result) => {
          setTemplateVideo('');
          setTemplateImage(result);
        };
        fileReader(readerSetTemplateImage, templateUploadedFile);
      }
    } else {
      setTemplateImage('');
      setTemplateVideo('');
    }
  }, [templateUploadedFile]);

  useEffect(() => {
    if (!currentUser && !isLoadingUser) {
      router.push('/');
    }
    (async () => {
      if (currentUser && currentUser.actor) {
        await fees.refreshRamInfoForUser(currentUser.actor);
      }
    })();
  }, [currentUser, isLoadingUser]);

  const createNft = async () => {
    setCreateNftError('');

    try {
      const templateIpfsImage = await uploadToIPFS(templateUploadedFile);
      updateCachedNewlyCreatedAssets({
        [templateIpfsImage]: templateUploadedFile,
      });

      let isVideo = false;
      if (templateUploadedFile.type.includes('mp4')) {
        isVideo = true;
      }

      await fees.refreshRamInfoForUser(currentUser.actor);
      const finalMintFees = fees.calculateCreateFlowFees({
        numAssets: parseInt(mintAmount),
        actor: currentUser ? currentUser.actor : '',
      });

      const result = isUncreatedCollectionSelected
        ? await ProtonSDK.createNft({
            mintFee: finalMintFees,
            author: currentUser.actor,
            collection_name: newCollection.collection_name,
            collection_description: newCollection.description,
            collection_display_name: newCollection.name,
            collection_image: newCollection.img,
            collection_market_fee: (
              parseInt(newCollection.royalties) / 100
            ).toFixed(6),
            template_name: templateName,
            template_description: templateDescription,
            template_image: isVideo ? null : templateIpfsImage,
            template_video: isVideo ? templateIpfsImage : null,
            max_supply: parseInt(maxSupply),
            initial_mint_amount: parseInt(mintAmount),
          })
        : await ProtonSDK.createTemplateAssets({
            mintFee: finalMintFees,
            author: currentUser.actor,
            collection_name: selectedCollection.collection_name,
            template_name: templateName,
            template_image: isVideo ? null : templateIpfsImage,
            template_video: isVideo ? templateIpfsImage : null,
            template_description: templateDescription,
            max_supply: parseInt(maxSupply),
            initial_mint_amount: parseInt(mintAmount),
          });

      if (!result.success) {
        throw new Error();
      }

      setPageState(CREATE_PAGE_STATES.SUCCESS);
      resetCreatePage();
    } catch (err) {
      setCreateNftError('Unable to create the NFT. Please try again.');
    }
  };

  const resetCreatePage = () => {
    // Needed to clean up page in case user comes back to Create from success screen
    setTemplateUploadedFile(null);
    setCollectionsList([]);
    setCreateNftError('');
    setIsUncreatedCollectionSelected(false);
    setNewCollection(null);
    setTemplateName('');
    setTemplateDescription('');
    setTemplateImage('');
    setTemplateVideo('');
    setMaxSupply('');
    setMintAmount('');
    setSelectedCollection(placeholderCollection);
  };

  const getContent = () => {
    if (!currentUser) {
      return null;
    }

    if (!isDesktop) {
      return <MobileCreatePagePlaceholder />;
    }

    switch (pageState) {
      case CREATE_PAGE_STATES.SUCCESS:
        return (
          <NftCreateSuccess
            backToChooseCollection={() =>
              setPageState(CREATE_PAGE_STATES.CHOOSE_COLLECTION)
            }
          />
        );
      case CREATE_PAGE_STATES.CREATE_TEMPLATE:
        return (
          <CreatePageLayout
            templateVideo={templateVideo}
            templateImage={templateImage}
            templateName={templateName}
            selectedCollection={selectedCollection}
            maxSupply={maxSupply}>
            <CreateTemplate
              setTemplateUploadedFile={setTemplateUploadedFile}
              templateUploadedFile={templateUploadedFile}
              goToMint={() => setPageState(CREATE_PAGE_STATES.MINT_ASSETS)}
              templateName={templateName}
              setTemplateName={setTemplateName}
              templateDescription={templateDescription}
              setTemplateDescription={setTemplateDescription}
              maxSupply={maxSupply}
              setMaxSupply={setMaxSupply}
              setPageState={setPageState}
              uploadedFilePreview={uploadedFilePreview}
              setUploadedFilePreview={setUploadedFilePreview}
            />
          </CreatePageLayout>
        );
      case CREATE_PAGE_STATES.MINT_ASSETS:
        return (
          <CreatePageLayout
            templateVideo={templateVideo}
            templateImage={templateImage}
            templateName={templateName}
            selectedCollection={selectedCollection}
            maxSupply={maxSupply}>
            <InitialMint
              mintAmount={mintAmount}
              setMintFee={setMintFee}
              mintFee={mintFee}
              setMintAmount={setMintAmount}
              createNft={createNft}
              createNftError={createNftError}
              setPageState={setPageState}
              maxSupply={maxSupply}
            />
          </CreatePageLayout>
        );
      default:
        return (
          <CreatePageLayout
            templateVideo={templateVideo}
            templateImage={templateImage}
            templateName={templateName}
            selectedCollection={selectedCollection}
            maxSupply={maxSupply}>
            <ChooseCollection
              collectionsList={collectionsList}
              selectedCollection={selectedCollection}
              newCollection={newCollection}
              setSelectedCollection={setSelectedCollection}
              setNewCollection={setNewCollection}
              setIsUncreatedCollectionSelected={
                setIsUncreatedCollectionSelected
              }
              goToCreateTemplate={() =>
                setPageState(CREATE_PAGE_STATES.CREATE_TEMPLATE)
              }
              setCollectionsList={setCollectionsList}
            />
          </CreatePageLayout>
        );
    }
  };

  return <PageLayout title="Create">{getContent()}</PageLayout>;
};

export default Create;
