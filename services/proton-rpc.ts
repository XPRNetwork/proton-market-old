import { JsonRpc } from '@proton/js';
import { formatPrice } from '../utils';
import {
  TOKEN_SYMBOL,
  TOKEN_CONTRACT,
  EMPTY_BALANCE,
} from '../utils/constants';

type User = {
  actor: string;
  avatar: string;
  name: string;
};

class ProtonJs {
  rpc: JsonRpc = null;

  constructor() {
    const endpoints = process.env.NEXT_PUBLIC_CHAIN_ENDPOINTS.split(', ');
    this.rpc = new JsonRpc(endpoints);
  }

  getAccountBalance = async (account): Promise<string> => {
    const balance = await this.rpc.get_currency_balance(
      TOKEN_CONTRACT,
      account,
      TOKEN_SYMBOL
    );
    const price = balance.length ? balance[0] : `${0} ${TOKEN_SYMBOL}`;
    return formatPrice(price);
  };

  getUserByChainAccount = async ({ account }): Promise<User> => {
    const { rows } = await this.rpc.get_table_rows({
      scope: 'eosio.proton',
      code: 'eosio.proton',
      json: true,
      table: 'usersinfo',
      lower_bound: account,
      upper_bound: account,
    });

    return !rows.length ? '' : rows[0];
  };

  getProfileImage = async ({ account }): Promise<string> => {
    const user = await this.getUserByChainAccount({ account });
    return user.avatar;
  };

  getAtomicMarketBalance = async (chainAccount: string): Promise<string> => {
    try {
      const res = await this.rpc.get_table_rows({
        json: true,
        code: 'atomicmarket',
        scope: 'atomicmarket',
        table: 'balances',
        lower_bound: chainAccount,
        limit: 1,
        reverse: false,
        show_payer: false,
      });

      if (!res.rows.length) {
        throw new Error('No balances found for Atomic Market.');
      }

      const [balance] = res.rows;
      if (
        !balance ||
        balance.owner !== chainAccount ||
        !balance.quantities.length
      ) {
        throw new Error(
          `No Atomic Market balances found for chain account: ${chainAccount}.`
        );
      }

      const [amount] = balance.quantities;
      return amount;
    } catch (err) {
      return EMPTY_BALANCE;
    }
  };

  getAccountRam = async (
    account_name: string
  ): Promise<{
    used: number;
    max: number;
    percent: number;
  }> => {
    try {
      const account = await this.rpc.get_account(account_name);

      if (!account || !account.ram_quota) {
        throw new Error('Unable to find account.');
      }

      return {
        used: account.ram_usage,
        max: account.ram_quota,
        percent: (account.ram_usage / account.ram_quota) * 100,
      };
    } catch (err) {
      console.warn(err);
      return {
        used: 0,
        max: 0,
        percent: 0,
      };
    }
  };

  getSpecialMintContractRam = async (chainAccount: string): Promise<number> => {
    try {
      const res = await this.rpc.get_table_rows({
        json: true,
        code: 'specialmint',
        scope: 'specialmint',
        table: 'resources',
        lower_bound: chainAccount,
        limit: 1,
      });

      const contractRamDataByUser = res.rows;
      if (
        !contractRamDataByUser.length ||
        contractRamDataByUser[0].account !== chainAccount
      ) {
        throw new Error(`No initial storage found for ${chainAccount}.`);
      }

      return contractRamDataByUser[0].ram_bytes;
    } catch (err) {
      console.warn(err);
      return -1;
    }
  };

  getXPRtoXUSDCConversionRate = async (): Promise<number> => {
    try {
      const res = await this.rpc.get_table_rows({
        json: true,
        code: 'proton.swaps',
        scope: 'proton.swaps',
        table: 'pools',
      });

      const conversion = res.rows.filter(
        ({ lt_symbol }) => lt_symbol === '8,XPRUSDC'
      )[0];

      if (!conversion) {
        throw new Error('Conversion rate not found.');
      }

      const { pool1, pool2 } = conversion;
      const xpr = parseFloat(pool1.quantity.split(' ')[0]);
      const xusdc = parseFloat(pool2.quantity.split(' ')[0]);
      return (xusdc / xpr) * 1.1; // Multiplied by 1.1 to add a 10% buffer
    } catch (err) {
      console.warn(err);
      return 0;
    }
  };
}

const proton = new ProtonJs();
export default proton;
