import { useState } from 'react';
import { Description, More } from './ReadMoreDescription';

type Props = {
  description: string;
  mb: string;
  maxWidth: string;
  textAlign: string;
  fontColor: string;
  maxDescriptionLength: number;
};

const ReadMoreDescription = ({
  description,
  mb,
  maxWidth,
  textAlign,
  fontColor,
  maxDescriptionLength,
}: Props): JSX.Element => {
  const words = description.split(' ');
  const [isDescriptionActive, setIsDescriptionActive] = useState(false);

  const getDescriptionSnippet = () => {
    if (description.length <= maxDescriptionLength) {
      return description;
    }

    let maxCharacters = maxDescriptionLength;
    for (let index = 0; index < words.length; index++) {
      const word = words[index];

      if (word.length > maxDescriptionLength) {
        return word.slice(0, maxDescriptionLength);
      }

      maxCharacters -= word.length + 1;

      if (maxCharacters < 0) {
        return words.slice(0, index).join(' ');
      }
    }
  };

  const descriptionSnippet = getDescriptionSnippet();
  const [renderedDescription, setRenderedDescription] = useState(
    descriptionSnippet
  );

  const handleDescription = () => {
    if (!isDescriptionActive) {
      setIsDescriptionActive(true);
      setRenderedDescription(description);
      return;
    }
    setIsDescriptionActive(false);
    setRenderedDescription(descriptionSnippet);
  };

  return (
    <Description
      mb={mb}
      maxWidth={maxWidth}
      textAlign={textAlign}
      fontColor={fontColor}>
      {renderedDescription}
      {description.length > maxDescriptionLength ? (
        <>
          {isDescriptionActive ? ' ' : '... '}
          <More onClick={handleDescription}>
            {isDescriptionActive ? 'Read less' : 'Read more'}
          </More>
        </>
      ) : (
        ''
      )}
    </Description>
  );
};

ReadMoreDescription.defaultProps = {
  description: '',
  mb: '32px',
  maxWidth: '424px',
  textAlign: 'left',
  fontColor: '1a1a1a',
  maxDescriptionLength: 170,
};

export default ReadMoreDescription;
