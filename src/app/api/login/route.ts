import { type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { SignJWT } from 'jose';
import type { AuthData } from '@/lib/types';

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

export async function POST(request: NextRequest) {
  const body = await request.json();
  const username = body?.username;
  const password = body?.password;

  if (!username) {
    return Response.json({ message: 'Username is required!' }, { status: 400 });
  }
  if (!password) {
    return Response.json({ message: 'Password is required!' }, { status: 400 });
  }

  try {
    const [account] = await db
      .selectFrom('accounts')
      .selectAll()
      .where('username', '=', username)
      .where('password', '=', password)
      .execute();
    if (!account) {
      return Response.json(
        { message: 'Incorrect username or password!' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    await db
      .updateTable('accounts')
      .set({
        lastLogin: timestamp,
      })
      .where('id', '=', account.id)
      .execute();

    const authData: AuthData = { accountId: account.id, timestamp };
    const token = await new SignJWT(authData)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(jwtSecret);
    if (!token) {
      return Response.json(
        { message: 'Failed to generate the authentication token' },
        { status: 500 }
      );
    }

    cookies().set('auth_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json(
      { message: err?.message, error: err },
      { status: 401 }
    );
  }
}
