import {
  FC,
  createContext,
  useState,
  useContext,
  useMemo,
  SetStateAction,
  Dispatch,
} from 'react';
import { CarouselCollection, NewCollection } from '../CollectionsCarousel';
import ProtonSDK from '../../services/proton';
import fees, { MintFee } from '../../services/fees';
import uploadToIPFS from '../../services/upload';
import {
  LG_FILE_UPLOAD_TYPES_TEXT,
  SHORTENED_TOKEN_PRECISION,
} from '../../utils/constants';

export const CREATE_PAGE_STATES = {
  CHOOSE_COLLECTION: 'CHOOSE_COLLECTION',
  CREATE_TEMPLATE: 'CREATE_TEMPLATE',
  SUCCESS: 'SUCCESS',
};

const placeholderCollection = {
  collection_name: '',
  name: '',
  img: '',
};

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

interface CreateAssetContext {
  setSelectedCollection: Dispatch<SetStateAction<CarouselCollection>>;
  setNewCollection: Dispatch<SetStateAction<NewCollection>>;
  setTemplateName: Dispatch<SetStateAction<string>>;
  setTemplateDescription: Dispatch<SetStateAction<string>>;
  setTemplateImage: Dispatch<SetStateAction<string>>;
  setTemplateVideo: Dispatch<SetStateAction<string>>;
  setMaxSupply: Dispatch<SetStateAction<string>>;
  setMintAmount: Dispatch<SetStateAction<string>>;
  setTemplateUploadedFile: Dispatch<SetStateAction<File | null>>;
  setUploadedFilePreview: Dispatch<SetStateAction<string>>;
  setMintFee: Dispatch<SetStateAction<MintFee>>;
  setIsUncreatedCollectionSelected: Dispatch<SetStateAction<boolean>>;
  createNft: (author: string) => Promise<string[]>;
  selectedCollection: CarouselCollection;
  newCollection: NewCollection;
  templateName: string;
  templateDescription: string;
  templateImage: string;
  templateVideo: string;
  maxSupply: string;
  mintAmount: string;
  templateUploadedFile: File | null;
  uploadedFilePreview: string;
  mintFee: MintFee;
  isUncreatedCollectionSelected: boolean;
}

const CreateAssetContext = createContext<CreateAssetContext>({
  setSelectedCollection: () => {},
  setNewCollection: () => {},
  setTemplateName: () => {},
  setTemplateDescription: () => {},
  setTemplateImage: () => {},
  setTemplateVideo: () => {},
  setMaxSupply: () => {},
  setMintAmount: () => {},
  setTemplateUploadedFile: () => {},
  setUploadedFilePreview: () => {},
  setMintFee: () => {},
  setIsUncreatedCollectionSelected: () => {},
  createNft: async () => [],
  selectedCollection: placeholderCollection,
  newCollection: undefined,
  templateName: '',
  templateDescription: '',
  templateImage: '',
  templateVideo: '',
  maxSupply: '',
  mintAmount: '',
  templateUploadedFile: undefined,
  uploadedFilePreview: '',
  mintFee: MintFeeInitial,
  isUncreatedCollectionSelected: false,
});

export const useCreateAssetContext = (): CreateAssetContext => {
  const context = useContext(CreateAssetContext);
  return context;
};

export const CreateAssetProvider: FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const [
    selectedCollection,
    setSelectedCollection,
  ] = useState<CarouselCollection>(placeholderCollection);
  const [newCollection, setNewCollection] = useState<NewCollection>();
  const [templateName, setTemplateName] = useState<string>('');
  const [templateDescription, setTemplateDescription] = useState<string>('');
  const [templateImage, setTemplateImage] = useState<string>('');
  const [templateVideo, setTemplateVideo] = useState<string>('');
  const [maxSupply, setMaxSupply] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const [templateUploadedFile, setTemplateUploadedFile] = useState<File | null>(
    null
  );
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string>('');
  const [mintFee, setMintFee] = useState<MintFee>(MintFeeInitial);
  const [
    isUncreatedCollectionSelected,
    setIsUncreatedCollectionSelected,
  ] = useState<boolean>(false);

  const resetCreatePage = () => {
    setTemplateUploadedFile(null);
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

  const getCreateTemplateValidationErrors = (): string[] => {
    const errors = [];

    if (!templateUploadedFile) {
      errors.push(`upload a ${LG_FILE_UPLOAD_TYPES_TEXT}`);
    }
    if (!templateName) {
      errors.push('set a name');
    }

    if (!templateDescription) {
      errors.push('set a description');
    }

    if (typeof maxSupply === 'undefined' || isNaN(parseInt(maxSupply))) {
      errors.push(
        "set the template's maximum edition size (0 for no maximum edition size)"
      );
    }

    if (!mintAmount) {
      errors.push('set an initial mint amount (minimum 1)');
    }

    if (maxSupply !== '0' && parseInt(mintAmount) > parseInt(maxSupply)) {
      errors.push('set an initial mint amount less than the edition size');
    }

    return errors;
  };

  const createNft = async (author: string): Promise<string[]> => {
    const errors = getCreateTemplateValidationErrors();
    if (errors.length) {
      return errors;
    }

    try {
      const templateIpfsImage = await uploadToIPFS(templateUploadedFile);

      if (!templateIpfsImage) {
        const errors = ['try again (unable to upload image)'];
        return errors;
      }

      let isVideo = false;
      if (templateUploadedFile.type.includes('mp4')) {
        isVideo = true;
      }

      await fees.refreshRamInfoForUser(author);
      const finalMintFees = fees.calculateCreateFlowFees({
        numAssets: parseInt(mintAmount),
        actor: author,
      });

      const result = isUncreatedCollectionSelected
        ? await ProtonSDK.createNft({
            mintFee: finalMintFees,
            author,
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
            author,
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

      resetCreatePage();
      return errors;
    } catch (err) {
      errors.push(err.message || 'Unable to create the NFT. Please try again.');
      return errors;
    }
  };

  const value = useMemo<CreateAssetContext>(
    () => ({
      setSelectedCollection,
      setNewCollection,
      setTemplateName,
      setTemplateDescription,
      setTemplateImage,
      setTemplateVideo,
      setMaxSupply,
      setMintAmount,
      setTemplateUploadedFile,
      setUploadedFilePreview,
      setMintFee,
      setIsUncreatedCollectionSelected,
      createNft,
      selectedCollection,
      newCollection,
      templateName,
      templateDescription,
      templateImage,
      templateVideo,
      maxSupply,
      mintAmount,
      templateUploadedFile,
      uploadedFilePreview,
      mintFee,
      isUncreatedCollectionSelected,
    }),
    [
      selectedCollection,
      newCollection,
      templateName,
      templateDescription,
      templateImage,
      templateVideo,
      maxSupply,
      mintAmount,
      templateUploadedFile,
      uploadedFilePreview,
      mintFee,
      isUncreatedCollectionSelected,
    ]
  );

  return (
    <CreateAssetContext.Provider value={value}>
      {children}
    </CreateAssetContext.Provider>
  );
};
