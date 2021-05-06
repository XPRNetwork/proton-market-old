/* eslint-disable jsx-a11y/media-has-caption */
import {
  VideoContainer,
  Video,
  CenterContainer,
  VideoError,
} from './TemplateVideo.styled';
import { useNavigatorUserAgent } from '../../hooks';

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
  return (
    <VideoContainer>
      <CenterContainer>
        {isBrowserVideoCompatible ? (
          <Video
            autoPlay={autoPlay}
            controls={controls}
            loop
            poster={isDesktop ? null : src}
            src={src}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <IncompatibleVideoError />
        )}
        {priceTag}
      </CenterContainer>
    </VideoContainer>
  );
};

export default TemplateVideo;
