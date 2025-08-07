export interface JwtPayload {
  sub: string;
  userId: number;
  username: string;
  role: string;
  appID?: string;
  iat?: number;
  exp?: number;
}
