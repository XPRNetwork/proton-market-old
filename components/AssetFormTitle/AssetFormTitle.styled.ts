import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const NameContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Name = styled.h1`
  font-size: 40px;
  line-height: 56px;

  ${breakpoint.mobile`
    font-weight: normal;
    font-size: 28px;
    line-height: 1.43;
  `}
`;

export const General = styled.p`
  color: #808080;
  font-size: 12px;
  line-height: 24px;
`;

export const Title = styled(General)`
  margin-left: 8px;
  color: #1a1a1a;
  font-size: 16px;
`;

export const AuthorText = styled(General)`
  margin: 8px 0 28px;
`;

export const Author = styled(General).attrs({ as: 'a' })`
  color: #752eeb;
  cursor: pointer;
`;

export const CollectionNameButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background-color: white;
  outline: none;
  cursor: pointer;
  margin-bottom: 8px;
  padding: 0;

  img {
    border-radius: 100%;
  }
`;
