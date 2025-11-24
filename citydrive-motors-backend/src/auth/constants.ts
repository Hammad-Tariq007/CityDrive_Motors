// src/auth/constants.ts
export const jwtConstants = {
  secret: 'SUPER-SECRET-KEY-FOR-CITYDRIVE-CHANGE-LATER',
  expiresIn: '24h' as const, // ← this fixes the type error forever
};
