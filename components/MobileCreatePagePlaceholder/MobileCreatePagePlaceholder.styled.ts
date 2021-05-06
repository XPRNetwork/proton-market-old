import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';
import { MaxWidth } from '../../styles/MaxWidth.styled';

export const MobileTitle = styled.h1`
  font-size: 28px;
  line-height: 40px;
  color: #1a1a1a;
  max-width: 300px;
  margin: 24px 0 8px;

  ${breakpoint.mobile`
    max-width: 200px;
    font-size: 18px;
    line-height: 24px;
  `}
`;

export const MobileSubTitle = styled.p`
  font-size: 14px;
  line-height: 24px;
  color: #333333;
  margin-top: 8px;
  max-width: 300px;
  color: #808080;

  ${breakpoint.mobile`
    max-width: 270px;
  `}
`;

export const MobileContainer = styled(MaxWidth)`
  display: none;

  ${breakpoint.tablet`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 73px;
  `}
`;
