import {
  useMemo,
  useState,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { useScrollLock } from '../../hooks';
import { CarouselCollection, NewCollection } from '../CollectionsCarousel';

export const MODAL_TYPES = {
  HIDDEN: 'HIDDEN',
  CLAIM: 'CLAIM',
  CREATE_SALE: 'CREATE_SALE',
  CREATE_MULTIPLE_SALES: 'CREATE_MULTIPLE_SALES',
  CANCEL_SALE: 'CANCEL_SALE',
  CANCEL_MULTIPLE_SALES: 'CANCEL_MULTIPLE_SALES',
  TRANSFER: 'TRANSFER',
  CREATE_COLLECTION: 'CREATE_COLLECTION',
  UPDATE_COLLECTION: 'UPDATE_COLLECTION',
  MINT_ASSET: 'MINT_ASSET',
  BURN_ASSET: 'BURN_ASSET',
};

type Props = {
  children: ReactNode;
};

export interface GeneralModalProps {
  fetchPageData: () => Promise<void>;
}

export interface CancelSaleModalProps extends GeneralModalProps {
  saleId: string;
}

export interface CancelMultipleSalesModalProps extends GeneralModalProps {
  saleIds: string[];
}

export interface CreateSaleModalProps extends GeneralModalProps {
  assetId: string;
  accountRam: number;
  conversionRate: number;
  setIsModalWithFeeOpen: Dispatch<SetStateAction<boolean>>;
}

export interface CreateMultipleSalesModalProps extends GeneralModalProps {
  assetIds: string[];
  accountRam: number;
  conversionRate: number;
  collection: string;
  setIsModalWithFeeOpen: Dispatch<SetStateAction<boolean>>;
}

export interface TransferOrBurnNFTModalProps extends GeneralModalProps {
  assetId: string;
  templateMint: string;
}

export interface CreateCollectionProps {
  setNewCollection: Dispatch<SetStateAction<NewCollection>>;
  setSelectedCollection: Dispatch<SetStateAction<CarouselCollection>>;
  setIsUncreatedCollectionSelected: Dispatch<SetStateAction<boolean>>;
}

export interface UpdateCollectionProps extends GeneralModalProps {
  collectionName: string;
  defaultDescription: string;
  defaultDisplayName: string;
  defaultRoyalties: string;
  defaultImage: string;
}

export interface MintAssetModalProps extends GeneralModalProps {
  collectionName: string;
  templateId: string;
  maxSupply: number;
  accountRam: number;
  conversionRate: number;
  setIsModalWithFeeOpen: Dispatch<SetStateAction<boolean>>;
  issuedSupply: number;
}

type ModalProps =
  | GeneralModalProps
  | CancelSaleModalProps
  | CancelMultipleSalesModalProps
  | CreateSaleModalProps
  | CreateMultipleSalesModalProps
  | TransferOrBurnNFTModalProps
  | CreateCollectionProps
  | UpdateCollectionProps
  | MintAssetModalProps;

type ModalContextValue = {
  modalType: string;
  openModal: (type: string) => void;
  closeModal: () => void;
  modalProps: ModalProps;
  setModalProps: Dispatch<SetStateAction<ModalProps>>;
};

const ModalContext = createContext<ModalContextValue>({
  modalType: MODAL_TYPES.HIDDEN,
  openModal: undefined,
  closeModal: undefined,
  modalProps: undefined,
  setModalProps: () => {},
});

export const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext);
  return context;
};

export const ModalProvider = ({ children }: Props): JSX.Element => {
  const [modalType, setModalType] = useState<string>(MODAL_TYPES.HIDDEN);
  const [modalProps, setModalProps] = useState<ModalProps>(undefined);
  const openModal = (type: string) => setModalType(type);
  const closeModal = () => setModalType(MODAL_TYPES.HIDDEN);
  useScrollLock(modalType !== MODAL_TYPES.HIDDEN);

  const value = useMemo<ModalContextValue>(
    () => ({
      modalType,
      modalProps,
      openModal,
      closeModal,
      setModalProps,
    }),
    [modalType, modalProps]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
