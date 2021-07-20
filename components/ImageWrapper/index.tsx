import { useEffect, useState } from 'react';
import { ImageStyled, DefaultImage } from './ImageWrapper.styled';
import { ReactComponent as DefaultIcon } from '../../public/placeholder-template-icon.svg';

type Props = {
  src: string;
  height?: string;
  width?: string;
  alt: string;
  imageStyling: React.ElementType;
  onLoad?: () => void;
  onError?: (e) => void;
  onClick?: () => void;
  ipfsHash?: string;
};

const ImageWrapper = ({
  src,
  imageStyling: Image,
  ipfsHash,
  onLoad,
  ...props
}: Props): JSX.Element => {
  const [width, setWidth] = useState<string>();
  const [height, setHeight] = useState<string>();

  useEffect(() => {
    const img = new window.Image();
    img.addEventListener('load', function () {
      const { naturalWidth, naturalHeight } = this;

      if (naturalWidth > naturalHeight) {
        const conversion = 270 / naturalWidth;
        const newHeight = naturalHeight * conversion;
        setHeight(
          newHeight <= 270 ? Math.round(newHeight).toString() + 'px' : null
        );
        setWidth(undefined);
      } else {
        const conversion = 270 / naturalHeight;
        const newWidth = naturalWidth * conversion;
        setWidth(
          newWidth <= 270 ? Math.round(newWidth).toString() + 'px' : null
        );
        setHeight(undefined);
      }
    });
    img.src = src;
  }, [src]);

  useEffect(() => {
    onLoad();
  }, [ipfsHash]);

  if (!src) {
    return (
      <DefaultImage>
        <DefaultIcon />
      </DefaultImage>
    );
  }

  return <Image width={width} height={height} src={src} {...props} />;
};

export default ImageWrapper;

ImageWrapper.defaultProps = {
  imageStyling: ImageStyled,
};
