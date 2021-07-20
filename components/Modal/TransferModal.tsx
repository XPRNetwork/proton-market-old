import { MouseEvent, useState } from 'react';
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
  ErrorMessage,
  Column,
  HalfButton,
} from './Modal.styled';
import InputField from '../InputField';
import { useWindowSize } from '../../hooks';
import ProtonSDK from '../../services/proton';
import proton from '../../services/proton-rpc';
import { ReactComponent as CloseIcon } from '../../public/close.svg';

export const TransferModal = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const {
    assetId,
    templateMint,
    fetchPageData,
  } = modalProps as TransferOrBurnNFTModalProps;
  const [recipient, setRecipient] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { isMobile } = useWindowSize();
  const [isValid, setIsValid] = useState<boolean>(false);

  const transfer = async () => {
    try {
      if (recipient.length < 4 || recipient.length > 12 || !isValid) {
        return;
      }

      const user = await proton.getUserByChainAccount(recipient);

      if (!user) {
        setError('Invalid user. Please try again.');
        return;
      }

      const res = await ProtonSDK.transfer({
        sender: currentUser ? currentUser.actor : '',
        recipient,
        asset_id: assetId,
        memo,
      });

      if (!res.success && !res.error.includes('Modal closed')) {
        throw new Error(res.error);
      }

      if (res.success) {
        fetchPageData();
        closeModal();
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <Background onClick={handleBackgroundClick}>
      <ModalBox>
        <Section>
          <Title>Transfer NFT</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          You can transfer NFTs from your account to another.
        </Description>
        <Column>
          <InputField value={'Serial #' + templateMint} disabled mb="16px" />
          <InputField
            value={recipient}
            setValue={setRecipient}
            setFormError={setError}
            placeholder="Receiver name"
            mb="16px"
            checkIfIsValid={(input: string) => {
              const isValid =
                input.length >= 4 &&
                input.length < 13 &&
                !!input.match(/^[a-z1-5]+$/);
              setIsValid(isValid);
              const errorMessage =
                "Recipient's name must be 4-12 characters and only contain the numbers 1-5 or lowercase letters a-z";
              return {
                isValid,
                errorMessage,
              };
            }}
          />
          <InputField
            value={memo}
            setValue={setMemo}
            setFormError={setError}
            placeholder="Memo"
            mb="24px"
          />
          <HalfButton
            fullWidth={isMobile}
            onClick={transfer}
            margin="0"
            disabled={!isValid}>
            Transfer
          </HalfButton>
          {error ? <ErrorMessage>{error}</ErrorMessage> : null}
        </Column>
      </ModalBox>
    </Background>
  );
};
