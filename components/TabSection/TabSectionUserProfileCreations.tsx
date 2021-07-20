import { FC, useEffect, useState } from 'react';
import TabSection, {
  SectionContainerProps,
  SectionContentByFilter,
  defaultSectionContentByFilter,
} from '.';
import LoadingPage from '../LoadingPage';
import { useAuthContext } from '../Provider';
import { Section } from './TabSection.styled';
import {
  getPaginatedCreationsByCreator,
  getAllCreationsByCreator,
} from '../../services/templates';
import { Template } from '../../services/templates';
import {
  PAGINATION_LIMIT,
  TAB_TYPES,
  CARD_RENDER_TYPES,
  FILTER_TYPES,
  Filter,
} from '../../utils/constants';
const { NAME_AZ, NAME_ZA, OLDEST, NEWEST } = FILTER_TYPES;

export const TabSectionUserProfileCreations: FC<SectionContainerProps> = ({
  chainAccount,
  ...tabsProps
}) => {
  const { currentUser } = useAuthContext();
  const [allCreations, setAllCreations] = useState<SectionContentByFilter>(
    defaultSectionContentByFilter
  );
  const [renderedCreations, setRenderedCreations] = useState<Template[]>([]);
  const [nextPageNumber, setNextPageNumber] = useState<number>(2);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoadingInitialMount, setIsLoadingInitialMount] = useState<boolean>(
    true
  );
  const [creationsFilter, setCreationsFilter] = useState<Filter>(NEWEST);

  const isUsersPage = currentUser && currentUser.actor === chainAccount;

  useEffect(() => {
    (async () => {
      if (chainAccount) {
        try {
          setIsFetching(true);
          setIsLoadingInitialMount(true);

          const initialRenderedCreations = await getPaginatedCreationsByCreator(
            {
              chainAccount,
              showZeroMints: isUsersPage,
              page: 1,
            }
          );
          setRenderedCreations(initialRenderedCreations);
          setIsLoadingInitialMount(false);
          setNextPageNumber(
            initialRenderedCreations.length < PAGINATION_LIMIT ? -1 : 2
          );

          const creations = await getAllCreationsByCreator({
            chainAccount,
            showZeroMints: isUsersPage,
          });

          const creationsByNameAZ = creations
            .slice()
            .sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );

          const allCreationsByFilter = {
            [NAME_AZ.label]: creationsByNameAZ,
            [NAME_ZA.label]: creationsByNameAZ.slice().reverse(),
            [NEWEST.label]: creations,
            [OLDEST.label]: creations.slice().reverse(),
          };

          setAllCreations(allCreationsByFilter);
          setIsFetching(false);
        } catch (e) {
          console.warn(e.message);
          setIsFetching(false);
          setIsLoadingInitialMount(false);
        }
      }
    })();
  }, [chainAccount]);

  const showNextCreationsPage = async () => {
    const numNextPageItems = allCreations[creationsFilter.label].slice(
      (nextPageNumber - 1) * PAGINATION_LIMIT,
      nextPageNumber * PAGINATION_LIMIT
    ).length;

    setRenderedCreations(
      allCreations[creationsFilter.label].slice(
        0,
        nextPageNumber * PAGINATION_LIMIT
      )
    );
    setNextPageNumber((prevPageNumber) =>
      numNextPageItems < PAGINATION_LIMIT ? -1 : prevPageNumber + 1
    );
  };

  const handleCreationsFilterClick = (filter: Filter) => {
    setCreationsFilter(filter);
    const pageOneItems = allCreations[filter.label].slice(0, PAGINATION_LIMIT);
    setRenderedCreations(pageOneItems);
    setNextPageNumber(pageOneItems.length < PAGINATION_LIMIT ? -1 : 2);
  };

  return (
    <Section isHidden={tabsProps.activeTab !== TAB_TYPES.CREATIONS}>
      {isLoadingInitialMount ? (
        <LoadingPage margin="10% 0" />
      ) : (
        <TabSection
          type={CARD_RENDER_TYPES.TEMPLATE}
          showNextPage={showNextCreationsPage}
          isFetching={isFetching}
          rendered={renderedCreations}
          nextPageNumber={nextPageNumber}
          tabsProps={tabsProps}
          filterDropdownProps={{
            filters: [NAME_AZ, NAME_ZA, OLDEST, NEWEST],
            activeFilter: creationsFilter,
            handleFilterClick: handleCreationsFilterClick,
          }}
          emptyContent={{
            subtitle: isUsersPage
              ? 'Looks like you have not created any NFT’s yet. Come back when you do!'
              : 'Looks like this user does not have any creations yet.',
            buttonTitle: 'Create NFT',
            link: '/create',
          }}
        />
      )}
    </Section>
  );
};
