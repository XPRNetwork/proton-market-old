import styled from 'styled-components';
import { breakpoint } from './Breakpoints';

export const Title = styled.h1`
  font-size: 28px;
  line-height: 40px;
  color: #1a1a1a;
  margin: 40px 0 32px;

  ${breakpoint.mobile`
    margin: 32px 0;
    font-size: 18px;
    line-height: 24px;
  `}
`;

export const PurpleSpan = styled(Title).attrs({ as: 'span' })`
  color: #752eeb;
`;
