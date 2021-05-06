import styled from 'styled-components';

type ContainerProps = {
  isDragActive: boolean;
};

export const Container = styled.div<ContainerProps>`
  height: 136px;
  border-radius: 4px;
  border: dashed 2px;
  border-color: ${({ isDragActive }) => (isDragActive ? '#b28bf4' : '#e6e6e6')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ isDragActive }) =>
    isDragActive ? 'rgba(240, 232, 253, 0.5)' : 'white'};
  cursor: pointer;

  :active,
  :focus {
    outline: none;
  }
`;

export const FileTypeDescription = styled.span`
  font-size: 14px;
  line-height: 1.71;
  text-align: center;
  color: #808080;
`;

export const UploadButton = styled.button`
  width: 110px;
  height: 32px;
  margin-top: 20px;
  padding: 3px 16px 5px;
  border-radius: 4px;
  border: none;
  background-color: #f2f2f2;
  transition: 0.2s;
  color: #752eeb;
  cursor: pointer;

  :hover,
  :focus-visible {
    color: white;
    background-color: #752eeb;
  }

  :active,
  :focus {
    outline-color: #752eeb;
  }
`;

export const UploadError = styled.span`
  margin: 10px 10px 0;
  font-size: 13px;
  color: #f94e6c;
  text-align: center;
`;

export const RemovePreviewIcon = styled.div`
  cursor: pointer;
`;

export const Preview = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
`;

export const ImageInfo = styled.div`
  display: flex;
`;

export const FilenameInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  justify-content: center;
`;

export const PreviewImageContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
`;

export const FileNameText = styled.p`
  font-size: 14px;
  line-height: 1.71;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FileSize = styled.p`
  font-size: 12px;
  color: #808080;
  line-height: 1.67;
`;
