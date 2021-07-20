import { FC, useEffect, useState } from 'react';
import TabSection, {
  SectionContainerProps,
  SectionContentByFilter,
  defaultSectionContentByFilter,
} from '.';
import LoadingPage from '../LoadingPage';
import { useAuthContext } from '../Provider';
import { Section } from './TabSection.styled';
import { getAllTemplatesForUserWithAssetCount } from '../../services/templates';
import {
  Template,
  getLowestPricesByTemplateId,
} from '../../services/templates';
import {
  PAGINATION_LIMIT,
  FILTER_TYPES,
  TAB_TYPES,
  CARD_RENDER_TYPES,
  Filter,
} from '../../utils/constants';
const { NAME_AZ, NAME_ZA, OLDEST, NEWEST } = FILTER_TYPES;

export const TabSectionUserProfileItems: FC<SectionContainerProps> = ({
  chainAccount,
  ...tabsProps
}) => {
  const { currentUser } = useAuthContext();
  const [allItems, setAllItems] = useState<SectionContentByFilter>(
    defaultSectionContentByFilter
  );
  const [renderedItems, setRenderedItems] = useState<Template[]>([]);
  const [nextPageNumber, setNextPageNumber] = useState<number>(2);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoadingInitialMount, setIsLoadingInitialMount] = useState<boolean>(
    true
  );
  const [itemsFilter, setItemsFilter] = useState<Filter>(NEWEST);

  const isUsersPage = currentUser && currentUser.actor === chainAccount;

  useEffect(() => {
    (async () => {
      if (chainAccount) {
        setIsFetching(true);
        setIsLoadingPrices(true);
        setIsLoadingInitialMount(true);

        try {
          const {
            templates,
            collectionNames,
          } = await getAllTemplatesForUserWithAssetCount(chainAccount);
          const allItemsByFilter = {
            [NAME_AZ.label]: templates
              .slice()
              .sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
              ),
            [NEWEST.label]: templates,
          };

          setAllItems(allItemsByFilter);
          setRenderedItems(
            allItemsByFilter[itemsFilter.label].slice(0, PAGINATION_LIMIT)
          );
          setIsFetching(false);
          setIsLoadingInitialMount(false);

          const prices = await getLowestPricesByTemplateId(collectionNames);
          const templatesWithPrices = templates.map((template) => ({
            ...template,
            lowestPrice: prices[template.template_id],
          }));

          const templatesByNameAZ = templatesWithPrices
            .slice()
            .sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );

          const allItemsByFilterWithPrices = {
            [NAME_AZ.label]: templatesByNameAZ,
            [NAME_ZA.label]: templatesByNameAZ.slice().reverse(),
            [NEWEST.label]: templatesWithPrices,
            [OLDEST.label]: templatesWithPrices.slice().reverse(),
          };

          setIsLoadingPrices(false);
          setAllItems(allItemsByFilterWithPrices);

          const initialRenderedItems = allItemsByFilterWithPrices[
            itemsFilter.label
          ].slice(0, PAGINATION_LIMIT);
          setRenderedItems(initialRenderedItems);
          setNextPageNumber(
            initialRenderedItems.length < PAGINATION_LIMIT ? -1 : 2
          );
        } catch (e) {
          console.warn(e.message);
          setIsFetching(false);
          setIsLoadingPrices(false);
          setIsLoadingInitialMount(false);
        }
      }
    })();
  }, [chainAccount]);

  const showNextItemsPage = async () => {
    const numNextPageItems = allItems[itemsFilter.label].slice(
      (nextPageNumber - 1) * PAGINATION_LIMIT,
      nextPageNumber * PAGINATION_LIMIT
    ).length;

    setRenderedItems(
      allItems[itemsFilter.label].slice(0, nextPageNumber * PAGINATION_LIMIT)
    );
    setNextPageNumber((prevPageNumber) =>
      numNextPageItems < PAGINATION_LIMIT ? -1 : prevPageNumber + 1
    );
  };

  const handleItemsFilterClick = (filter: Filter) => {
    setItemsFilter(filter);
    const pageOneItems = allItems[filter.label].slice(0, PAGINATION_LIMIT);
    setRenderedItems(pageOneItems);
    setNextPageNumber(pageOneItems.length < PAGINATION_LIMIT ? -1 : 2);
  };

  return (
    <Section isHidden={tabsProps.activeTab !== TAB_TYPES.ITEMS}>
      {isLoadingInitialMount ? (
        <LoadingPage margin="10% 0" />
      ) : (
        <TabSection
          type={CARD_RENDER_TYPES.TEMPLATE}
          showNextPage={showNextItemsPage}
          isLoadingPrices={isLoadingPrices}
          isFetching={isFetching}
          rendered={renderedItems}
          nextPageNumber={nextPageNumber}
          tabsProps={tabsProps}
          filterDropdownProps={{
            filters: [NAME_AZ, NAME_ZA, OLDEST, NEWEST],
            activeFilter: itemsFilter,
            handleFilterClick: handleItemsFilterClick,
          }}
          emptyContent={{
            subtitle: isUsersPage
              ? 'Looks like you have not bought any NFT’s yet. Come back when you do!'
              : 'Looks like this user has not bought any NFT’s yet.',
            buttonTitle: 'Explore NFTs',
            link: '/',
          }}
        />
      )}
    </Section>
  );
};
