import { FC, useEffect } from 'react';
import PreviewTemplateCard from '../PreviewTemplateCard';
import { useCreateAssetContext } from '../Provider';
import {
  Container,
  Row,
  LeftColumn,
  RightColumn,
  ElementTitle,
} from './CreatePageLayout.styled';
import { fileReader } from '../../utils';

const CreatePageLayout: FC<{ children: JSX.Element }> = ({ children }) => {
  const {
    setTemplateImage,
    setTemplateVideo,
    templateUploadedFile,
    selectedCollection,
    templateName,
    templateImage,
    templateVideo,
    maxSupply,
  } = useCreateAssetContext();

  useEffect(() => {
    if (templateUploadedFile && window) {
      const filetype = templateUploadedFile.type;
      if (filetype.includes('video')) {
        const readerSetTemplateVideo = (result) => {
          setTemplateImage('');
          setTemplateVideo(result);
        };
        fileReader(readerSetTemplateVideo, templateUploadedFile);
      } else {
        const readerSetTemplateImage = (result) => {
          setTemplateVideo('');
          setTemplateImage(result);
        };
        fileReader(readerSetTemplateImage, templateUploadedFile);
      }
    } else {
      setTemplateImage('');
      setTemplateVideo('');
    }
  }, [templateUploadedFile]);

  return (
    <Container>
      <Row>
        <LeftColumn>{children}</LeftColumn>
        <RightColumn>
          <ElementTitle>Preview</ElementTitle>
          <PreviewTemplateCard
            templateVideo={templateVideo}
            templateImage={templateImage}
            templateName={templateName}
            collectionImage={selectedCollection.img}
            collectionDisplayName={selectedCollection.name}
            collectionName={selectedCollection.collection_name}
            maxSupply={maxSupply}
            hasPlaceholderIcon={!selectedCollection.name}
          />
        </RightColumn>
      </Row>
    </Container>
  );
};

export default CreatePageLayout;
