import { IconContainer } from './CollectionIcon.styled';
import { IPFS_RESOLVER_IMAGE, RESIZER_IMAGE } from '../../utils/constants';
import { Image } from '../../styles/index.styled';
export { IconContainer } from './CollectionIcon.styled';

type Props = {
  name: string;
  image?: string;
  margin?: string;
  width?: string;
};

const CollectionIcon = ({ name, image, margin, width }: Props): JSX.Element => {
  const isIpfs = image && image.slice(0, 4).toLowerCase() !== 'data';
  const imageSrc = isIpfs
    ? `${RESIZER_IMAGE}${IPFS_RESOLVER_IMAGE}${image}`
    : image || '/icon-monsters.png';
  const onImageError = (e) => {
    e.currentTarget.onerror = null;
    if (isIpfs) {
      e.currentTarget.src = `${IPFS_RESOLVER_IMAGE}${image}`;
    }
  };

  return (
    <IconContainer margin={margin} width={width}>
      <Image
        alt={name}
        src={imageSrc}
        height="100%"
        width="100%"
        onError={onImageError}
      />
    </IconContainer>
  );
};

CollectionIcon.defaultProps = {
  name: 'collection icon',
};

export default CollectionIcon;
