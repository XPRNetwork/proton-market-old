import styled from 'styled-components';
import { IconContainer } from '../CollectionIcon/CollectionIcon.styled';

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  outline: none;
  border-radius: 16px;
  border: solid 1px #e6e6e6;
  box-sizing: border-box;
  padding: 0 24px 24px;
  position: relative;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 21px;
  line-height: 32px;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

export const Text = styled.span`
  font-size: 16px;
  line-height: 24px;
  color: #1a1a1a;
  text-align: left;
  max-width: 190px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CollectionNameButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  outline: none;
  border: none;
  z-index: 1;
`;

export const PlaceholderIcon = styled(IconContainer).attrs({ as: 'div' })`
  background-color: #e6e6e6;
  width: ${({ width }) => width || '32px'};
  height: ${({ width }) => width || '32px'};
`;

export const GreyText = styled(Text)`
  color: #808080;
  margin-bottom: 8px;
`;
