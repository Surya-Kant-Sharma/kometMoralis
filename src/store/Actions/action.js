export const ADDRESS = 'ADDRESS';
export const BALANCE = 'BALANCE';
export const PROVIDER = 'PROVIDER';
export const OTHERWALLET = 'OTHERWALLET';
export const WALLETS='WALLETS'

export const getAddress = address => {
  return {
    type: ADDRESS,
    payload: address,
  };
};
export const getWallets = address => {
  return {
    type: WALLETS,
    payload: address,
  };
};
export const getBalance = balance => {
  return {
    type: BALANCE,
    payload: balance,
  };
};
export const getProvider = provider => {
  return {
    type: PROVIDER,
    payload: provider,
  };
};
export const getOtherWalletAddress = address => {
  return {
    type: OTHERWALLET,
    payload: address,
  };
};
