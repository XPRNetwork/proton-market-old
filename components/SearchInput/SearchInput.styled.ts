import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

type InputContainerProps = {
  isSearchInputActive: boolean;
  isMobileSearchOpen: boolean;
};

type ClearTextButtonProps = {
  isVisibleOnDesktop: boolean;
};

const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  outline: none;
`;

export const MagnifyingIconButton = styled(IconButton)`
  margin-left: 16px;
  ${breakpoint.tablet`
    margin-left: 18px;
  `}
`;

export const ClearTextButton = styled(IconButton)<ClearTextButtonProps>`
  display: ${({ isVisibleOnDesktop }) =>
    isVisibleOnDesktop ? 'flex' : 'none'};
  margin-right: 12px;
  border-radius: 100%;
  transition: 0.3s;
  border: 1px solid white;

  :hover,
  :focus-visible {
    transform: scale(1.3);
    background: #f2f2f2;
    border: 1px solid #752eeb;
  }

  ${breakpoint.tablet`
    display: flex;
  `}
`;

export const InputContainer = styled.div<InputContainerProps>`
  border-radius: 8px;
  width: 50vw;
  max-width: 600px;
  height: 48px;
  transition: 0.2s;
  display: flex;
  align-items: center;
  outline: none;
  background: ${({ isSearchInputActive }) =>
    isSearchInputActive ? 'white' : '#f2f2f2'};
  border: solid 1px
    ${({ isSearchInputActive }) =>
      isSearchInputActive ? '#752eeb' : '#f2f2f2'};
  margin: 0 20px 0 50px;

  :focus,
  :focus-visible {
    background: white;
    border: solid 1px #752eeb;
  }

  @media (max-width: 1450px) {
    width: 40vw;
  }

  @media (max-width: 1350px) {
    width: 35vw;
  }

  @media (max-width: 1250px) {
    width: 30vw;
  }

  @media (max-width: 1150px) {
    width: 25vw;
  }

  @media (max-width: 1050px) {
    width: 20vw;
  }

  ${breakpoint.tablet`
    ${({ isMobileSearchOpen }) => !isMobileSearchOpen && `display: none;`}
    z-index: 4;
    position: absolute;
    left: 0;
    width: 100%;
    max-width: unset;
    margin: 0;
    border-radius: 20px;
    border: solid 2px #752eeb;
    background: white;
  `}
`;

export const Input = styled.input`
  width: 100%;
  font-size: 16px;
  color: black;
  padding: 12px 28px 12px 16px;
  border-radius: 8px;
  border: none;
  outline: none;
  line-height: 24px;
  background: none;

  ::placeholder {
    color: #808080;
  }

  ${breakpoint.tablet`
    border-radius: 20px;
    padding: 8px 16px 8px 18px;
  `}
`;
