/* eslint-disable jsx-a11y/media-has-caption */
import { useCallback, useState, Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image } from '../../styles/index.styled';
import {
  Container,
  FileTypeDescription,
  UploadButton,
  UploadError,
  RemovePreviewIcon,
  Preview,
  ImageInfo,
  FilenameInfo,
  PreviewImageContainer,
  FileNameText,
  FileSize,
} from './DragDropFileUploadLg.styled';
import {
  LG_FILE_UPLOAD_TYPES_TEXT,
  LG_FILE_UPLOAD_TYPES,
  LG_FILE_SIZE_UPLOAD_LIMIT,
} from '../../utils/constants';
import { ReactComponent as UploadIcon } from '../../public/upload-icon.svg';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { fileReader } from '../../utils';

type Props = {
  setTemplateUploadedFile: Dispatch<SetStateAction<File>>;
  templateUploadedFile: File;
  setUploadedFilePreview: Dispatch<SetStateAction<string>>;
  uploadedFilePreview: string;
};

const DragDropFileUploadLg = ({
  setTemplateUploadedFile,
  templateUploadedFile,
  uploadedFilePreview,
  setUploadedFilePreview,
}: Props): JSX.Element => {
  const onDrop = useCallback((acceptedFiles) => {
    setUploadError('');
    const file = acceptedFiles[0];
    const isAcceptedFileType = LG_FILE_UPLOAD_TYPES[file.type] || false;
    const isAcceptedFileSize = file.size <= LG_FILE_SIZE_UPLOAD_LIMIT; // 30MB
    if (isAcceptedFileType && isAcceptedFileSize) {
      setUploadedFilePreview(null);
      setTemplateUploadedFile(file);
      fileReader((result) => setUploadedFilePreview(result), file);
    } else {
      setTemplateUploadedFile(null);
      setUploadedFilePreview('');
      setUploadError(
        'Unable to upload, please double check your file size or file type.'
      );
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [uploadError, setUploadError] = useState<string>('');

  const extToMime = {
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.mpeg': 'video/mpeg',
    '.mp4': 'video/mp4',
    // '.glb': 'model/gltf-binary',
    // '.gltf': 'model/gltf+json',
  };
  const accept =
    Object.values(extToMime).join(',') + ',' + Object.keys(extToMime).join(',');

  return (
    <Container {...getRootProps()} isDragActive={isDragActive}>
      <input {...getInputProps()} accept={accept} />
      {templateUploadedFile && uploadedFilePreview ? (
        <Preview>
          <ImageInfo>
            <PreviewImageContainer>
              {templateUploadedFile.type.includes('mp4') ? (
                <video
                  width="64"
                  height="64"
                  muted
                  playsInline
                  src={`${uploadedFilePreview}`}
                />
              ) : (
                <Image
                  width="64px"
                  height="64px"
                  objectFit="contain"
                  alt={templateUploadedFile.name}
                  src={uploadedFilePreview}
                />
              )}
            </PreviewImageContainer>
            <FilenameInfo>
              <FileNameText>{templateUploadedFile.name}</FileNameText>
              <FileSize>
                {(templateUploadedFile.size / 1000).toFixed(2)} kb
              </FileSize>
            </FilenameInfo>
          </ImageInfo>
          <RemovePreviewIcon
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              setTemplateUploadedFile(null);
              setUploadedFilePreview('');
            }}>
            <CloseIcon />
          </RemovePreviewIcon>
        </Preview>
      ) : isDragActive ? (
        <>
          <UploadIcon />
          <FileTypeDescription>{LG_FILE_UPLOAD_TYPES_TEXT}</FileTypeDescription>
        </>
      ) : (
        <>
          <FileTypeDescription>{LG_FILE_UPLOAD_TYPES_TEXT}</FileTypeDescription>
          {uploadError ? <UploadError>{uploadError}</UploadError> : null}
          <UploadButton role="button">Choose file</UploadButton>
        </>
      )}
    </Container>
  );
};

export default DragDropFileUploadLg;
