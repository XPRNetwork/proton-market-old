import { useState, useEffect } from 'react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import { ReactComponent as Arrow } from '../../public/chevron-right.svg';
import {
  Template,
  getAllTemplatesByCollection,
  formatTemplatesWithPriceData,
  getLowestPricesForAllCollectionTemplates,
} from '../../services/templates';
import {
  CarouselContainer,
  CarouselStyleFix,
  ButtonBackContainer,
  ButtonNextContainer,
  SpinnerContainer,
  TryAgainButton,
  ErrorMessage,
} from './FeaturedCarousel.styled';
import TemplateCard from '../../components/TemplateCard';
import Spinner from '../../components/Spinner';
import { useWindowSize } from '../../hooks';

type FeaturedCarouselProps = {
  collection: string;
};

// UNUSED COMPONENT: Keeping to potentially easily swap out with FeaturedGrid component on home page
const FeaturedCarousel = ({
  collection,
}: FeaturedCarouselProps): JSX.Element => {
  const [slideStep, setSlideStep] = useState<number>(4);
  const [visibleSlides, setVisibleSlides] = useState<number>(4);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { isDesktop, isLaptop, isTablet, isMobile } = useWindowSize();

  const getTemplates = async () => {
    setIsLoading(true);
    try {
      const templates = await getAllTemplatesByCollection({ type: collection });
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

  useEffect(() => {
    if (isDesktop) {
      setVisibleSlides(4);
      setSlideStep(4);
    } else if (isLaptop) {
      setVisibleSlides(3);
      setSlideStep(3);
    } else if (isTablet) {
      setVisibleSlides(2);
      setSlideStep(2);
    } else {
      setVisibleSlides(1);
      setSlideStep(1);
    }
  }, [isDesktop, isLaptop, isTablet, isMobile]);

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
      return (
        <CarouselContainer>
          <CarouselStyleFix>
            <CarouselProvider
              naturalSlideWidth={320}
              naturalSlideHeight={504}
              isIntrinsicHeight
              step={slideStep}
              dragStep={slideStep}
              visibleSlides={visibleSlides}
              infinite
              totalSlides={templates.length}
              hasMasterSpinner={isLoading}
              dragEnabled={true}>
              <Slider>
                {templates.map(
                  (
                    {
                      name,
                      template_id,
                      collection: {
                        collection_name,
                        img,
                        name: collectionDisplayName,
                      },
                      immutable_data: { image, video },
                      issued_supply,
                      max_supply,
                      lowestPrice,
                      totalAssets,
                      assetsForSale,
                    },
                    i
                  ) => {
                    const redirectPath = `/${collection_name}/${template_id}`;
                    const hasMultiple =
                      !totalAssets && !isNaN(parseInt(issued_supply))
                        ? parseInt(issued_supply) > 1
                        : false;
                    return (
                      <Slide index={i} key={template_id}>
                        <TemplateCard
                          key={template_id}
                          collectionDisplayName={collectionDisplayName}
                          collectionName={collection_name}
                          templateName={name}
                          maxSupply={max_supply}
                          redirectPath={redirectPath}
                          isUsersTemplates={false}
                          totalAssets={totalAssets}
                          assetsForSale={assetsForSale}
                          collectionImage={img}
                          templateVideo={video}
                          templateImage={image}
                          price={lowestPrice}
                          hasMultiple={hasMultiple}
                          noHoverEffect
                          imageHoverEffect
                        />
                      </Slide>
                    );
                  }
                )}
              </Slider>
              <ButtonBackContainer
                display={!isLoading && templates.length > visibleSlides}>
                <ButtonBack>
                  <Arrow />
                </ButtonBack>
              </ButtonBackContainer>
              <ButtonNextContainer
                display={!isLoading && templates.length > visibleSlides}>
                <ButtonNext>
                  <Arrow />
                </ButtonNext>
              </ButtonNextContainer>
            </CarouselProvider>
          </CarouselStyleFix>
        </CarouselContainer>
      );
    }
  };

  return getContent();
};

export default FeaturedCarousel;
