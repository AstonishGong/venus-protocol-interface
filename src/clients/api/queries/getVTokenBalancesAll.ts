import { Contract } from 'web3-eth-contract';

export interface IGetVTokenBalancesAllInput {
  venusLensContract: Contract; // @TODO: use contract type (through Typechain?)
  account: string | undefined | null;
  vtAddresses: string[];
}

interface IGetVTokenBalancesAllResponse extends Array<string> {
  balanceOf: string;
  balanceOfUnderlying: string;
  borrowBalanceCurrent: string;
  tokenAllowance: string;
  tokenBalance: string;
  vToken: string;
}

export interface IGetVTokenBalancesAllOutput {
  balanceOf: string;
  balanceOfUnderlying: string;
  borrowBalanceCurrent: string;
  tokenAllowance: string;
  tokenBalance: string;
  vToken: string;
}

const getVTokenBalancesAll = async ({
  venusLensContract,
  vtAddresses,
  account,
}: IGetVTokenBalancesAllInput) => {
  let response = await venusLensContract.methods
    .vTokenBalancesAll(vtAddresses, account?.toLowerCase())
    .call();
  // This is original returned as an array with these properties
  // but at some point the properties are getting lost
  response = response.map((item: IGetVTokenBalancesAllResponse) => ({
    balanceOf: item.balanceOf,
    balanceOfUnderlying: item.balanceOfUnderlying,
    borrowBalanceCurrent: item.borrowBalanceCurrent,
    tokenAllowance: item.tokenAllowance,
    tokenBalance: item.tokenBalance,
    vToken: item.vToken,
  }));
  return response;
};

export default getVTokenBalancesAll;
