import jwt from 'jsonwebtoken';

const SECRET = process.env.NEXTAUTH_SECRET;

if (!SECRET) {
  throw new Error('NEXTAUTH_SECRET missing - VELRYA AI');
}

export function generateToken(userId: string, email: string) {
  return jwt.sign(
    { userId, email, app: 'VELRYA AI' },
    SECRET as string,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET as string);
  } catch {
    return null;
  }
}
