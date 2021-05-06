import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../../components/PageLayout';
import PaginationButton from '../../components/PaginationButton';
import ErrorComponent from '../../components/Error';
import Grid from '../../components/Grid';
import { MODAL_TYPES, useAuthContext } from '../../components/Provider';
import {
  getAllTemplatesForUserWithAssetCount,
  getUserCreatedTemplates,
} from '../../services/templates';
import { Template } from '../../services/templates';
import LoadingPage from '../../components/LoadingPage';
import {
  PAGINATION_LIMIT,
  TAB_TYPES,
  RouterQuery,
} from '../../utils/constants';
import Banner from '../../components/Banner';
import ProfileTabs from '../../components/ProfileTabs';
import PageHeader from '../../components/PageHeader';
import proton from '../../services/proton-rpc';
import EmptyUserContent from '../../components/EmptyUserContent';

const Collection = (): JSX.Element => {
  const router = useRouter();
  const {
    chainAccount: caseSensitiveChainAccount,
  } = router.query as RouterQuery;
  const chainAccount = caseSensitiveChainAccount
    ? caseSensitiveChainAccount.toLowerCase()
    : '';
  const { currentUser, isLoadingUser } = useAuthContext();
  const [allItems, setAllItems] = useState<Template[]>([]);
  const [renderedItems, setRenderedItems] = useState<Template[]>([]);
  const [
    prefetchItemsPageNumber,
    setPrefetchItemsPageNumber,
  ] = useState<number>(2);
  const [renderedCreations, setRenderedCreations] = useState<Template[]>([]);
  const [prefetchedCreations, setPrefetchedCreations] = useState<Template[]>(
    []
  );
  const [
    prefetchCreationsPageNumber,
    setPrefetchCreationsPageNumber,
  ] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const [isTemplatesLoading, setIsTemplatesLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('/default-avatar.png');

  const getTitle = () => {
    return !currentUser || (currentUser && currentUser.actor !== chainAccount)
      ? `${userName ? userName.split(' ')[0] : chainAccount}'s Items`
      : 'My Items';
  };

  const tabs = [
    { title: getTitle(), type: TAB_TYPES.ITEMS },
    { title: 'Creations', type: TAB_TYPES.CREATIONS },
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0].type);
  const isUsersPage = currentUser && currentUser.actor === chainAccount;

  const showNextItemsPage = async () => {
    const numNextPageItems = allItems.slice(
      (prefetchItemsPageNumber - 1) * PAGINATION_LIMIT,
      prefetchItemsPageNumber * PAGINATION_LIMIT
    ).length;
    setRenderedItems(
      allItems.slice(0, prefetchItemsPageNumber * PAGINATION_LIMIT)
    );
    setPrefetchItemsPageNumber((prevPageNumber) =>
      numNextPageItems < PAGINATION_LIMIT ? -1 : prevPageNumber + 1
    );
  };

  const showNextCreationsPage = async () => {
    setRenderedCreations((prevCreations) => [
      ...prevCreations,
      ...prefetchedCreations,
    ]);
    setPrefetchCreationsPageNumber((prevPageNumber) =>
      prefetchedCreations.length < PAGINATION_LIMIT ? -1 : prevPageNumber + 1
    );
    setIsLoadingNextPage(true);
    const creations = await getUserCreatedTemplates(
      chainAccount,
      prefetchCreationsPageNumber,
      !isUsersPage
    );
    setPrefetchedCreations(creations);
    setIsLoadingNextPage(false);
  };

  const getUser = async (chainAccount: string): Promise<void> => {
    setIsProfileLoading(true);

    if (chainAccount) {
      const user = await proton.getUserByChainAccount({
        account: chainAccount,
      });
      const { name, avatar } = user;
      setUserName(name);
      setUserAvatar(avatar);
    }
  };

  useEffect(() => {
    (async () => {
      if (chainAccount) {
        try {
          setIsTemplatesLoading(true);
          setIsLoadingNextPage(true);
          router.prefetch('/');

          const items = await getAllTemplatesForUserWithAssetCount(
            chainAccount
          );
          setAllItems(items);
          setRenderedItems(items.slice(0, PAGINATION_LIMIT));

          const initialCreations = await getUserCreatedTemplates(
            chainAccount,
            1,
            !isUsersPage
          );
          const creations = await getUserCreatedTemplates(
            chainAccount,
            prefetchCreationsPageNumber,
            !isUsersPage
          );
          setRenderedCreations(initialCreations);
          setPrefetchedCreations(creations);
        } catch (e) {
          setErrorMessage(e.message);
        }
      }
      setIsLoading(false);
      setIsTemplatesLoading(false);
      setIsLoadingNextPage(false);
    })();
  }, [chainAccount]);

  useEffect(() => {
    (async () => {
      try {
        await getUser(chainAccount);
      } catch (e) {
        setErrorMessage(e.message);
      }
      setIsProfileLoading(false);
    })();
  }, [currentUser, chainAccount]);

  const getContentItems = () => {
    if (isTemplatesLoading || isLoadingUser) {
      return <LoadingPage margin="10% 0" />;
    }

    if (!renderedItems.length && activeTab === TAB_TYPES.ITEMS) {
      return (
        <EmptyUserContent
          subtitle={
            isUsersPage
              ? 'Looks like you have not bought any NFT’s yet. Come back when you do!'
              : 'Looks like this user has not bought any NFT’s yet.'
          }
          buttonTitle="Explore NFTs"
          link="/"
        />
      );
    }

    if (!renderedCreations.length && activeTab === TAB_TYPES.CREATIONS) {
      return (
        <EmptyUserContent
          subtitle={
            isUsersPage
              ? 'Looks like you have not created any NFT’s yet. Come back when you do!'
              : 'Looks like this user does not have any creations yet.'
          }
          buttonTitle="Create NFT"
          link="/create"
        />
      );
    }

    return (
      <Grid
        items={
          activeTab === TAB_TYPES.ITEMS ? renderedItems : renderedCreations
        }
      />
    );
  };

  const getPaginationButton = () => {
    const isHidden =
      isLoading || (!isLoading && activeTab === TAB_TYPES.ITEMS)
        ? prefetchItemsPageNumber === -1
        : prefetchCreationsPageNumber === -1;

    const isDisabled =
      isLoading || (!isLoading && activeTab === TAB_TYPES.ITEMS)
        ? renderedItems.length < PAGINATION_LIMIT
        : renderedCreations.length < PAGINATION_LIMIT;

    return (
      <PaginationButton
        onClick={
          activeTab === TAB_TYPES.ITEMS
            ? showNextItemsPage
            : showNextCreationsPage
        }
        isHidden={isHidden}
        isLoading={isLoadingNextPage}
        disabled={isDisabled}
        autoLoad
      />
    );
  };

  const getContent = () => {
    if (isLoading || isProfileLoading || isLoadingUser) {
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

    return (
      <>
        <PageHeader
          image={userAvatar}
          name={userName}
          subName={chainAccount}
          type="user"
        />
        <ProfileTabs
          tabList={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {getContentItems()}
        {getPaginationButton()}
      </>
    );
  };

  return (
    <>
      <PageLayout title={getTitle()}>
        <Banner modalType={MODAL_TYPES.CLAIM} />
        {getContent()}
      </PageLayout>
    </>
  );
};

export default Collection;
