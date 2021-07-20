/* eslint-disable jsx-a11y/media-has-caption */
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import MobileCreatePagePlaceholder from '../components/MobileCreatePagePlaceholder';
import NftCreateSuccess from '../components/NftCreateSuccess';
import CreatePageLayout from '../components/CreatePageLayout';
import ChooseCollection from '../components/ChooseCollection';
import CreateTemplate from '../components/CreateTemplate';
import { useAuthContext, CREATE_PAGE_STATES } from '../components/Provider';
import fees from '../services/fees';
import { useNavigatorUserAgent } from '../hooks';

const Create: FC = () => {
  const router = useRouter();
  const { currentUser, isLoadingUser } = useAuthContext();
  const { isDesktop } = useNavigatorUserAgent();
  const [pageState, setPageState] = useState<string>(
    CREATE_PAGE_STATES.CHOOSE_COLLECTION
  );

  useEffect(() => {
    if (!currentUser && !isLoadingUser) {
      router.push('/');
    }
    (async () => {
      if (currentUser && currentUser.actor) {
        await fees.refreshRamInfoForUser(currentUser.actor);
      }
    })();
  }, [currentUser, isLoadingUser]);

  const getContent = () => {
    if (!currentUser) {
      return null;
    }

    if (!isDesktop) {
      return <MobileCreatePagePlaceholder />;
    }

    switch (pageState) {
      case CREATE_PAGE_STATES.SUCCESS:
        return (
          <NftCreateSuccess
            backToChooseCollection={() =>
              setPageState(CREATE_PAGE_STATES.CHOOSE_COLLECTION)
            }
          />
        );
      case CREATE_PAGE_STATES.CREATE_TEMPLATE:
        return (
          <CreatePageLayout>
            <CreateTemplate setPageState={setPageState} />
          </CreatePageLayout>
        );
      default:
        return (
          <CreatePageLayout>
            <ChooseCollection setPageState={setPageState} />
          </CreatePageLayout>
        );
    }
  };

  return <PageLayout title="Create">{getContent()}</PageLayout>;
};

export default Create;
