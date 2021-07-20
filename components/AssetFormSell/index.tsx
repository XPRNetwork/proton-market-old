import { Dispatch, SetStateAction } from 'react';
import Button from '../Button';
import ReadMoreDescription from '../ReadMoreDescription';
import {
  DropdownMenu,
  General,
  Amount,
  DisabledInput,
  Row,
} from '../AssetFormBuy/AssetFormBuy.styled';
import { Asset } from '../../services/assets';

type Props = {
  description: string;
  dropdownAssets: Asset[];
  lowestPrice: string;
  maxSupply: string;
  buttonText: string;
  assetId: string;
  isRefetchingAssets: boolean;
  handleButtonClick: () => void;
  setCurrentAsset: Dispatch<SetStateAction<Asset>>;
};

export const AssetFormSell = ({
  description,
  dropdownAssets,
  lowestPrice,
  maxSupply,
  buttonText,
  assetId,
  isRefetchingAssets,
  handleButtonClick,
  setCurrentAsset,
}: Props): JSX.Element => {
  const handleDropdownSelect = (id: string) => {
    const dropdownAsset = dropdownAssets.find((asset) => {
      return asset.asset_id === id;
    });
    setCurrentAsset(dropdownAsset);
  };

  const getDropdown = () => {
    if (isRefetchingAssets && !dropdownAssets.length) {
      return (
        <DisabledInput placeholder="Preparing newly minted NFTs..." disabled />
      );
    } else if (!dropdownAssets.length) {
      return <DisabledInput placeholder="No assets" disabled />;
    } else {
      return (
        <DropdownMenu
          name="Available Assets For Sale"
          value={assetId}
          onChange={(e) => handleDropdownSelect(e.target.value)}>
          <option key="blank" value="" disabled>
            - - Select a serial number - -
          </option>
          {dropdownAssets.length > 0 &&
            dropdownAssets.map(({ asset_id, template_mint, salePrice }) => (
              <option key={template_mint} value={asset_id}>
                #{template_mint} - {salePrice || 'Not for sale'}
              </option>
            ))}
          {isRefetchingAssets ? (
            <option key="blank" value="" disabled>
              Loading new NFTs...
            </option>
          ) : null}
        </DropdownMenu>
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
      <General>Serial number</General>
      {getDropdown()}
      <Button
        cancel={buttonText.toLowerCase().includes('cancel')}
        fullWidth
        disabled={!assetId}
        onClick={handleButtonClick}>
        {buttonText}
      </Button>
    </>
  );
};

export default AssetFormSell;
