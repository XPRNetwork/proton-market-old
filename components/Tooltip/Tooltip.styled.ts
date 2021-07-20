import styled from 'styled-components';

type TooltipContentProps = {
  isActive: boolean;
  numberOfLines: number;
  isLeftAlignedToParent?: boolean;
};

export const TooltipIconContainer = styled.div`
  position: absolute;
  right: 0;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  margin-right: 18px;
`;

export const TooltipContent = styled.p<TooltipContentProps>`
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
  z-index: 1;
  font-size: 12px;
  line-height: 20px;
  color: #ffffff;
  flex-direction: column;
  padding: 8px;
  background-color: #1a1a1a;
  border-radius: 8px;
  position: absolute;
  width: 184px;
  top: ${({ numberOfLines }) =>
    numberOfLines && numberOfLines > 1 ? numberOfLines * -25 : -30}px;
  right: -62px;
  text-align: center;

  ${({ isLeftAlignedToParent }) =>
    isLeftAlignedToParent &&
    `
    left: 0;
  `}

  ::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 48%;
    border-width: 7px;
    border-style: solid;
    border-color: #1a1a1a transparent transparent transparent;
  }
`;
