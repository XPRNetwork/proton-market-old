import { useCallback, Dispatch, SetStateAction, MutableRefObject } from 'react';
import { useDropzone } from 'react-dropzone';
import CollectionIcon from '../CollectionIcon';
import {
  Container,
  PreviewImage,
  PlaceholderContainer,
} from './DragDropFileUploadSm.styled';
import {
  SM_FILE_UPLOAD_TYPES_TEXT,
  SM_FILE_UPLOAD_TYPES,
  SM_FILE_SIZE_UPLOAD_LIMIT,
} from '../../utils/constants';
import { ReactComponent as CircleUploadIcon } from '../../public/upload-icon-small-circle.svg';
import { ReactComponent as PlaceholderIcon } from '../../public/upload-icon-small-shape.svg';

type Props = {
  uploadedFile: File;
  uploadInputRef: MutableRefObject<HTMLInputElement>;
  setUploadedFile: Dispatch<SetStateAction<File>>;
  setFormError: Dispatch<SetStateAction<string>>;
  setUploadError: Dispatch<SetStateAction<string>>;
  placeholderImage?: string;
};

const DragDropFileUploadSm = ({
  uploadedFile,
  uploadInputRef,
  setUploadedFile,
  setFormError,
  setUploadError,
  placeholderImage,
}: Props): JSX.Element => {
  const onDrop = useCallback((acceptedFiles) => {
    setUploadError('');
    setFormError('');
    const file = acceptedFiles[0];
    const isAcceptedFileType = SM_FILE_UPLOAD_TYPES[file.type] || false;
    const isAcceptedFileSize = file.size <= SM_FILE_SIZE_UPLOAD_LIMIT;
    if (isAcceptedFileType && isAcceptedFileSize) {
      setUploadedFile(file);
    } else {
      setUploadError(
        `Unable to upload, please double check your file size or file type. Accepted file types: ${SM_FILE_UPLOAD_TYPES_TEXT}`
      );
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const placeholder = (
    <PlaceholderContainer borderless={!!placeholderImage}>
      {placeholderImage ? (
        <CollectionIcon image={placeholderImage} width="100%" />
      ) : (
        <PlaceholderIcon />
      )}
    </PlaceholderContainer>
  );

  return (
    <Container {...getRootProps()} ref={uploadInputRef}>
      <input
        {...getInputProps()}
        accept="image/png,image/jpg,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
      />
      {isDragActive ? (
        <CircleUploadIcon />
      ) : (
        <>
          {uploadedFile ? (
            <PreviewImage
              alt="preview"
              src={URL.createObjectURL(uploadedFile)}
            />
          ) : (
            placeholder
          )}
        </>
      )}
    </Container>
  );
};

DragDropFileUploadSm.defaultProps = {
  setFormError: () => {},
  setUploadError: () => {},
  setUploadedFile: () => {},
};

export default DragDropFileUploadSm;
