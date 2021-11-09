import styled from 'styled-components';
import { StyledButton } from '../Button/Button.styled';

export const CarouselStyleFix = styled.div`
  width: 100%;
  .carousel {
    overflow: hidden;
    outline: none;
    width: calc(100% + 24px);

    .carousel__slider {
      outline: none;
    }
  }

  ul {
    outline: none;
    transition: 0.5s;

    li {
      margin-right: 24px;
      outline: none;
    }
  }
`;

export const CarouselContainer = styled.div`
  min-height: 150px;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  justify-content: center;
  align-items: center;
`;

type ButtonProps = {
  display: boolean;
};

export const ButtonNextContainer = styled.div<ButtonProps>`
  display: ${({ display }) => (display ? 'block' : 'none')};
  position: absolute;
  left: calc(100% - 16px);
  top: calc(50% - 30px);

  button {
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
  }
`;

export const ButtonBackContainer = styled.div<ButtonProps>`
  display: ${({ display }) => (display ? 'block' : 'none')};
  position: absolute;
  right: calc(100% - 16px);
  top: calc(50% - 30px);

  button {
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
  }
`;

export const SpinnerContainer = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ErrorMessage = styled.p``;

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
