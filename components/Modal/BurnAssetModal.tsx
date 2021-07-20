import { MouseEvent } from 'react';
import {
  useAuthContext,
  useModalContext,
  TransferOrBurnNFTModalProps,
} from '../Provider';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  HalfButton,
} from './Modal.styled';
import InputField from '../InputField';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import ProtonSDK from '../../services/proton';
import { useWindowSize } from '../../hooks';

export const BurnAssetModal = (): JSX.Element => {
  const {
    currentUser: { actor },
  } = useAuthContext();
  const { isMobile } = useWindowSize();
  const { closeModal, modalProps } = useModalContext();
  const {
    assetId,
    templateMint,
    fetchPageData,
  } = modalProps as TransferOrBurnNFTModalProps;

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const burn = async () => {
    const result = await ProtonSDK.burn({
      owner: actor,
      asset_id: assetId,
    });

    if (result.success) {
      closeModal();
      fetchPageData();
    }
  };

  return (
    <Background onClick={handleBackgroundClick}>
      <ModalBox>
        <Section>
          <Title>Burn NFT</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          Are you sure you want to burn this NFT? This action will permanently
          delete the NFT and cannot be undone.
        </Description>
        <InputField value={'#' + templateMint} disabled mb="24px" />
        <HalfButton
          fullWidth={isMobile}
          color="#f94e6c"
          hoverColor="#ff778e"
          onClick={burn}>
          Burn NFT
        </HalfButton>
      </ModalBox>
    </Background>
  );
};
