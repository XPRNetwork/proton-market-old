import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export interface TabTitleProps {
  isActive: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 64px auto 0px;
  justify-content: center;
  align-items: center;
  width: 944px;

  ${breakpoint.laptop`
    width: 100%;
  `};

  ${breakpoint.mobile`
    margin: 32px 0 0;
  `};
`;

export const Row = styled.div`
  width: 100%;
  display: flex;

  ${breakpoint.mobile`
    flex-direction: column;
  `}
`;

export const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 64px 0 56px;

  ${breakpoint.mobile`
    margin: 0;
  `}
`;

export const TabTitle = styled.h1<TabTitleProps>`
  font-size: 16px;
  line-height: 24px;
  font-family: CircularStdBold;
  padding: 0 16px 8px;
  color: ${({ isActive }) => (isActive ? '#1a1a1a' : '#808080')};
  border-bottom: ${({ isActive }) => (isActive ? '2px solid #752eeb' : '')};
  cursor: pointer;
`;

export const TabRow = styled.div`
  display: flex;
  width: 100%;
  margin: 48px 0 22px;
  border-bottom: 1px solid #e6e6e6;

  ${breakpoint.tablet`
    justify-content: center;
  `};
`;

export const Divider = styled.div`
  margin: 24px 0;
  border-bottom: 1px solid #e8ecfd;
`;
