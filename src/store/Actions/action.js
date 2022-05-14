export const ADDRESS = 'ADDRESS';
export const EOABALANCE = 'EOABALANCE';
export const VAULTBALANCE = 'VAULTBALANCE';
export const PROVIDER = 'PROVIDER';
export const OTHERWALLET = 'OTHERWALLET';
export const WALLETS='WALLETS'

export const setAddress = address => {
  return {
    type: ADDRESS,
    payload: address,
  };
};
export const setEoaBalance = balance => {
  return {
    type: EOABALANCE,
    payload: balance,
  };
};
export const setVaultBalance = balance => {
  return {
    type: VAULTBALANCE,
    payload: balance,
  };
};
export const setProvider = provider => {
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
export const getWallets = address => {
  return {
    type: WALLETS,
    payload: address,
  };
};