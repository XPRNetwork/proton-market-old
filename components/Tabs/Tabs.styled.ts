import styled from 'styled-components';
import { Row as StyledRow } from '../../styles/index.styled';
import { breakpoint } from '../../styles/Breakpoints';

type TabProps = {
  isActive: boolean;
};

export const Tab = styled.p<TabProps>`
  font-family: CircularStdBold;
  font-size: 16px;
  line-height: 24px;
  color: ${({ isActive }) => (isActive ? '#1a1a1a' : '#808080')};
  padding-bottom: 8px;
  margin-right: 16px;
  border-bottom: ${({ isActive }) => (isActive ? '2px solid #752eeb' : '')};
  cursor: pointer;

  ${breakpoint.mobile`
    width: 100%;
    padding-bottom: 10px;
    margin-right: 0;
    text-align: center;
  `}
`;

export const Row = styled(StyledRow)`
  ${breakpoint.mobile`
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 24px;
  `}
`;
