import styled from 'styled-components';

type ShareOnSocialProps = {
  left?: string;
  right?: string;
  bottom?: string;
  top?: string;
  mr?: string;
  ml?: string;
  mt?: string;
  mb?: string;
  active: boolean;
};

export const Container = styled.div<ShareOnSocialProps>`
  display: ${({ active }) => (active ? 'flex' : 'none')};
  flex-direction: column;
  border: 1px solid lightgrey;
  padding: 10px 0px;
  position: absolute;
  z-index: 2;
  background-color: white;
  ${({ left }) => (left ? `left: ${left}` : '')};
  ${({ right }) => (right ? `right: ${right}` : '')};
  ${({ top }) => (top ? `top: ${top}` : '')};
  ${({ bottom }) => (bottom ? `bottom: ${bottom}` : '')};
  margin-right: ${({ mr }) => (mr ? mr : 0)};
  margin-left: ${({ ml }) => (ml ? ml : 0)};
  margin-top: ${({ mt }) => (mt ? mt : 0)};
  margin-bottom: ${({ mb }) => (mb ? mb : 0)};

  :hover {
    cursor: pointer;
  }

  ::before {
    position: absolute;
    content: '';
    bottom: 100%;
    left: 43.5%;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 9px solid lightgrey;
  }

  ::after {
    position: absolute;
    content: '';
    bottom: 100%;
    left: 45%;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid white;
  }
`;

export const ShareLink = styled.a`
  display: flex;
  align-items: center;
  color: grey;
  padding: 10px 25px;

  :first-child {
    margin-top: 0;
  }

  :hover {
    background-color: rgba(230, 230, 230, 0.4);
  }
`;

export const CopyLinkButton = styled.button`
  padding: 0 0 0 5px;
  background-color: white;
  border: none;
  display: flex;
  align-items: center;
  color: grey;
  padding: 10px 20px;
  outline: none;

  :hover {
    cursor: pointer;
    background-color: rgba(230, 230, 230, 0.4);
  }
`;

export const ShareLinkText = styled.span`
  margin-left: 15px;
  font-size: 14px;
`;
