import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import Grid from '../components/Grid';
import PaginationButton from '../components/PaginationButton';
import ErrorComponent from '../components/Error';
import LoadingPage from '../components/LoadingPage';
import { Title, PurpleSpan } from '../styles/Title.styled';
import { useAuthContext } from '../components/Provider';
import {
  Template,
  getTemplatesByCollection,
  formatTemplatesWithPriceData,
  getLowestPricesForAllCollectionTemplates,
} from '../services/templates';
import { PAGINATION_LIMIT } from '../utils/constants';

const Search = (): JSX.Element => {
  const router = useRouter();
  const { isLoadingUser } = useAuthContext();
  const searchTerm = router.query.keywords
    ? (router.query.keywords as string).toLowerCase()
    : '';
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

  const prefetchNextPage = async () => {
    const prefetchedResult = await getTemplatesByCollection({
      type: searchTerm,
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

  useEffect(() => {
    (async () => {
      if (searchTerm) {
        setIsLoading(true);
        try {
          const templates = await getTemplatesByCollection({
            type: searchTerm,
          });

          const lowestPricesResult = await getLowestPricesForAllCollectionTemplates(
            {
              type: searchTerm,
            }
          );
          setLowestPrices(lowestPricesResult);

          const templatesWithLowestPrice = formatTemplatesWithPriceData(
            templates,
            lowestPricesResult
          );
          setRenderedTemplates(templatesWithLowestPrice);

          await prefetchNextPage();
        } catch (e) {
          setErrorMessage(e.message);
        }
        setIsLoading(false);
      }
    })();
  }, [searchTerm]);

  const getContent = () => {
    if (isLoading || isLoadingUser) {
      return <LoadingPage />;
    }

    if (!renderedTemplates.length) {
      return (
        <ErrorComponent errorMessage="No templates were found for this collection type." />
      );
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

    const title = searchTerm ? (
      <>
        Search results for “<PurpleSpan>{searchTerm}</PurpleSpan>”
      </>
    ) : (
      'No results found'
    );

    return (
      <>
        <Title>{title}</Title>
        <Grid items={renderedTemplates} />
        <PaginationButton
          onClick={showNextPage}
          isHidden={renderedTemplates.length < PAGINATION_LIMIT}
          isLoading={isLoadingNextPage}
          disabled={prefetchPageNumber === -1}
          autoLoad
        />
      </>
    );
  };

  return <PageLayout title="Search Results">{getContent()}</PageLayout>;
};

export default Search;
