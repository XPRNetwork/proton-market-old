import styled from 'styled-components';
import { MaxWidth } from '../../styles/MaxWidth.styled';
import { breakpoint } from '../../styles/Breakpoints';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

type DropdownProps = {
  isOpen: boolean;
};

export type GradientBackgroundProps = {
  isOpen: boolean;
};

type DropdownLinkProps = {
  red?: boolean;
};

type NavLinkProps = {
  isActive: boolean;
};

export const Background = styled.section`
  width: 100%;
  background: white;
  border-bottom: 1px solid #e8ecfd;
  z-index: 10;
  position: fixed;
  top: 0;
`;

export const Nav = styled(MaxWidth).attrs({ as: 'nav' })`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
`;

export const NavLeftContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Section = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const UserMenuButton = styled.button`
  border-radius: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: 1px solid #dde4ee;
  background: none;
  padding: 0;
  outline: none;

  :focus-visible {
    border: 1px solid #752eeb;
  }
`;

export const UserMenuText = styled.span`
  color: #0e103c;
  font-size: 14px;
  margin: 8px 8px 8px 16px;
`;

export const AvatarContainer = styled(FadeInImageContainer)`
  width: 40px;
  height: 40px;
  position: relative;
  border-radius: 100%;
  z-index: 3;
`;

export const ImageLink = styled.a`
  margin: 23px 0;
  z-index: 3;
  padding-left: 1px;

  ${breakpoint.tablet`
    margin: 26.5px 0;
  `}
`;

export const DropdownList = styled.section<DropdownProps>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 75px;
  right: 0;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 12px 20px -4px rgba(0, 0, 0, 0.1), 0 0 8px 0 rgba(0, 0, 0, 0.08);
  min-width: 224px;
  z-index: 2;

  ${breakpoint.tablet`
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    right: 0;
    z-index: 2;
    top: 65px;
    width: 100%;
    background: none;

    &:before {
      content: '';
      background: #ffffff;
      width: 100%;
      height: 320px;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
    }
  `}
`;

export const GradientBackground = styled.div<GradientBackgroundProps>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 1;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  cursor: pointer;

  ${breakpoint.tablet`
    background-color: rgba(0, 0, 0, 0.7);
  `}
`;

export const Name = styled.span`
  font-family: CircularStdBold;
  color: #1a1a1a;
  font-size: 14px;
  line-height: 24px;
  margin: 16px 16px 11px;

  ${breakpoint.tablet`
    margin: 16px 0 11px;
  `}
`;

export const Subtitle = styled.span`
  color: #808080;
  font-size: 12px;
  line-height: 20px;
  margin: 0 16px;

  ${breakpoint.tablet`
    margin: 0;
  `}
`;

export const Balance = styled(Name)`
  font-size: 18px;
  line-height: 24px;
  border-bottom: 1px solid #e6e6e6;
  margin: 0 16px 8px;
  padding: 0 0 16px;

  ${breakpoint.tablet`
    margin: 0 0 8px;
  `}
`;

export const DropdownLink = styled.a<DropdownLinkProps>`
  color: ${({ red }) => (red ? '#f94e6c' : '#1a1a1a')};
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  padding: 8px 16px;
  width: 100%;
  transition: 0.2s;

  :last-of-type {
    margin-bottom: 16px;
  }

  :hover {
    color: ${({ red }) => (red ? '#1a1a1a' : '#752eeb')};
  }

  ${breakpoint.tablet`
    padding: 8px 0;
  `}
`;

export const DesktopOnlySection = styled.section`
  ${breakpoint.tablet`
    display: none;
  `}
`;

export const DesktopNavLink = styled.a<NavLinkProps>`
  color: ${({ isActive }) => (isActive ? '#1a1a1a' : '#808080')};
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  margin-right: 24px;
  transition: 0.2s;

  :hover,
  :focus-visible {
    color: #1a1a1a;
  }
`;

export const MobileIcon = styled.div`
  display: none;
  cursor: pointer;

  ${breakpoint.tablet`
    display: block;
  `}
`;

export const DesktopIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  ${breakpoint.tablet`
    display: none;
  `}
`;

export const OpenSearchButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 100%;
  border: 1px solid #e6e6e6;
  outline: none;
  cursor: pointer;
  margin-right: 8px;
  justify-content: center;
  align-items: center;

  :focus,
  :focus-visible {
    border: 1px solid #752eeb;
  }

  ${breakpoint.tablet`
    display: flex;
  `}
`;

export const CloseIconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  cursor: pointer;
  border-radius: 100%;
  z-index: 3;
  width: 40px;
  height: 40px;
  background: #f2f2f2;
  outline: none;

  :focus,
  :focus-visible {
    border: 1px solid #752eeb;
  }

  * {
    z-index: 3;
  }
`;
