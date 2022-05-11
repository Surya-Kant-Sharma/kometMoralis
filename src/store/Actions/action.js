export const ADDRESS = 'ADDRESS';
export const BALANCE = 'BALANCE';
export const PROVIDER = 'PROVIDER';

export const getAddress = address => {
  return {
    type: ADDRESS,
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
