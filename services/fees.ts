import proton from '../services/proton-rpc';
import {
  PRICE_OF_RAM_IN_XPR,
  SHORTENED_TOKEN_PRECISION,
  RAM_AMOUNTS,
} from '../utils/constants';

export type ListingFee = {
  display: string;
  raw: number;
};

export type MintFee = {
  specialMintFee: ListingFee;
  accountRamFee: ListingFee;
  userSpecialMintContractRam: number;
  userAccountRam: number;
  totalFee: string;
};

class Fees {
  conversionRate: number;
  currentAccountRam: number;
  specialMintContractRam: number;

  constructor() {}

  refreshRamInfoForUser = async (actor) => {
    const { max, used } = await proton.getAccountRam(actor);
    this.conversionRate = await proton.getXPRtoXUSDCConversionRate();
    this.currentAccountRam = max - used;
    this.specialMintContractRam = await proton.getSpecialMintContractRam(actor);
  };

  parseDisplayRawFee = (
    requiredRam: number,
    conversionRate: number
  ): ListingFee => {
    const calculatedFee = PRICE_OF_RAM_IN_XPR * requiredRam * conversionRate;
    const fee = isNaN(calculatedFee) ? 0 : Math.ceil(calculatedFee * 100) / 100;
    return {
      display: fee.toFixed(SHORTENED_TOKEN_PRECISION).toString(),
      raw: fee,
    };
  };

  calculateFee = ({
    numAssets,
    actor,
    ramCost,
  }: {
    numAssets: number;
    actor: string;
    ramCost: number;
  }): ListingFee => {
    if (actor && Number(numAssets) > 0) {
      const requiredRam = numAssets * ramCost - this.currentAccountRam;
      if (requiredRam > 0) {
        return this.parseDisplayRawFee(requiredRam, this.conversionRate);
      }
    }
    return {
      display: Number('0').toFixed(SHORTENED_TOKEN_PRECISION).toString(),
      raw: 0,
    };
  };

  calculateCreateFlowFees = ({
    numAssets,
    actor,
  }: {
    numAssets: number;
    actor: string;
  }): MintFee => {
    const createFlowFee = {
      specialMintFee: {
        display: Number('0').toFixed(SHORTENED_TOKEN_PRECISION).toString(),
        raw: 0,
      },
      accountRamFee: {
        display: Number('0').toFixed(SHORTENED_TOKEN_PRECISION).toString(),
        raw: 0,
      },
      userSpecialMintContractRam: 0,
      userAccountRam: 0,
      totalFee: Number('0').toFixed(SHORTENED_TOKEN_PRECISION).toString(),
    };

    if (actor && Number(numAssets) > 0) {
      const accountRamCosts =
        RAM_AMOUNTS.CREATE_COLLECTION_SCHEMA_TEMPLATE +
        RAM_AMOUNTS.LIST_SALE * numAssets;

      const requiredAccountRam = accountRamCosts - this.currentAccountRam;

      if (requiredAccountRam > 0) {
        createFlowFee.accountRamFee = this.parseDisplayRawFee(
          requiredAccountRam,
          this.conversionRate
        );
      }

      const currentContractRamAmount =
        this.specialMintContractRam === -1
          ? RAM_AMOUNTS.FREE_INITIAL_SPECIAL_MINT_CONTRACT_RAM
          : this.specialMintContractRam;

      const contractRamCosts = RAM_AMOUNTS.MINT_ASSET * numAssets;

      const requiredContractRam = contractRamCosts - currentContractRamAmount;

      if (requiredContractRam > 0) {
        createFlowFee.specialMintFee = this.parseDisplayRawFee(
          requiredContractRam,
          this.conversionRate
        );
      }

      const total =
        createFlowFee.specialMintFee.raw + createFlowFee.accountRamFee.raw;
      createFlowFee.totalFee = Number(total)
        .toFixed(SHORTENED_TOKEN_PRECISION)
        .toString();

      createFlowFee.userSpecialMintContractRam = this.specialMintContractRam;
      createFlowFee.userAccountRam = this.currentAccountRam;
    }
    return createFlowFee;
  };
}

const fees = new Fees();
export default fees;
