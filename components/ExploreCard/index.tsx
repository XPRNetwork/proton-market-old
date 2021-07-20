import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../Button';
import { Image } from '../../styles/index.styled';
import { useNavigatorUserAgent, useWindowSize } from '../../hooks';
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
  const { currentUser, login } = useAuthContext();
  const [imgSrc, setImgSrc] = useState<string>('');
  const { isDesktop } = useNavigatorUserAgent();
  const { isMobile } = useWindowSize();

  useEffect(() => {
    if (isDesktop !== null && (!isDesktop || isMobile)) {
      setImgSrc('/ExploreMobile.png');
    } else {
      setImgSrc('/Explore.png');
    }
  }, [isDesktop, isMobile]);

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
            smallSize={isMobile || !isDesktop}
            onClick={handleGetStartedClick}>
            Get Started
          </Button>
        </ButtonWrapper>
      </Content>
      <ImageContainer>
        {imgSrc ? (
          <Image
            width="100%"
            height="100%"
            objectFit="cover"
            alt="Explore"
            src={imgSrc}
          />
        ) : null}
      </ImageContainer>
    </Container>
  );
};

export default ExploreCard;
