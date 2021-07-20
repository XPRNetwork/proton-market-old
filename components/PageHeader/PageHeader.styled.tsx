import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

type RoundButtonProps = {
  size?: string;
  padding?: string;
  margin?: string;
};

export const PageHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 50px;
`;

export const PageHeaderAvatarContainer = styled.div`
  position: relative;
`;

export const ImageContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 100%;
  margin-bottom: 16px;
  overflow: hidden;

  ${breakpoint.mobile`
    width: 112px;
    height: 112px;
    margin-bottom: 24px;
  `}
`;

export const VerifiedIconContainer = styled.div`
  position: absolute;
  bottom: 12px;
  right: 0;

  ${breakpoint.mobile`
    bottom: 20px;
  `}
`;

export const Name = styled.p`
  font-size: 40px;
  line-height: 56px;
  color: #1a1a1a;
  text-align: center;

  ${breakpoint.mobile`
    font-size: 40px;
    line-height: 1.4;
  `}
`;

export const SubName = styled.p`
  line-height: 24px;
  font-size: 18px;
  color: #808080;
  margin-bottom: 24px;

  ${breakpoint.mobile`
    font-size: 21px;
    line-height: 1.52;
  `}
`;

export const RoundButton = styled.button<RoundButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: transparent;
  height: ${({ size }) => size || 'auto'};
  width: ${({ size }) => size || 'auto'};
  padding: ${({ padding }) => padding || 0};
  margin: ${({ margin }) => margin || 0};
  border-radius: 20px;
  border: 1px solid #e6e6e6;
  cursor: pointer;
  outline: none;
  font-size: 16px;
  line-height: 24px;

  :hover {
    background-color: rgba(230, 230, 230, 0.3);
  }

  ${breakpoint.mobile`
    margin-top: 5px;
  `}

  > svg {
    position: absolute;
    left: 7px;
    top: 6px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
