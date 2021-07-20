import styled from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';
import { StyledButton } from '../Button/Button.styled';

type EmptyContentProps = {
  hasTopBorder?: boolean;
};

export const Button = styled(StyledButton)`
  padding: 11px 16px 13px;

  ${breakpoint.mobile`
    width: 176px;
    height: 32px;
    padding: 3px 16px 5px;
    border-radius: 4px;
  `}
`;

export const EmptyContent = styled.div<EmptyContentProps>`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 140px;
  align-items: center;
  width: 100%;

  ${breakpoint.mobile`
    margin-bottom: 140px;
  `}

  ${({ hasTopBorder }) =>
    hasTopBorder &&
    `
    border-top: 1px solid rgb(230, 230, 230);
  `}
`;

export const Title = styled.h1`
  color: #1a1a1a;
  font-size: 28px;
  line-height: 40px;
  margin-bottom: 8px;

  ${breakpoint.mobile`
      font-size: 18px;
      line-height: 1.33;
      margin-bottom: 16px;
  `}
`;

export const Subtitle = styled.p`
  color: #808080;
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 32px;

  ${breakpoint.mobile`
    max-width: 272px;
    line-height: 1.71;
    text-align: center;
  `}
`;
