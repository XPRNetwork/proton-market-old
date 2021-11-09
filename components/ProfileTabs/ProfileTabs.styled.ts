import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

type TabProps = {
  isActive: boolean;
};

export const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 32px;

  ${breakpoint.tablet`
    justify-content: center;
  `}
`;

export const Tab = styled.p<TabProps>`
  font-family: CircularStdBold;
  font-size: 16px;
  line-height: 24px;
  color: ${({ isActive }) => (isActive ? '#1a1a1a' : '#808080')};
  padding: 0 16px 8px 16px;
  border-bottom: ${({ isActive }) => (isActive ? '2px solid #752eeb' : '')};
  cursor: pointer;
`;
