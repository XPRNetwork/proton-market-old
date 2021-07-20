import { useState, useEffect, FC, Dispatch, SetStateAction } from 'react';
import {
  Title,
  SubTitle,
  Step,
  ElementTitle,
  ErrorMessage,
  Terms,
  TermsLink,
  FeeLabel,
} from '../CreatePageLayout/CreatePageLayout.styled';
import DragDropFileUploadLg from '../DragDropFileUploadLg';
import InputField from '../InputField';
import Button from '../Button';
import { BackButton } from '../CreatePageLayout/CreatePageLayout.styled';
import Spinner from '../Spinner';
import {
  useAuthContext,
  useCreateAssetContext,
  CREATE_PAGE_STATES,
} from '../../components/Provider';
import fees from '../../services/fees';

const CreateTemplate: FC<{
  setPageState: Dispatch<SetStateAction<string>>;
}> = ({ setPageState }) => {
  const { currentUser } = useAuthContext();
  const {
    setTemplateName,
    setTemplateDescription,
    setMaxSupply,
    setMintAmount,
    setTemplateUploadedFile,
    setUploadedFilePreview,
    setMintFee,
    createNft,
    templateName,
    templateDescription,
    maxSupply,
    mintAmount,
    templateUploadedFile,
    uploadedFilePreview,
    mintFee,
  } = useCreateAssetContext();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  const setErrorMessages = (errors: string[]): void => {
    if (errors.length === 1) {
      setError(`Please ${errors[0]}.`);
      return;
    }

    if (errors.length === 1) {
      setError(`Please ${errors[0]}.`);
      return;
    }

    if (errors.length === 2) {
      setError(`Please ${errors[0]} and ${errors[1]}.`);
      return;
    }

    if (errors.length > 2) {
      const lastErrorIndex = errors.length - 1;
      let errorMessage = `Please ${errors[0]}`;

      for (let i = 1; i < errors.length; i++) {
        if (i === lastErrorIndex) {
          errorMessage += `, and ${errors[i]}.`;
          break;
        }
        errorMessage += `, ${errors[i]}`;
      }

      setError(errorMessage);
      return;
    }
  };

  const validateAndCreate = async () => {
    setIsLoading(true);
    setError('');

    const errors = await createNft(currentUser ? currentUser.actor : '');
    setIsLoading(false);
    if (errors.length) {
      setErrorMessages(errors);
      return;
    }

    setPageState(CREATE_PAGE_STATES.SUCCESS);
  };

  const resetTemplatePage = () => {
    setTemplateUploadedFile(null);
    setUploadedFilePreview('');
    setTemplateName('');
    setTemplateDescription('');
    setMaxSupply('');
    setMintAmount('');
    setError('');
  };

  useEffect(() => {
    if (mintAmount && !maxSupply) {
      setMintAmount('');
    }
  }, [maxSupply]);

  useEffect(() => {
    const numAssets = parseInt(mintAmount);
    const mintFees = fees.calculateCreateFlowFees({
      numAssets,
      actor: currentUser ? currentUser.actor : '',
    });
    setMintFee(mintFees);
  }, [mintAmount, currentUser, isLoading]);

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
      errorMessage = 'You can mint up to 50 assets at a time';
    }

    setIsValid(valid);
    return {
      isValid: valid,
      errorMessage,
    };
  };

  const allFieldsFilled =
    templateUploadedFile &&
    templateName &&
    templateDescription &&
    maxSupply &&
    mintAmount;

  return (
    <>
      <Step>Step 2 of 2</Step>
      <Title>Create a NFT</Title>
      <SubTitle>
        Each NFT edition follows a specific &quot;template&quot; which
        identifies the fields of the NFT. This is also saved on the chain
        itself.
      </SubTitle>
      <ElementTitle>Upload file</ElementTitle>
      <DragDropFileUploadLg
        setTemplateUploadedFile={setTemplateUploadedFile}
        templateUploadedFile={templateUploadedFile}
        setUploadedFilePreview={setUploadedFilePreview}
        uploadedFilePreview={uploadedFilePreview}
      />
      <InputField
        mt="16px"
        value={templateName}
        setValue={setTemplateName}
        placeholder="Name"
      />
      <InputField
        mt="16px"
        value={templateDescription}
        setValue={setTemplateDescription}
        placeholder="Description"
      />
      <InputField
        mt="16px"
        inputType="number"
        min={0}
        step={1}
        value={maxSupply}
        setValue={setMaxSupply}
        placeholder="Edition Size"
        tooltip="Maximum number of NFTs in this edition. Put 0 for an unlimited edition size."
        checkIfIsValid={(input) => {
          const numberInput = parseFloat(input as string);
          const isValid = !isNaN(numberInput) && numberInput >= 0;
          const errorMessage = 'Edition size must be 0 or greater.';

          return {
            isValid,
            errorMessage,
          };
        }}
        numberOfTooltipLines={3}
      />
      <InputField
        inputType="number"
        min={1}
        max={50}
        step={1}
        mt="16px"
        value={mintAmount}
        disabled={!maxSupply}
        setValue={setMintAmount}
        placeholder="Enter mint amount"
        tooltip="Choose an initial mint amount (first 10 are for free). Minting takes a bit of time, so we recommend no more than 50 tokens in your initial mint."
        numberOfTooltipLines={5}
        submit={
          !isValid || isLoading || !allFieldsFilled ? null : validateAndCreate
        }
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
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      <Button
        onClick={isLoading ? null : validateAndCreate}
        disabled={!isValid || isLoading || !allFieldsFilled}
        padding={isLoading ? '0' : '12px 0'}>
        {isLoading ? (
          <Spinner size="42px" radius="10" hasBackground />
        ) : (
          'Create NFT'
        )}
      </Button>
      <BackButton
        disabled={isLoading}
        onClick={() => {
          resetTemplatePage();
          setPageState(CREATE_PAGE_STATES.CHOOSE_COLLECTION);
        }}>
        Back
      </BackButton>
    </>
  );
};

export default CreateTemplate;
