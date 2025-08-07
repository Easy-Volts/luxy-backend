export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  appID?: string;
  ROLE?: string;
  iat?: number;
  exp?: number;
}
