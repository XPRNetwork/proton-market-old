/* eslint-disable jsx-a11y/media-has-caption */
import { useRef } from 'react';
import LazyLoad from 'react-lazyload';
import {
  VideoContainer,
  Video,
  CenterContainer,
  VideoError,
} from './TemplateVideo.styled';
import { useNavigatorUserAgent } from '../../hooks';
import { PlaceholderAsset } from '../TemplateCard/TemplateCard.styled';

type Props = {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  priceTag?: JSX.Element;
};

const IncompatibleVideoError = () => (
  <VideoError>
    Firefox does not support
    <br />
    Proton Market videos.
    <br />
    Please use another browser.
  </VideoError>
);

const TemplateVideo = ({
  src,
  priceTag,
  autoPlay = false,
  controls = true,
}: Props): JSX.Element => {
  const { isDesktop, isBrowserVideoCompatible } = useNavigatorUserAgent();
  const refPlaceholder = useRef<HTMLDivElement>();

  const removePlaceholder = () => {
    if (refPlaceholder && refPlaceholder.current) {
      refPlaceholder.current.remove();
    }
  };

  return (
    <VideoContainer onClick={(e) => e.stopPropagation()}>
      <CenterContainer>
        {isBrowserVideoCompatible ? (
          <div>
            <PlaceholderAsset ref={refPlaceholder} />
            <LazyLoad height="100%" offset={100} once>
              <Video
                autoPlay={autoPlay}
                controls={controls}
                loop
                poster={isDesktop ? null : src}
                src={src}
                onLoadedData={removePlaceholder}
                onError={removePlaceholder}
              />
            </LazyLoad>
          </div>
        ) : (
          <IncompatibleVideoError />
        )}
        {priceTag}
      </CenterContainer>
    </VideoContainer>
  );
};

export default TemplateVideo;
