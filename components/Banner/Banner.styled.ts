import styled from 'styled-components';

type MoneyProps = {
  right?: boolean;
};

export const Background = styled.section`
  left: 0;
  width: 100%;
  height: 40px;
  background: #f0e8fd;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  font-size: 14px;
  font-family: CircularStdBold;
  cursor: pointer;
`;

export const Spacer = styled.div`
  height: 40px;
`;

export const Content = styled.span`
  position: relative;
  color: #752eeb;
  font-size: 14px;
  font-family: CircularStdBold;
`;

export const Money = styled.span<MoneyProps>`
  font-size: 16px;
  margin-right: ${({ right }) => (right ? '8px' : '0')};
  margin-left: ${({ right }) => (!right ? '8px' : '0')};
`;
