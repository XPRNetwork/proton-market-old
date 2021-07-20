import { useState, MouseEvent, useEffect } from 'react';
import {
  useAuthContext,
  useModalContext,
  MintAssetModalProps,
} from '../Provider';
import InputField from '../InputField';
import {
  Background,
  ModalBox,
  Section,
  CloseIconContainer,
  Title,
  Description,
  HalfButton,
  FeeLabel,
} from './Modal.styled';
import { RAM_AMOUNTS } from '../../utils/constants';
import fees from '../../services/fees';
import ProtonSDK from '../../services/proton';
import { ReactComponent as CloseIcon } from '../../public/close.svg';
import { useWindowSize } from '../../hooks';

type MintFee = {
  display: string;
  raw: number;
};

export const MintAssetModal = (): JSX.Element => {
  const {
    currentUser: { actor },
  } = useAuthContext();
  const { closeModal, modalProps } = useModalContext();
  const { currentUser } = useAuthContext();
  const { isMobile } = useWindowSize();
  const {
    templateId,
    maxSupply,
    issuedSupply,
    collectionName,
    fetchPageData,
    setIsModalWithFeeOpen,
  } = modalProps as MintAssetModalProps;
  const [amount, setAmount] = useState<string>('');
  const [mintFee, setMintFee] = useState<MintFee>({
    display: '0.00',
    raw: null,
  });
  const possibleMintAmount =
    maxSupply === 0 ? Infinity : maxSupply - issuedSupply;
  const maxMintAmountForSession =
    possibleMintAmount < 50 ? possibleMintAmount : 50;
  const maxMintMessage = `${maxMintAmountForSession} max${
    maxMintAmountForSession === 50 ? ' per session' : ''
  }`;

  useEffect(() => {
    const numAssets = parseInt(amount);
    const fee = fees.calculateFee({
      numAssets: isNaN(numAssets) ? 0 : numAssets,
      ramCost: RAM_AMOUNTS.MINT_ASSET,
      actor: currentUser ? currentUser.actor : '',
    });
    setMintFee(fee);
  }, [amount, currentUser]);

  const mintNfts = async () => {
    try {
      const result = await ProtonSDK.mintAssets({
        author: actor,
        collection_name: collectionName,
        template_id: templateId,
        mint_amount: parseInt(amount),
        mint_fee: mintFee.raw,
      });

      if (result.success) {
        closeModal();
        setIsModalWithFeeOpen(false);
        setTimeout(() => {
          fetchPageData();
        }, 1000);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const maxSupplyDescription =
    maxSupply === 0
      ? `You have minted ${issuedSupply} out of an unlimited edition size.`
      : `You have minted ${issuedSupply} out of a total edition size of ${maxSupply}.`;

  return (
    <Background onClick={handleBackgroundClick}>
      <ModalBox>
        <Section>
          <Title>Mint NFTs</Title>
          <CloseIconContainer role="button" onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </Section>
        <Description>
          {maxSupplyDescription}
          <br />
          Enter an amount to mint ({maxMintMessage}).
        </Description>
        <InputField
          inputType="number"
          min={1}
          max={maxMintAmountForSession}
          step={1}
          mt="8px"
          value={amount}
          setValue={setAmount}
          placeholder="Enter Mint Amount"
          submit={parseInt(amount) > maxMintAmountForSession ? null : mintNfts}
          checkIfIsValid={(input) => {
            const numberInput = parseInt(input as string);
            const isValid =
              !isNaN(numberInput) &&
              numberInput >= 1 &&
              numberInput <= maxMintAmountForSession;
            const errorMessage = `You can mint 1-${maxMintAmountForSession} assets in this mint session`;
            return {
              isValid,
              errorMessage,
            };
          }}
        />
        <FeeLabel>
          <span>Mint Fee</span>
          <span>≈ {mintFee.display} XUSDC</span>
        </FeeLabel>
        <HalfButton
          onClick={mintNfts}
          fullWidth={isMobile}
          disabled={
            parseInt(amount) === 0 ||
            isNaN(parseInt(amount)) ||
            parseInt(amount) > maxMintAmountForSession
          }>
          Mint NFTs
        </HalfButton>
      </ModalBox>
    </Background>
  );
};
