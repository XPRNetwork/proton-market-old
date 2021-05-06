import { Image } from '../../styles/index.styled';
import {
  MobileContainer,
  MobileTitle,
  MobileSubTitle,
} from './MobileCreatePagePlaceholder.styled';

const MobileCreatePagePlaceholder = (): JSX.Element => (
  <MobileContainer>
    <Image
      width="179px"
      height="162px"
      alt="mobile create"
      src="/mobile-create.png"
    />
    <MobileTitle>Looks like you’re on a mobile device or tablet</MobileTitle>
    <MobileSubTitle>
      This isn’t available on mobile or tablet browers. Switch to desktop to
      start creating your NFTs.
    </MobileSubTitle>
  </MobileContainer>
);

export default MobileCreatePagePlaceholder;
