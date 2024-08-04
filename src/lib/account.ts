import { cookies } from 'next/headers';
import { Accounts } from 'kysely-codegen';
import { Selectable } from 'kysely';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import type { AuthData } from './types';
import db from './db';

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

export async function getAccount() {
  // Check if JWT token is passed
  const jwtToken = cookies().get('auth_token')?.value;
  if (!jwtToken) {
    return null;
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
    return null;
  }

  // Check if authData is valid
  const isAuthDataValid =
    typeof authData?.accountId === 'number' &&
    typeof authData?.timestamp === 'number';
  if (!isAuthDataValid) {
    return null;
  }

  // Check if account ID exists and the session is active
  const account: Account | undefined = await db
    .selectFrom('accounts')
    .select(['id', 'username', 'role', 'lastLogin'])
    .where('id', '=', authData.accountId)
    .executeTakeFirst();
  if (
    !account ||
    account.lastLogin?.toString() !== authData.timestamp.toString()
  ) {
    return null;
  }

  return account;
}

export async function protectPage() {
  const account = await getAccount();
  if (!account) {
    redirect('/login');
  }
  return account;
}

export type Account = Pick<
  Selectable<Accounts>,
  'id' | 'username' | 'role' | 'lastLogin'
>;
