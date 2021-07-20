import styled from 'styled-components';
import {
  GradientBackgroundProps,
  GradientBackground,
} from '../NavBar/NavBar.styled';

type MenuProps = {
  isOpen: boolean;
};

export const MenuContainer = styled.div`
  position: relative;
  min-width: 184px;
  height: 24px;
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  outline: none;
  padding: 0;
  color: #808080;
  font-size: 16px;
  line-height: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  :focus,
  :hover,
  :focus-visible {
    color: #1a1a1a;
  }
`;

export const MenuButtonText = styled.span`
  margin-right: 4px;
`;

export const Menu = styled.ul<MenuProps>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: relative;
  top: 16px;
  right: 0;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 12px 20px -4px rgba(0, 0, 0, 0.1), 0 0 8px 0 rgba(0, 0, 0, 0.08);
  width: 100%;
  z-index: 2;
`;

export const MenuItem = styled.li`
  font-weight: bold;
  line-height: 24px;
  padding: 8px 16px;
  cursor: pointer;
  transition: 0.2s;
  color: #1a1a1a;
  font-size: 14px;
  outline-color: #752eeb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  :hover,
  :focus-visible {
    color: #752eeb;
  }

  :first-of-type {
    margin-top: 16px;
  }

  :last-of-type {
    margin-bottom: 16px;
  }
`;

export const TransparentBackground = styled(
  GradientBackground
)<GradientBackgroundProps>`
  background: none;
`;
