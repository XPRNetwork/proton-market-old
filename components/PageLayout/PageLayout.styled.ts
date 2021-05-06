import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';
import { breakpoint } from '../../styles/Breakpoints';

export const Main = styled.main`
  position: relative;
  min-height: calc(100vh - 88px);
  padding-top: 88px;
  overflow: auto;

  ${breakpoint.tablet`
    min-height: calc(100vh - 88px);
  `}
`;

export const Container = styled(MaxWidth)`
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 128px;

  ${breakpoint.tablet`
    margin-bottom: 64px;
  `}
`;
