export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  name: string;
  appID?: string;
  userId: number;
  iat?: number;
  exp?: number;
}
