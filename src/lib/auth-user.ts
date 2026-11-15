import prisma from '@/lib/prisma';
import { AuthUser, isAdminRole, verifyTokenFromRequest } from '@/lib/auth';

/**
 * Verify both the signed JWT and the caller's live database record + tokenVersion
 * so revoked/logged-out, demoted, password-reset, or deleted tokens fail immediately.
 */
export async function verifyLiveAdminUser(request: Request): Promise<AuthUser | null> {
  const decoded = verifyTokenFromRequest(request);
  if (!decoded) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true, tokenVersion: true },
  });

  if (!user || !isAdminRole(user.role) || user.tokenVersion !== decoded.tokenVersion) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };
}
