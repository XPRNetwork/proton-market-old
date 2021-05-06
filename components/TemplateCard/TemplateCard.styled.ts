import styled from 'styled-components';
import { IconContainer } from '../CollectionIcon/CollectionIcon.styled';

type CardProps = {
  hasMultiple: boolean;
  noHoverEffect: boolean;
  isStatic?: boolean;
  imageHoverEffect?: boolean;
};

type GreyTextProps = {
  price?: string;
};

type CollectionNameButtonProps = {
  isStatic?: boolean;
};

export const Card = styled.article<CardProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  outline: none;
  border-radius: 16px;
  border: solid 1px #e6e6e6;
  box-sizing: border-box;
  padding: 0 24px 24px;
  position: relative;
  transition: 0.3s;

  :hover .template-image-container img,
  :focus-visible .template-image-container img {
    transition: 0.1s;
    transform: ${({ imageHoverEffect }) =>
      imageHoverEffect ? 'scale(1.03)' : 'none'};
  }

  ${({ isStatic }) => (isStatic ? '' : 'cursor: pointer')};
  :hover {
    transform: ${({ noHoverEffect }) =>
      noHoverEffect ? 'none' : 'scale(1.02)'};
  }

  :focus-visible {
    transform: ${({ noHoverEffect }) =>
      noHoverEffect ? 'none' : 'scale(1.02)'};
  }

  ${({ hasMultiple }) =>
    hasMultiple &&
    `
    :before {
      display: block;
      content: '';
      height: 100%;
      width: 97.5%;
      position: absolute;
      top: 5px;
      left: 0.75%;
      border-bottom: solid 1px #e6e6e6;
      border-radius: 16px;
    }

    :after {
      display: block;
      content: '';
      height: 100%;
      width: 95%;
      position: absolute;
      top: 10px;
      left: 2%;
      border-bottom: solid 1px #e6e6e6;
      border-radius: 16px;
    }
  `}
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

export const CollectionNameButton = styled.button<CollectionNameButtonProps>`
  display: flex;
  align-items: center;
  background-color: transparent;
  outline: none;
  border: none;
  z-index: 1;
  ${({ isStatic }) => (isStatic ? '' : 'cursor: pointer')};
`;

export const GreyText = styled(Text)<GreyTextProps>`
  color: #808080;
  margin-bottom: 8px;
`;

export const Tag = styled.div`
  font-family: CircularStdBold;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 1px;
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 16px;
  padding: 8px 16px;
  opacity: 0.6;
  border-radius: 4px;
  background-color: #1a1a1a;
  color: #ffffff;
`;

export const PlaceholderPrice = styled.div`
  height: 8px;
`;

export const PlaceholderIcon = styled(IconContainer).attrs({ as: 'div' })`
  background-color: #e6e6e6;
  width: ${({ width }) => width || '32px'};
  height: ${({ width }) => width || '32px'};
`;
