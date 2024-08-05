import { cookies } from 'next/headers';
import { getAccount } from '@/lib/auth';
import db from '@/lib/db';

export async function POST() {
  const account = await getAccount();
  if (account) {
    await db
      .deleteFrom('sessions')
      .where('id', '=', account?.sessionId)
      .execute();
  }
  cookies().delete('auth_token');
  return Response.json({ ok: true });
}
