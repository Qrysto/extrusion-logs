import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { AuthData } from '@/lib/types';
import { jwtVerify } from 'jose';
import db from '@/lib/db';

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const {
    nextUrl: { pathname },
  } = request;
  const rejectAuthorization = () => {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  };

  // Check if JWT token is passed
  const jwtToken = request.cookies.get('auth_token')?.value;
  if (!jwtToken) {
    return rejectAuthorization();
  }

  // Try to decode the token
  let authData: AuthData | null = null;
  try {
    const result = await jwtVerify(jwtToken, jwtSecret, {
      algorithms: ['HS256'],
    });
    authData = result.payload as AuthData;
  } catch (err) {
    console.error(err);
    return rejectAuthorization();
  }

  // Check if authData is valid
  const isAuthDataValid =
    typeof authData?.accountId === 'number' &&
    typeof authData?.timestamp === 'number';
  if (!isAuthDataValid) {
    return rejectAuthorization();
  }

  // Check if account ID exists and the session is active
  const account = await db
    .selectFrom('accounts')
    .select(['id', 'username', 'role', 'lastLogin'])
    .where('id', '=', authData.accountId)
    .executeTakeFirst();
  if (!account || account.lastLogin !== authData.timestamp.toString()) {
    return rejectAuthorization();
  }

  // Pass account info
  request.headers.set('AEL-Account', JSON.stringify(account));

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!login|api/login|_next/static|_next/image|favicon.ico).*)'],
};
