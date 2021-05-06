import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const StyledTableHeaderCell = styled.th`
  padding: 12px 0px;
  font-size: 10px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  font-family: CircularStdBold;
  line-height: 2;
  letter-spacing: 1px;
  color: #1a1a1a;
  text-align: left;

  ${breakpoint.mobile`
    padding: 9px 10px;
  `}

  :first-of-type {
    width: 64px;
  }
`;
