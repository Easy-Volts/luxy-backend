import { Request } from 'express';

export const isOtpExpired = (otpGeneratedAt: Date): boolean => {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  return otpGeneratedAt < fiveMinutesAgo;
};

export const extractTokenFromHeader = (
  request: Request,
): string | undefined => {
  const authHeader = request.headers.authorization;
  if (!authHeader) return undefined;
  const [type, token] = authHeader.split(' ');
  return type === 'Bearer' ? token : undefined;
};
