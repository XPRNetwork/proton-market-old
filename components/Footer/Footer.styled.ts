import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';
import { breakpoint } from '../../styles/Breakpoints';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

export const StyledFooter = styled(MaxWidth).attrs({ as: 'footer' })`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  ${breakpoint.tablet`
    flex-direction: column;
    justify-content: center;
  `}
`;

export const ImageContainer = styled(FadeInImageContainer)`
  margin: 24px 0;
`;

export const Section = styled.section`
  display: flex;
  justify-content: space-between;

  ${breakpoint.tablet`
    flex-direction: column;
    justify-content: center;
  `}
`;

export const FooterLink = styled.a`
  color: #808080;
  cursor: pointer;
  margin-left: 40px;
  padding: 20px 0;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  transition: 0.2s;

  :hover,
  :focus-visible {
    color: #1a1a1a;
  }

  ${breakpoint.tablet`
    padding: 0;
    margin: 0 0 16px;

    &:last-of-type {
      margin-bottom: 24px;
    }
  `}
`;
