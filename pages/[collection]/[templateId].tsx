import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DetailsLayout from '../../components/DetailsLayout';
import ErrorComponent from '../../components/Error';
import PageLayout from '../../components/PageLayout';
import AssetFormBuy from '../../components/AssetFormBuy';
import LoadingPage from '../../components/LoadingPage';
import { useAuthContext } from '../../components/Provider';
import { getTemplateDetails, Template } from '../../services/templates';
import { getAllTemplateSales, SaleAsset } from '../../services/sales';
import ProtonSDK from '../../services/proton';
import * as gtag from '../../utils/gtag';
import { TAB_TYPES, RouterQuery } from '../../utils/constants';
import { usePrevious } from '../../hooks';

const emptyTemplateDetails = {
  lowestPrice: '',
  max_supply: '',
  collection: {
    img: '',
    author: '',
    collection_name: '',
  },
  immutable_data: {
    image: '',
    name: '',
    series: 0,
    desc: '',
  },
};

const MarketplaceTemplateDetail = (): JSX.Element => {
  const router = useRouter();
  const {
    collection: caseSensitiveCollection,
    templateId,
  } = router.query as RouterQuery;
  const collection = caseSensitiveCollection
    ? caseSensitiveCollection.toLowerCase()
    : '';
  const {
    updateCurrentUserBalance,
    currentUser,
    isLoadingUser,
    currentUserBalance,
    login,
  } = useAuthContext();

  const previousTemplateId = usePrevious(templateId);
  const [templateAssets, setTemplateAssets] = useState<SaleAsset[]>([]);
  const [formattedPricesBySaleId, setFormattedPricesBySaleId] = useState<{
    [templateMint: string]: string;
  }>({});
  const [rawPricesBySaleId, setRawPricesBySaleId] = useState<{
    [templateMint: string]: string;
  }>({});
  const [purchasingError, setPurchasingError] = useState<string>('');
  const [isBalanceInsufficient, setIsBalanceInsufficient] = useState<boolean>(
    false
  );
  const [template, setTemplate] = useState<Template>(emptyTemplateDetails);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [saleId, setSaleId] = useState('');
  const [currentAsset, setCurrentAsset] = useState<Partial<SaleAsset>>({});
  const [activeTab, setActiveTab] = useState<string>(TAB_TYPES.ITEM);

  const balanceAmount = parseFloat(
    currentUserBalance.split(' ')[0].replace(/[,]/g, '')
  );
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
    created_at_time,
  } = template;

  useEffect(() => {
    if (!templateId) {
      return;
    }

    if (templateId !== previousTemplateId) {
      setTemplate(emptyTemplateDetails);
    }

    const loadTemplate = async () => {
      try {
        setIsLoading(true);
        const templateDetails = await getTemplateDetails(
          collection,
          templateId
        );
        const {
          formattedPrices,
          rawPrices,
          assets,
        } = await getAllTemplateSales(templateId);

        setTemplateAssets(assets);
        setFormattedPricesBySaleId(formattedPrices);
        setRawPricesBySaleId(rawPrices);
        setIsLoading(false);
        setTemplate(templateDetails);
        setIsLoading(false);
      } catch (e) {
        setError(e.message);
      }
    };

    loadTemplate();
  }, [templateId]);

  useEffect(() => {
    setPurchasingError('');
    if (balanceAmount === 0) {
      setIsBalanceInsufficient(true);
    }
  }, [currentUser, currentUserBalance]);

  const buyAsset = async () => {
    if (!saleId) {
      setPurchasingError('Must select an asset to buy.');
      return;
    }

    try {
      if (!currentUser) {
        setPurchasingError('Must be logged in');
        return;
      }

      const chainAccount = currentUser.actor;
      const purchaseResult = await ProtonSDK.purchaseSale({
        buyer: chainAccount,
        amount: rawPricesBySaleId[saleId],
        sale_id: saleId,
      });

      if (purchaseResult.success) {
        gtag.event({ action: 'buy_nft' });
        updateCurrentUserBalance(chainAccount);
        setTimeout(() => {
          router.push(`/user/${chainAccount}`);
        }, 1000);
      } else {
        throw purchaseResult.error;
      }
    } catch (e) {
      setPurchasingError(e.message);
    }
  };

  const handleButtonClick = currentUser ? buyAsset : login;

  const buttonText = currentUser ? 'Buy now' : 'Connect wallet to buy';

  const getContent = () => {
    if (error) {
      return <ErrorComponent errorMessage={error} />;
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
        createdAtTime={created_at_time}
        currentAsset={currentAsset}
        activeTab={activeTab}
        setActiveTab={setActiveTab}>
        <AssetFormBuy
          description={desc}
          dropdownAssets={templateAssets}
          lowestPrice={lowestPrice}
          maxSupply={max_supply}
          buttonText={buttonText}
          saleId={saleId}
          purchasingError={purchasingError}
          formattedPricesBySaleId={formattedPricesBySaleId}
          isBalanceInsufficient={isBalanceInsufficient}
          handleButtonClick={handleButtonClick}
          setPurchasingError={setPurchasingError}
          setIsBalanceInsufficient={setIsBalanceInsufficient}
          setSaleId={setSaleId}
          setCurrentAsset={setCurrentAsset}
        />
      </DetailsLayout>
    );
  };

  return <PageLayout title={`${name} Details`}>{getContent()}</PageLayout>;
};

export default MarketplaceTemplateDetail;
