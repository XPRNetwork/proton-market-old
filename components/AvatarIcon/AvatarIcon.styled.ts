import styled from 'styled-components';

type AvatarImageProps = {
  size?: string;
  margin?: string;
};

export const AvatarImage = styled.div<AvatarImageProps>`
  border-radius: 100%;
  overflow: hidden;
  margin: ${({ margin }) => margin || 0};
  width: ${({ size }) => (size ? size : '32px')};
  height: ${({ size }) => (size ? size : '32px')};
`;
