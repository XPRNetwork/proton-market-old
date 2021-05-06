import styled, { css } from 'styled-components';
import { breakpoint } from '../../styles/Breakpoints';

export const General = styled.p`
  color: #808080;
  font-size: 12px;
  line-height: 24px;
`;

export const Amount = styled.h3`
  font-size: 28px;
  line-height: 32px;
  margin: 4px 0 32px;
  color: #1a1a1a;

  ${breakpoint.mobile`
    font-weight: normal;
  `}
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const ErrorMessage = styled.p`
  color: #b57579;
  font-size: 16px;
  line-height: 24px;
`;

const inputCSS = css`
  font-size: 16px;
  margin-bottom: 12px;
  padding: 0 16px;
  width: 100%;
  height: 48px;
  color: #808080;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  line-height: 24px;
  position: relative;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:hover {
    border: 1px solid #e6e6e6;
  }
`;

export const DisabledInput = styled.input`
  ${inputCSS}
`;

export const DropdownMenu = styled.select`
  ${inputCSS}
  background: url('/down-arrow.svg');
  background-repeat: no-repeat;
  background-position: top 5px right 15px;
  cursor: pointer;
`;

export const FeeLabel = styled.p`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 24px;
  color: #333333;
  margin: 2px 0 12px;
`;
