import styled from 'styled-components';

type IconProps = {
  size?: string;
  objectFit?: string;
  margin?: string;
};

export const ImageIcon = styled.img<IconProps>`
  width: ${({ size }) => size || '24px'};
  height: ${({ size }) => size || '24px'};
  object-fit: ${({ objectFit }) => objectFit || ''};
  border-radius: 100%;
  margin: ${({ margin }) => margin || 0};
`;

export const VideoIcon = styled.video<IconProps>`
  width: ${({ size }) => size || '24px'};
  height: ${({ size }) => size || '24px'};
  border-radius: 100%;
  margin: ${({ margin }) => margin || 0};
`;
