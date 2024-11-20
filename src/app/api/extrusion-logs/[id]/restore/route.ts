import { type NextRequest } from 'next/server';
import db from '@/lib/db';
import { sql } from 'kysely';
import { getAccount } from '@/lib/auth';
import { dummyTranslate as __ } from '@/lib/intl/server';

export async function POST(
  request: NextRequest,
  { params: { id: idStr } }: { params: { id: string } }
) {
  const account = await getAccount();
  if (!account || account.role !== 'super_admin') {
    return Response.json({ message: __('Unauthorized!') }, { status: 401 });
  }

  const id = parseInt(idStr);
  const log = await db
    .selectFrom('extrusions')
    .select(['id'])
    .where('id', '=', id)
    .executeTakeFirst();
  if (!log) {
    return Response.json(
      { message: __('Extrusion log not found!') },
      { status: 404 }
    );
  }

  const result = await db
    .updateTable('extrusions')
    .where('id', '=', log.id)
    .set({ deleted: false, lastEdited: sql`DEFAULT` })
    .executeTakeFirst();
  if (!result.numUpdatedRows) {
    return Response.json(
      { message: __('Restoration failed!') },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
