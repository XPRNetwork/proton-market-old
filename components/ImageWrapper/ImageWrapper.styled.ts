import styled from 'styled-components';

type ImgProps = {
  width?: string;
  height?: string;
  objectFit?: string;
};

export const ImageStyled = styled.img<ImgProps>`
  height: ${({ height }) => height || '270px'};
  width: ${({ width }) => width || '270px'};
  object-fit: ${({ objectFit }) => objectFit || ''};
`;

export const DefaultImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
`;
