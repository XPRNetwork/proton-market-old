import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DetailsLayout from '../../../../components/DetailsLayout';
import ErrorComponent from '../../../../components/Error';
import PageLayout from '../../../../components/PageLayout';
import AssetFormSell from '../../../../components/AssetFormSell';
import LoadingPage from '../../../../components/LoadingPage';
import {
  useAuthContext,
  useModalContext,
  MODAL_TYPES,
} from '../../../../components/Provider';
import { getTemplateDetails, Template } from '../../../../services/templates';
import {
  getUserTemplateAssets,
  Asset,
  FullSaleDataByAssetId,
} from '../../../../services/assets';
import fees from '../../../../services/fees';
import { TAB_TYPES, RouterQuery } from '../../../../utils/constants';

const emptyTemplateDetails = {
  lowestPrice: '',
  max_supply: '',
  collection: {
    author: '',
    img: '',
    collection_name: '',
    data: {
      name: '',
      img: '',
      description: '',
    },
  },
  immutable_data: {
    image: '',
    name: '',
    series: 0,
    desc: '',
  },
};

const MyNFTsTemplateDetail = (): JSX.Element => {
  const router = useRouter();
  const {
    templateId,
    chainAccount: caseSensitiveChainAccount,
    collection: caseSensitiveCollection,
  } = router.query as RouterQuery;
  const chainAccount = caseSensitiveChainAccount
    ? caseSensitiveChainAccount.toLowerCase()
    : '';
  const collection = caseSensitiveCollection
    ? caseSensitiveCollection.toLowerCase()
    : '';
  const { currentUser, isLoadingUser } = useAuthContext();
  const { openModal, setModalProps } = useModalContext();

  const [templateAssets, setTemplateAssets] = useState<Asset[]>([]);
  const [
    saleDataByAssetId,
    setSaleDataByAssetId,
  ] = useState<FullSaleDataByAssetId>({});
  const [template, setTemplate] = useState<Template>(emptyTemplateDetails);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentAsset, setCurrentAsset] = useState<Partial<Asset>>({});
  const [assetIds, setAssetIds] = useState<string[]>([]);
  const [saleIds, setSaleIds] = useState<string[]>();
  const [activeTab, setActiveTab] = useState<string>(TAB_TYPES.ITEM);

  const isSelectedAssetBeingSold =
    saleDataByAssetId[currentAsset.asset_id] &&
    saleDataByAssetId[currentAsset.asset_id].rawPrice;
  const {
    lowestPrice,
    max_supply,
    collection: {
      author,
      collection_name,
      name: collectionDisplayName,
      img: collectionImage,
    },
    immutable_data: { image, name, desc, video, model, stage, skybox },
  } = template;

  const fetchPageData = async () => {
    try {
      const owner = currentUser ? currentUser.actor : '';
      setIsLoading(true);

      const templateDetails = await getTemplateDetails(collection, templateId);

      const { assets, saleData } = await getUserTemplateAssets(
        owner,
        templateId
      );

      const assetIds = assets
        .filter(({ asset_id }) => !saleData[asset_id])
        .map(({ asset_id }) => asset_id);

      const saleIds = Object.values(saleData).map(({ saleId }) => saleId);

      setModalProps({
        saleIds,
        assetIds,
        fetchPageData,
        collectionName: templateDetails.collection.collection_name,
        templateId: templateDetails.template_id,
        maxSupply: isNaN(parseInt(templateDetails.max_supply))
          ? 0
          : parseInt(templateDetails.max_supply),
        issuedSupply: isNaN(parseInt(templateDetails.issued_supply))
          ? 0
          : parseInt(templateDetails.issued_supply),
      });

      if (assets[0]) {
        const { asset_id, template_mint } = assets[0];
        setCurrentAsset(assets[0]);
        setModalProps((previousModalProps) => ({
          ...previousModalProps,
          assetId: asset_id,
          templateMint: template_mint,
          saleId: saleData[asset_id] ? saleData[asset_id].saleId : '',
        }));
      }

      setAssetIds(assetIds);
      setSaleIds(saleIds);
      setTemplateAssets(assets);
      setSaleDataByAssetId(saleData);
      setTemplate(templateDetails);
      setIsLoading(false);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (collection && templateId) {
      fetchPageData();
    }
  }, [collection, templateId]);

  useEffect(() => {
    if (
      chainAccount &&
      collection &&
      templateId &&
      (!currentUser || currentUser.actor !== chainAccount)
    ) {
      router.push(`/${collection}/${templateId}`);
    }
    (async () => {
      if (currentUser && currentUser.actor) {
        await fees.refreshRamInfoForUser(currentUser.actor);
      }
    })();
  }, [chainAccount, collection, templateId, currentUser]);

  const setCurrentAssetAsModalProps = () => {
    setModalProps((previousModalProps) => ({
      ...previousModalProps,
      assetId: currentAsset.asset_id,
      templateMint: currentAsset.template_mint,
      saleId: saleDataByAssetId[currentAsset.asset_id]
        ? saleDataByAssetId[currentAsset.asset_id].saleId
        : '',
    }));
  };

  const createSale = () => {
    openModal(MODAL_TYPES.CREATE_SALE);
    setCurrentAssetAsModalProps();
  };

  const cancelSale = () => {
    openModal(MODAL_TYPES.CANCEL_SALE);
    setCurrentAssetAsModalProps();
  };
  const handleButtonClick = isSelectedAssetBeingSold ? cancelSale : createSale;
  const buttonText = isSelectedAssetBeingSold ? 'Cancel Sale' : 'Mark for sale';

  const getContent = () => {
    if (error) {
      return (
        <ErrorComponent
          errorMessage={error}
          buttonText="Try again"
          buttonOnClick={() => router.reload()}
        />
      );
    }

    if (isLoading || isLoadingUser) {
      return <LoadingPage />;
    }

    return (
      <DetailsLayout
        templateId={templateId}
        templateName={name}
        collectionDisplayName={collectionDisplayName}
        collectionName={collection_name}
        collectionAuthor={author}
        collectionImage={collectionImage}
        error={error}
        image={image}
        video={video}
        model={model}
        stage={stage}
        skybox={skybox}
        currentAsset={currentAsset}
        assetIds={assetIds}
        saleIds={saleIds}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setCurrentAssetAsModalProps={setCurrentAssetAsModalProps}>
        <AssetFormSell
          description={desc}
          dropdownAssets={templateAssets}
          lowestPrice={lowestPrice}
          maxSupply={max_supply}
          buttonText={buttonText}
          assetId={currentAsset.asset_id}
          handleButtonClick={handleButtonClick}
          setCurrentAsset={setCurrentAsset}
        />
      </DetailsLayout>
    );
  };

  return <PageLayout title={`${name} Details`}>{getContent()}</PageLayout>;
};

export default MyNFTsTemplateDetail;
