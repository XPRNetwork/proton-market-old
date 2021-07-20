import { Title } from '../styles/Title.styled';
import PageLayout from '../components/PageLayout';
import ExploreCard from '../components/ExploreCard';
import Banner from '../components/Banner';
import HomepageStatistics from '../components/HomepageStatistics';
import { MODAL_TYPES } from '../components/Provider';
import { useFirebaseFeaturedTemplates } from '../services/firebase';
import Grid from '../components/Grid';

const MarketPlace = (): JSX.Element => {
  const featuredTemplates = useFirebaseFeaturedTemplates();

  return (
    <PageLayout>
      <Banner modalType={MODAL_TYPES.CLAIM} />
      <ExploreCard />
      <HomepageStatistics />
      <Title>New &amp; Noteworthy</Title>
      <Grid items={featuredTemplates} />
    </PageLayout>
  );
};

export default MarketPlace;
