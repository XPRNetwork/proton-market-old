import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Title,
  SubTitle,
  Step,
  Terms,
  TermsLink,
  ErrorMessage,
  FeeLabel,
} from '../CreatePageLayout/CreatePageLayout.styled';
import InputField from '../InputField';
import Button from '../Button';
import Spinner from '../Spinner';
import { BackButton } from '../CreatePageLayout/CreatePageLayout.styled';
import { CREATE_PAGE_STATES } from '../../pages/create';
import { useAuthContext } from '../../components/Provider';
import fees, { MintFee } from '../../services/fees';

type Props = {
  mintAmount: string;
  setMintAmount: Dispatch<SetStateAction<string>>;
  setMintFee: Dispatch<SetStateAction<MintFee>>;
  mintFee: MintFee;
  createNft: () => Promise<void>;
  createNftError: string;
  setPageState: Dispatch<SetStateAction<string>>;
  maxSupply: string;
};

const InitialMint = ({
  createNft,
  setMintAmount,
  setMintFee,
  mintFee,
  mintAmount,
  createNftError,
  setPageState,
  maxSupply,
}: Props): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [mintError, setMintError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    if (createNftError) {
      setMintError(createNftError);
    } else {
      setMintError('');
    }
  }, [createNftError]);

  useEffect(() => {
    const numAssets = parseInt(mintAmount);
    const mintFees = fees.calculateCreateFlowFees({
      numAssets,
      actor: currentUser ? currentUser.actor : '',
    });
    setMintFee(mintFees);
  }, [mintAmount, currentUser, isLoading]);

  const validateAndProceed = async () => {
    if (!mintAmount) {
      setMintError('Please fill in an initial mint amount (minimum 1).');
    } else {
      setMintError('');
      setIsLoading(true);
      try {
        await createNft();
      } catch (e) {
        setMintError(e);
      }
      setIsLoading(false);
    }
  };

  const checkMintAmountValidity = (amount) => {
    const number = parseInt(amount);
    let valid = false;
    let errorMessage;

    if (number >= 1 && number <= 50) {
      if (parseInt(maxSupply) > 0) {
        if (number <= parseInt(maxSupply)) {
          valid = true;
        } else {
          errorMessage = 'You cannot mint more than the set edition size';
        }
      } else {
        valid = true;
      }
    } else {
      errorMessage = 'You can mint 1-50 assets at a time';
    }

    setIsValid(valid);
    return {
      isValid: valid,
      errorMessage,
    };
  };

  return (
    <>
      <Step>Step 3 of 3</Step>
      <Title>Initial Mint</Title>
      <SubTitle>
        Now you are ready to mint your NFT. Choose an initial mint amount (first
        10 are for free). Minting takes a bit of time, so we recommend no more
        than 50 tokens in your initial mint.
      </SubTitle>
      <InputField
        inputType="number"
        min={1}
        max={50}
        step={1}
        mt="8px"
        value={mintAmount}
        setValue={setMintAmount}
        placeholder="Enter mint amount"
        submit={isValid ? null : createNft}
        checkIfIsValid={checkMintAmountValidity}
      />
      <FeeLabel>
        <span>Mint Fee</span>
        <span>≈ {mintFee.totalFee} XUSDC</span>
      </FeeLabel>
      <Terms>By clicking “Create NFT”: </Terms>
      <span>
        <Terms>
          - You agree to our{' '}
          <TermsLink target="_blank" href="https://www.protonchain.com/terms">
            Terms of Service &amp; Privacy Policy.
          </TermsLink>
        </Terms>
      </span>
      <Terms>
        - You declare that everything you have uploaded is original artwork. Any
        plagiarization is not allowed and will be subject to removal.
      </Terms>
      <br />
      {mintError ? <ErrorMessage>{mintError}</ErrorMessage> : null}
      <Button
        onClick={isLoading ? null : validateAndProceed}
        disabled={!isValid || isLoading}
        padding={isLoading ? '0' : '12px 0'}>
        {isLoading ? (
          <Spinner size="42px" radius="10" hasBackground />
        ) : (
          'Create NFT'
        )}
      </Button>
      <BackButton
        onClick={() => {
          setMintAmount('');
          setPageState(CREATE_PAGE_STATES.CREATE_TEMPLATE);
        }}>
        Back
      </BackButton>
    </>
  );
};

export default InitialMint;
