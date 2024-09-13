import { type NextRequest } from 'next/server';
import db from '@/lib/db';
import { getAccount } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params: { id: idStr } }: { params: { id: string } }
) {
  const account = await getAccount();
  if (!account) {
    return Response.json({ message: 'Unauthorized!' }, { status: 401 });
  }

  const id = parseInt(idStr);
  if (!id) {
    return Response.json({ message: 'Invalid ID!' }, { status: 400 });
  }

  const item = await db
    .selectFrom('extrusions')
    .select(['id', 'createdBy'])
    .where('id', '=', id)
    .executeTakeFirst();
  if (!item) {
    return Response.json(
      { message: 'Extrusion log not found!' },
      { status: 404 }
    );
  }
  if (account.role !== 'admin' && item.createdBy !== account.id) {
    return Response.json({ message: 'Unauthorized!' }, { status: 401 });
  }

  const result = await db
    .deleteFrom('extrusions')
    .where('id', '=', item.id)
    .executeTakeFirst();
  if (!result.numDeletedRows) {
    return Response.json({ message: 'Delete failed!' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
