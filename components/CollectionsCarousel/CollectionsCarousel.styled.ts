import styled from 'styled-components';
import { StyledButton } from '../Button/Button.styled';

export const BoxButton = styled.button`
  border: none;
  background: none;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  width: 136px;
  min-width: 136px;
  margin-right: 8px;
  height: 136px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #1a1a1a;
  cursor: pointer;
  outline: none;

  span {
    margin-top: 8px;
  }

  :hover,
  :focus-visible {
    border: 1px solid #752eeb;
  }
`;

export const CarouselContainer = styled.div`
  width: 100%;
  overflow: hidden;
  margin-bottom: 30px;
  .carousel {
    overflow: hidden;
    outline: none;

    .carousel__slider {
      outline: none;
    }
  }

  ul {
    outline: none;
    width: max-content !important;
    display: flex;
    align-items: stretch;
    transition: 0.5s;

    li {
      width: initial !important;
      padding-bottom: 0px !important;
      outline: none;
    }
  }
`;

export const ChooseCollectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  justify-content: center;
  align-items: center;
  min-height: 136px;
`;

export const ButtonNext = styled.button`
  position: absolute;
  left: calc(100% - 16px);
  top: calc(50% - 30px);
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  border: none;
  box-shadow: 0px 2px 5px rgb(210, 210, 210);

  :disabled {
    display: none;
  }

  :hover {
    cursor: pointer;
  }
`;

export const ButtonBack = styled.button`
  position: absolute;
  right: calc(100% - 16px);
  top: calc(50% - 30px);
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  transform: rotate(180deg);
  outline: none;
  border: none;
  box-shadow: 0px -2px 5px rgb(210, 210, 210);

  :disabled {
    display: none;
  }

  :hover {
    cursor: pointer;
  }
`;

export const TryAgainButton = styled(StyledButton)`
  width: 110px;
  height: 32px;
  margin-top: 20px;
  padding: 3px 16px;
  background: #f2f2f2;
  color: #752eeb;
  font-size: 14px;
  border-radius: 4px;

  :active,
  :hover,
  :focus {
    background: #752eeb;
    color: #f2f2f2;
  }
`;
