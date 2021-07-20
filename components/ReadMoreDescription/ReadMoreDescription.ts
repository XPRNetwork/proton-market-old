import styled from 'styled-components';

type DescriptionProps = {
  mb: string;
  maxWidth: string;
  textAlign: string;
  fontColor: string;
};

export const Description = styled.span<DescriptionProps>`
  margin-bottom: ${({ mb }) => mb};
  max-width: ${({ maxWidth }) => maxWidth};
  text-align: ${({ textAlign }) => textAlign};
  color: ${({ fontColor }) => fontColor};
  font-size: 14px;
  line-height: 24px;
  overflow-wrap: break-word;
  width: 100%;
`;

export const More = styled.span`
  color: #752eeb;
  cursor: pointer;
  font-size: 12px;
`;
