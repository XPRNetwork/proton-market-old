import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../../components/PageLayout';
import ErrorComponent from '../../components/Error';
import LoadingPage from '../../components/LoadingPage';
import Banner from '../../components/Banner';
import PageHeader from '../../components/PageHeader';
import { MODAL_TYPES, useAuthContext } from '../../components/Provider';
import {
  TabSectionUserProfileItems,
  TabSectionUserProfileCreations,
} from '../../components/TabSection';
import { TAB_TYPES, RouterQuery } from '../../utils/constants';
import proton from '../../services/proton-rpc';

interface ProfileUser {
  name: string;
  avatar: string;
  isVerified: boolean;
}

const defaultUser = {
  name: '',
  avatar: '/default-avatar.png',
  isVerified: false,
};

const getUser = async (chainAccount: string): Promise<ProfileUser> => {
  if (!chainAccount) {
    return defaultUser;
  }

  try {
    const user = await proton.getUserByChainAccount(chainAccount);
    const isVerified = await proton.isAccountLightKYCVerified(chainAccount);
    const { name, avatar } = user;
    return { name, avatar, isVerified };
  } catch (err) {
    throw new Error(err.message);
  }
};

const User = (): JSX.Element => {
  const { currentUser, isLoadingUser } = useAuthContext();
  const router = useRouter();
  const {
    chainAccount: caseSensitiveChainAccount,
  } = router.query as RouterQuery;
  const chainAccount = caseSensitiveChainAccount
    ? caseSensitiveChainAccount.toLowerCase()
    : '';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>(TAB_TYPES.ITEMS);
  const [user, setUser] = useState<ProfileUser>(defaultUser);

  const getTitle = () => {
    return !currentUser || (currentUser && currentUser.actor !== chainAccount)
      ? `${user.name ? user.name.split(' ')[0] : chainAccount}'s Items`
      : 'My Items';
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const profileUser = await getUser(chainAccount);
        setUser(profileUser);
        setIsLoading(false);
      } catch (e) {
        setErrorMessage(e.message);
        setIsLoading(false);
      }
    })();
  }, [currentUser, chainAccount]);

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

    const { avatar, name, isVerified } = user;

    const tabs = [
      { title: getTitle(), type: TAB_TYPES.ITEMS },
      { title: 'Creations', type: TAB_TYPES.CREATIONS },
    ];

    const tabsProps = {
      tabs,
      activeTab,
      setActiveTab,
    };

    return (
      <>
        <PageHeader
          image={avatar}
          name={name}
          subName={chainAccount}
          isLightKYCVerified={isVerified}
          type="user"
        />
        <TabSectionUserProfileItems
          chainAccount={chainAccount}
          {...tabsProps}
        />
        <TabSectionUserProfileCreations
          chainAccount={chainAccount}
          {...tabsProps}
        />
      </>
    );
  };

  return (
    <PageLayout title={getTitle()}>
      <Banner modalType={MODAL_TYPES.CLAIM} />
      {getContent()}
    </PageLayout>
  );
};

export default User;
