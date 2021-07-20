import styled from 'styled-components';

type PlaceholderContainerProps = {
  borderless?: boolean;
};

export const Container = styled.div`
  min-width: 88px;
  height: 88px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 24px 32px 0;

  :active,
  :focus {
    outline: none;
  }
`;

export const PreviewImage = styled.img`
  width: 88px;
  height: 88px;
  border-radius: 100%;
  object-fit: cover;
`;

export const PlaceholderContainer = styled(PreviewImage).attrs({
  as: 'div',
})<PlaceholderContainerProps>`
  width: 88px;
  height: 88px;
  border-radius: 100%;
  border: ${({ borderless }) => (borderless ? 'none' : '2px dashed #e6e6e6')};
  display: flex;
  justify-content: center;
  align-items: center;
`;
