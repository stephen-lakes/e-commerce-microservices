import BlacklistedToken from "../models/blackedlistedToken.model";
import RefreshToken from "../models/refreshToken.model";

export default class TokenService {
  /**
   * Blacklist a token (usually an access token) until it expires
   */
  public async blacklistToken(token: string, expiresAt: Date): Promise<void> {
    await BlacklistedToken.create({ token, expiresAt });
  }

  /**
   * Store a refresh token - whitelist
   */
  public async storeRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    await RefreshToken.create({ userId, token, expiresAt });
  }

  /**
   * Remove a refresh token from the whitelist - invalidate
   */
  public async invalidateRefreshToken(token: string): Promise<void> {
    await RefreshToken.deleteOne({ token });
  }

  /**
   * Check if a token is blacklisted
   */
  public async isTokenBlacklisted(token: string): Promise<boolean> {
    const record = await BlacklistedToken.findOne({ token });
    return !!record;
  }

  /**
   * Optional: Check if a refresh token is still valid
   */
  public async isRefreshTokenValid(token: string): Promise<boolean> {
    const record = await RefreshToken.findOne({ token });
    return !!record;
  }
}
