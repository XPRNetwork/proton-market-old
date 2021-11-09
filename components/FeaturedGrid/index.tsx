import { useState, useEffect } from 'react';
import {
  Template,
  getAllTemplatesByCollection,
  formatTemplatesWithPriceData,
  getLowestPricesForAllCollectionTemplates,
} from '../../services/templates';
import {
  CarouselContainer,
  SpinnerContainer,
  TryAgainButton,
  ErrorMessage,
} from '../FeaturedCarousel/FeaturedCarousel.styled';
import Grid from '../Grid';
import Spinner from '../Spinner';

type FeaturedCarouselProps = {
  collection: string;
};

const FeaturedCarousel = ({
  collection,
}: FeaturedCarouselProps): JSX.Element => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const getTemplates = async () => {
    setIsLoading(true);
    try {
      const templates = await getAllTemplatesByCollection({
        type: collection,
        limit: 4,
      });
      const prices = await getLowestPricesForAllCollectionTemplates({
        type: collection,
      });
      const templatesWithLowestPrice = formatTemplatesWithPriceData(
        templates,
        prices
      );
      setTemplates(templatesWithLowestPrice);
      setError('');
    } catch (e) {
      setError(e.error || e.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getTemplates();
    })();
  }, []);

  const getContent = () => {
    if (isLoading) {
      return (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      );
    } else if (error) {
      return (
        <CarouselContainer>
          <ErrorMessage>Unable to get {collection}</ErrorMessage>
          <TryAgainButton onClick={getTemplates}>Try Again</TryAgainButton>
        </CarouselContainer>
      );
    } else {
      return <Grid items={templates} />;
    }
  };

  return getContent();
};

export default FeaturedCarousel;
