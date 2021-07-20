import { useState, useRef, memo } from 'react';
import { Image } from '../../styles/index.styled';
import { useModalContext, MODAL_TYPES } from '../Provider';
import {
  PageHeaderContainer,
  ImageContainer,
  RoundButton,
  Name,
  SubName,
  ButtonContainer,
  VerifiedIconContainer,
  PageHeaderAvatarContainer,
} from './PageHeader.styled';
import { ReactComponent as MoreIcon } from '../../public/more.svg';
import { ReactComponent as VerifiedIcon } from '../../public/icon-light-verified-24-px.svg';
import ShareOnSocial from '../ShareOnSocial';
import { useClickAway } from '../../hooks';
import { IPFS_RESOLVER_IMAGE, RESIZER_IMAGE_SM } from '../../utils/constants';
import ReadMoreDescription from '../ReadMoreDescription';

type PageHeaderProps = {
  image?: string;
  description?: string;
  name?: string;
  subName?: string;
  type: 'user' | 'collection';
  author?: string;
  hasEditFunctionality?: boolean;
  isLightKYCVerified?: boolean;
};

const PageHeader = ({
  image,
  description,
  name,
  subName,
  type,
  hasEditFunctionality,
  isLightKYCVerified,
}: PageHeaderProps): JSX.Element => {
  const { openModal } = useModalContext();
  const [shareActive, setShareActive] = useState<boolean>(false);
  const shareRef = useRef(null);
  useClickAway(shareRef, () => setShareActive(false));

  const avatarImg = image
    ? `data:image/jpeg;base64,${image}`
    : '/default-avatar.png';
  const collectionImg = image
    ? `${RESIZER_IMAGE_SM}${IPFS_RESOLVER_IMAGE}${image}`
    : '/proton.svg';

  const displayImg = type === 'user' ? avatarImg : collectionImg;

  const onImageError = (e) => {
    e.currentTarget.onerror = null;
    if (type === 'user' && image) {
      e.currentTarget.src = `${IPFS_RESOLVER_IMAGE}${image}`;
    }
  };

  const shareButton = (
    <RoundButton
      size="40px"
      ref={shareRef}
      onClick={() => setShareActive(!shareActive)}>
      <MoreIcon />
      <ShareOnSocial top="50px" active={shareActive} />
    </RoundButton>
  );

  const buttons = hasEditFunctionality ? (
    <ButtonContainer>
      {shareButton}
      <RoundButton
        onClick={() => openModal(MODAL_TYPES.UPDATE_COLLECTION)}
        padding="8px 16px"
        margin="0 0 0 8px">
        Edit collection
      </RoundButton>
    </ButtonContainer>
  ) : (
    <ButtonContainer>{shareButton}</ButtonContainer>
  );

  return (
    <PageHeaderContainer>
      <PageHeaderAvatarContainer>
        <ImageContainer>
          <Image
            width="100%"
            height="100%"
            src={displayImg}
            onError={onImageError}
            objectFit="cover"
          />
        </ImageContainer>
        {isLightKYCVerified && (
          <VerifiedIconContainer>
            <VerifiedIcon />
          </VerifiedIconContainer>
        )}
      </PageHeaderAvatarContainer>
      <Name>{name}</Name>
      {subName ? <SubName>@{subName}</SubName> : null}
      {description ? (
        <ReadMoreDescription
          description={description}
          mb="24px"
          maxWidth="684px"
          textAlign="center"
          fontColor="#808080"
          maxDescriptionLength={183}
        />
      ) : null}
      {buttons}
    </PageHeaderContainer>
  );
};

export default memo(PageHeader);
