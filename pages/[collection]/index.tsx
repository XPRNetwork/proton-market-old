import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../../components/PageLayout';
import Grid from '../../components/Grid';
import PaginationButton from '../../components/PaginationButton';
import ErrorComponent from '../../components/Error';
import LoadingPage from '../../components/LoadingPage';
import EmptySectionContent from '../../components/EmptySectionContent';
import {
  Template,
  getTemplatesByCollection,
  formatTemplatesWithPriceData,
  getLowestPricesForAllCollectionTemplates,
} from '../../services/templates';
import {
  getCollection,
  Collection,
  emptyCollection,
} from '../../services/collections';
import {
  PAGINATION_LIMIT,
  RouterQuery,
  CARD_RENDER_TYPES,
} from '../../utils/constants';
import Banner from '../../components/Banner';
import PageHeader from '../../components/PageHeader';
import {
  MODAL_TYPES,
  useAuthContext,
  useModalContext,
} from '../../components/Provider';
import { useNavigatorUserAgent, usePrevious } from '../../hooks';

const CollectionPage = (): JSX.Element => {
  const router = useRouter();
  const { isLoadingUser, currentUser } = useAuthContext();
  const { setModalProps } = useModalContext();
  const { isDesktop } = useNavigatorUserAgent();
  const { collection: caseSensitiveCollection } = router.query as RouterQuery;
  const collection = caseSensitiveCollection
    ? caseSensitiveCollection.toLowerCase()
    : '';
  const previousCollection = usePrevious(collection);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lowestPrices, setLowestPrices] = useState<{ [id: string]: string }>(
    {}
  );
  const [renderedTemplates, setRenderedTemplates] = useState<Template[]>([]);
  const [prefetchedTemplates, setPrefetchedTemplates] = useState<Template[]>(
    []
  );
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [collectionData, setCollectionData] = useState<Collection>(
    emptyCollection
  );
  const isEditButtonVisible =
    isDesktop &&
    currentUser &&
    collectionData &&
    currentUser.actor === collectionData.author;

  const prefetchNextPage = async () => {
    const prefetchedResult = await getTemplatesByCollection({
      type: collection,
      page: prefetchPageNumber,
    });

    setPrefetchedTemplates(prefetchedResult as Template[]);

    if (!prefetchedResult.length) {
      setPrefetchPageNumber(-1);
    } else {
      setPrefetchPageNumber(prefetchPageNumber + 1);
    }

    setIsLoadingNextPage(false);
  };

  const showNextPage = async () => {
    const allFetchedTemplates = formatTemplatesWithPriceData(
      renderedTemplates.concat(prefetchedTemplates),
      lowestPrices
    );
    setRenderedTemplates(allFetchedTemplates);
    setIsLoadingNextPage(true);
    await prefetchNextPage();
  };

  const fetchCollection = async () => {
    try {
      setIsLoading(true);
      const collectionResult = await getCollection(collection);
      setCollectionData(collectionResult);

      const templates = await getTemplatesByCollection({
        type: collection,
      });

      const lowestPricesResult = await getLowestPricesForAllCollectionTemplates(
        {
          type: collection,
        }
      );
      setLowestPrices(lowestPricesResult);

      const templatesWithLowestPrice = formatTemplatesWithPriceData(
        templates,
        lowestPricesResult
      );

      setRenderedTemplates(templatesWithLowestPrice);

      setIsLoading(false);
      await prefetchNextPage();
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e.message);
    }
  };

  useEffect(() => {
    (async () => {
      if (
        collection &&
        (!renderedTemplates.length || collection !== previousCollection)
      ) {
        await fetchCollection();
      }
    })();
  }, [collection]);

  useEffect(() => {
    if (collectionData) {
      const {
        name,
        collection_name,
        img,
        market_fee,
        data: { description },
      } = collectionData;

      setModalProps({
        collectionName: collection_name,
        defaultDescription: description,
        defaultDisplayName: name,
        defaultImage: img,
        defaultRoyalties: market_fee.toString(),
        fetchPageData: fetchCollection,
      });
    }
  }, [collectionData]);

  const getContent = () => {
    if (isLoading || isLoadingUser) {
      return <LoadingPage />;
    }

    if (errorMessage) {
      return (
        <ErrorComponent
          errorMessage={errorMessage}
          buttonText="Try again"
          buttonOnClick={() => router.reload()}
        />
      );
    }

    const {
      name,
      img,
      author,
      data: { description },
    } = collectionData;

    return (
      <>
        <PageHeader
          image={img}
          name={name || collection}
          description={description}
          type="collection"
          hasEditFunctionality={isEditButtonVisible}
          author={author}
        />
        {renderedTemplates.length ? (
          <>
            <Grid items={renderedTemplates} />
            <PaginationButton
              onClick={showNextPage}
              isHidden={renderedTemplates.length < PAGINATION_LIMIT}
              isLoading={isLoadingNextPage}
              disabled={prefetchPageNumber === -1}
              autoLoad
            />
          </>
        ) : (
          <EmptySectionContent
            subtitle="No templates were found for this collection type."
            hasTopBorder
          />
        )}
      </>
    );
  };

  return (
    <PageLayout title="Collection">
      <Banner modalType={MODAL_TYPES.CLAIM} />
      {getContent()}
    </PageLayout>
  );
};

export default CollectionPage;
