import { useRouter } from 'next/router';
import Button from '../Button';
import { Image } from '../../styles/index.styled';
import { useWindowSize } from '../../hooks';
import { useAuthContext } from '../Provider';
import {
  Container,
  Content,
  Title,
  SubTitle,
  ImageContainer,
  ButtonWrapper,
} from './ExploreCard.styled';

const ExploreCard = (): JSX.Element => {
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const { currentUser, login } = useAuthContext();

  const handleGetStartedClick = currentUser
    ? () => router.push('/create')
    : login;

  return (
    <Container>
      <Content>
        <Title>Start creating and selling your own NFTs!</Title>
        <SubTitle>
          The best way to monetize your talent. Free to get started.
        </SubTitle>
        <ButtonWrapper>
          <Button
            fullWidth
            margin="0"
            smallSize={isMobile}
            onClick={handleGetStartedClick}>
            Get Started
          </Button>
        </ButtonWrapper>
      </Content>
      <ImageContainer>
        {isMobile ? (
          <Image
            width="875px"
            height="430px"
            alt="ExploreMobile"
            src="/ExploreMobile.png"
          />
        ) : (
          <Image
            width="672px"
            height="320px"
            alt="Explore"
            src="/Explore.png"
          />
        )}
      </ImageContainer>
    </Container>
  );
};

export default ExploreCard;
