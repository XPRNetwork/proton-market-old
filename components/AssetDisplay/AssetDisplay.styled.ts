import styled from 'styled-components';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';
import { breakpoint } from '../../styles/Breakpoints';

export const AssetDisplayContainer = styled(FadeInImageContainer)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 500px;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  ${breakpoint.tablet`
    max-width: 294px;
  `};

  ${breakpoint.mobile`
    max-width: 100%;
    margin: 0px auto 32px;
  `};
`;

export const Image = styled.img`
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
`;

export const Video = styled.video`
  width: 100%;
  max-height: 100%;
  border-radius: 16px;
  outline: none;
`;
