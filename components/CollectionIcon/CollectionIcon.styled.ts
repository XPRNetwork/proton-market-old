import styled from 'styled-components';

type IconContainerProps = {
  margin?: string;
  width?: string;
};

export const IconContainer = styled.div<IconContainerProps>`
  position: relative;
  margin: ${({ margin }) => margin || 0};
  width: ${({ width }) => width || '32px'};
  height: ${({ width }) => width || '32px'};
  border-radius: 100%;
  overflow: hidden;
`;
