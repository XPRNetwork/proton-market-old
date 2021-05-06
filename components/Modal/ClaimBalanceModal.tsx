import { useState, useEffect, MouseEvent } from 'react';
import { useAuthContext, useModalContext } from '../Provider';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  HalfButton,
} from './Modal.styled';
import ProtonSDK from '../../services/proton';
import { formatPrice } from '../../utils';
import { useWindowSize } from '../../hooks';
import { ReactComponent as CloseIcon } from '../../public/close.svg';

export const ClaimBalanceModal = (): JSX.Element => {
  const {
    currentUser,
    atomicMarketBalance,
    updateAtomicBalance,
  } = useAuthContext();
  const { closeModal } = useModalContext();
  const [error, setError] = useState<string>('');
  const { isMobile } = useWindowSize();

  useEffect(() => {
    if (error) setError('');
  }, []);

  const withdraw = async () => {
    try {
      const res = await ProtonSDK.withdraw({
        actor: currentUser ? currentUser.actor : '',
        amount: atomicMarketBalance,
      });

      if (!res.success) {
        throw new Error('Unable to make withdrawal.');
      }

      closeModal();
      await updateAtomicBalance(currentUser.actor);
    } catch (err) {
      setError(err.message);
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
          <Title>Claim {formatPrice(atomicMarketBalance)}</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          Congratulations, your NFTs have earned you{' '}
          {formatPrice(atomicMarketBalance)} in royalties. Claim them now!
        </Description>
        <HalfButton fullWidth={isMobile} onClick={withdraw}>
          Claim Now
        </HalfButton>
      </ModalBox>
    </Background>
  );
};
