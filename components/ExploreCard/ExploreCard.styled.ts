import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 320px;
  background: linear-gradient(64deg, #4710a3 14%, #b28bf4 109%);
  margin-top: 40px;
  border-radius: 16px;
  overflow: hidden;

  ${breakpoint.mobile`
    flex-direction: column;
    align-items: center;
    height: 100%;
    margin: 40px 0 0;
  `}
`;

export const Content = styled.div`
  padding: 40px 0px 40px 40px;
  height: 100%;
  min-width: 620px;

  ${breakpoint.tablet`
    min-width: 420px;
  `}

  ${breakpoint.mobile`
    min-width: unset;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 32px 16px 0px;
    min-height: 200px;
  `}
`;

export const Title = styled.h1`
  color: #ffffff;
  font-size: 48px;
  line-height: 56px;
  max-width: 534px;

  ${breakpoint.tablet`
    font-size: 32px;
    line-height: 48px;
  `};

  ${breakpoint.mobile`
    font-size: 6vw;
    line-height: 9vw;
    max-width: 85%;
    margin: 0 auto;
  `};
`;

export const SubTitle = styled.p`
  color: #b28bf4;
  font-size: 21px;
  line-height: 32px;
  margin: 16px 0 40px;

  ${breakpoint.tablet`
    font-size: 18px;
    line-height: 28px;
    margin: 12px 0 32px;
  `};

  ${breakpoint.mobile`
    font-size: 4.5vw;
    line-height: 8vw;
    margin: 8px auto 24px;
    max-width: 95%;
  `};
`;

export const ImageContainer = styled(FadeInImageContainer)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  min-width: 700px;

  ${breakpoint.mobile`
    justify-content: space-between;
    margin-top: 32px;
    min-width: unset;
  `};
`;

export const ButtonWrapper = styled.div`
  width: 148px;
  ${breakpoint.mobile`
    width: 60%;
    margin: 0 auto;
  `};
`;
