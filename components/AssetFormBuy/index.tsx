import { Dispatch, SetStateAction, useEffect } from 'react';
import Button from '../Button';
import ReadMoreDescription from '../ReadMoreDescription';
import { useAuthContext } from '../Provider';
import {
  ErrorMessage,
  DropdownMenu,
  General,
  Amount,
  Row,
} from './AssetFormBuy.styled';
import { SaleAsset } from '../../services/sales';

type Props = {
  description: string;
  dropdownAssets: SaleAsset[];
  lowestPrice: string;
  maxSupply: string;
  buttonText: string;
  saleId: string;
  purchasingError: string;
  formattedPricesBySaleId: {
    [templateMint: string]: string;
  };
  isBalanceInsufficient: boolean;
  handleButtonClick: () => void;
  setPurchasingError: Dispatch<SetStateAction<string>>;
  setIsBalanceInsufficient: Dispatch<SetStateAction<boolean>>;
  setSaleId: Dispatch<SetStateAction<string>>;
  setCurrentAsset: Dispatch<SetStateAction<SaleAsset>>;
};

export const AssetFormBuy = ({
  description,
  dropdownAssets,
  lowestPrice,
  maxSupply,
  buttonText,
  saleId,
  purchasingError,
  formattedPricesBySaleId,
  isBalanceInsufficient,
  handleButtonClick,
  setPurchasingError,
  setIsBalanceInsufficient,
  setSaleId,
  setCurrentAsset,
}: Props): JSX.Element => {
  const { currentUser, currentUserBalance } = useAuthContext();

  useEffect(() => {
    dropdownAssets.forEach((asset) => {
      if (asset.salePrice === lowestPrice) {
        handleDropdownSelect(asset.saleId);
      }
    });
  }, [dropdownAssets, lowestPrice]);

  const balanceAmount = parseFloat(
    currentUserBalance.split(' ')[0].replace(/[,]/g, '')
  );

  const handleDropdownSelect = (id: string) => {
    const priceString = formattedPricesBySaleId[id];
    const amount = parseFloat(priceString.split(' ')[0].replace(/[,]/g, ''));
    setPurchasingError('');
    setIsBalanceInsufficient(false);
    setSaleId(id);
    setCurrentAsset(dropdownAssets.find((asset) => asset.saleId === id));

    if (!currentUser) {
      setPurchasingError('You must log in to purchase an asset.');
    }

    if (amount > balanceAmount) {
      setIsBalanceInsufficient(true);
      setPurchasingError(
        `Insufficient funds: this NFT is listed for ${priceString} and your account balance is ${currentUserBalance}. Please add more funds to continue this transaction.`
      );
    }
  };

  return (
    <>
      {description ? <ReadMoreDescription description={description} /> : ''}
      <Row>
        <General>Lowest Market Price</General>
        <General>Edition Size</General>
      </Row>
      <Row>
        <Amount>{lowestPrice || 'None'}</Amount>
        <Amount>{maxSupply === '0' ? 'Unlimited' : maxSupply}</Amount>
      </Row>
      <DropdownMenu
        name="Available Assets For Sale"
        value={saleId}
        onChange={(e) => handleDropdownSelect(e.target.value)}>
        <option key="blank" value="" disabled>
          - - Select a serial number - -
        </option>
        {dropdownAssets.length > 0 &&
          dropdownAssets.map(({ saleId, templateMint, salePrice }) => (
            <option key={templateMint} value={saleId}>
              #{templateMint} - {salePrice}
            </option>
          ))}
      </DropdownMenu>
      <Button
        fullWidth
        onClick={handleButtonClick}
        disabled={isBalanceInsufficient}>
        {buttonText}
      </Button>
      {purchasingError ? <ErrorMessage>{purchasingError}</ErrorMessage> : null}
    </>
  );
};

export default AssetFormBuy;
