import { type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

const jwtSecret = process.env.JWT_SECRET || 'secret';

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

    const token = jwt.sign({ account, timestamp: Date.now() }, jwtSecret);
    cookies().set('jwt', token, {
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
