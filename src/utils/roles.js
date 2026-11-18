// Espelha o enum UserType do auth-api: Admin = vendedor, Common = comprador.
export const USER_TYPES = {
  SELLER: 'Admin',
  BUYER: 'Common',
};

export const isSeller = (user) => user?.type === USER_TYPES.SELLER;
export const isBuyer = (user) => user?.type === USER_TYPES.BUYER;