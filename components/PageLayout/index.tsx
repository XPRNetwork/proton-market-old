import { ReactNode } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Main, Container } from './PageLayout.styled';
import { useModalContext, MODAL_TYPES } from '../Provider';
import {
  ClaimBalanceModal,
  CreateSaleModal,
  CreateMultipleSalesModal,
  CancelSaleModal,
  CancelMultipleSalesModal,
  TransferModal,
  CreateCollectionModal,
  UpdateCollectionModal,
  MintAssetModal,
  BurnAssetModal,
} from '../Modal';
import { useEscapeKeyClose } from '../../hooks';
import { META } from '../../utils/constants';

type Props = {
  title?: string;
  children: ReactNode;
};

const PageLayout = ({ title, children }: Props): JSX.Element => {
  const { closeModal, modalType } = useModalContext();
  useEscapeKeyClose(closeModal);

  Router.events.on('routeChangeComplete', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  });

  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPES.CLAIM:
        return <ClaimBalanceModal />;
      case MODAL_TYPES.CREATE_SALE:
        return <CreateSaleModal />;
      case MODAL_TYPES.CREATE_MULTIPLE_SALES:
        return <CreateMultipleSalesModal />;
      case MODAL_TYPES.CANCEL_SALE:
        return <CancelSaleModal />;
      case MODAL_TYPES.CANCEL_MULTIPLE_SALES:
        return <CancelMultipleSalesModal />;
      case MODAL_TYPES.TRANSFER:
        return <TransferModal />;
      case MODAL_TYPES.CREATE_COLLECTION:
        return <CreateCollectionModal />;
      case MODAL_TYPES.UPDATE_COLLECTION:
        return <UpdateCollectionModal />;
      case MODAL_TYPES.MINT_ASSET:
        return <MintAssetModal />;
      case MODAL_TYPES.BURN_ASSET:
        return <BurnAssetModal />;
      default:
        return null;
    }
  };

  const fullTitle = title ? `${title} - ${META.siteName}` : META.siteName;

  return (
    <Main>
      <Head>
        <title>{fullTitle}</title>
        <link rel="shortcut icon" href="/favicon.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" key="twcard" />
        <meta name="twitter:site" content={META.twitterHandle} key="twhandle" />
        <meta name="twitter:image" content={META.bannerImage} key="twimage" />
        <meta name="twitter:title" content={fullTitle} key="twtitle" />
        <meta
          name="twitter:description"
          content={META.description}
          key="twdescription"
        />

        {/* Open Graph */}
        <meta name="og:site_name" content={META.siteName} key="ogsitename" />
        <meta name="og:image" content={META.bannerImage} key="ogimage" />
        <meta
          name="og:description"
          content={META.description}
          key="ogdescription"
        />
      </Head>

      <Container>{children}</Container>

      {renderModal()}
    </Main>
  );
};

export default PageLayout;
