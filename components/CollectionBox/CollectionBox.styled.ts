import styled from 'styled-components';

type BoxContainerProps = {
  active?: boolean;
};

export const BoxContainer = styled.div<BoxContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 136px;
  height: 136px;
  border-radius: 8px;
  border: solid 1px ${({ active }) => (active ? '#752eeb' : '#e6e6e6')};
  cursor: pointer;
  margin-right: 8px;
  padding: 0 10px;

  :hover,
  :focus-visible {
    border: 1px solid #752eeb;
  }
`;

export const CollectionName = styled.p`
  margin: 4px 0 0;
  font-size: 16px;
  line-height: 1.5;
  color: #1a1a1a;
  text-align: center;
  max-height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;
