import { type NextRequest } from 'next/server';
import { sql } from 'kysely';
import db from '@/lib/db';
import { getAccount } from '@/lib/auth';
import { dummyTranslate as __ } from '@/lib/intl/server';

export async function DELETE(
  request: NextRequest,
  { params: { id: idStr } }: { params: { id: string } }
) {
  const account = await getAccount();
  if (!account) {
    return Response.json({ message: __('Unauthorized!') }, { status: 401 });
  }

  const id = parseInt(idStr);
  const log = await db
    .selectFrom('extrusions')
    .select(['id', 'createdBy'])
    .where('id', '=', id)
    .executeTakeFirst();
  if (!log) {
    return Response.json(
      { message: __('Extrusion log not found!') },
      { status: 404 }
    );
  }
  if (account.role !== 'super_admin' && log.createdBy !== account.id) {
    return Response.json({ message: __('Unauthorized!') }, { status: 401 });
  }

  // const result = await db
  //   .deleteFrom('extrusions')
  //   .where('id', '=', log.id)
  //   .executeTakeFirst();
  const result = await db
    .updateTable('extrusions')
    .where('id', '=', log.id)
    .set({ deleted: true, lastEdited: sql`DEFAULT` })
    .executeTakeFirst();
  if (!result.numUpdatedRows) {
    return Response.json({ message: __('Delete failed!') }, { status: 500 });
  }

  return Response.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
  { params: { id: idStr } }: { params: { id: string } }
) {
  const account = await getAccount();
  if (!account) {
    return Response.json({ message: __('Unauthorized!') }, { status: 401 });
  }

  const id = parseInt(idStr);
  const log = await db
    .selectFrom('extrusions')
    .select(['id', 'createdBy'])
    .where('id', '=', id)
    .executeTakeFirst();
  if (!log) {
    return Response.json(
      { message: __('Extrusion log not found!') },
      { status: 404 }
    );
  }
  if (account.role !== 'super_admin' && log.createdBy !== account.id) {
    return Response.json({ message: __('Unauthorized!') }, { status: 401 });
  }

  const body = await request.json();
  const {
    customer,
    dieCode,
    item,
    lotNumberCode,
    billetType,
    code,
    coolingMethod,
  } = body || {};

  const [
    // existingCustomer,
    existingDie,
    // existingItem,
    existingLotNo,
    existingBilletType,
    // existingCode,
    existingCoolingMethod,
  ] = await Promise.all([
    // customer
    //   ? db
    //       .selectFrom('customers')
    //       .selectAll()
    //       .where('name', '=', customer)
    //       .executeTakeFirst()
    //   : Promise.resolve(),
    dieCode
      ? db
          .selectFrom('dies')
          .selectAll()
          .where('code', '=', dieCode)
          .executeTakeFirst()
      : Promise.resolve(),
    // item
    //   ? db
    //       .selectFrom('items')
    //       .selectAll()
    //       .where('item', '=', item)
    //       .executeTakeFirst()
    //   : Promise.resolve(),
    lotNumberCode
      ? db
          .selectFrom('lotNumbers')
          .selectAll()
          .where('code', '=', lotNumberCode)
          .executeTakeFirst()
      : Promise.resolve(),
    billetType
      ? db
          .selectFrom('billetTypes')
          .selectAll()
          .where('name', '=', billetType)
          .executeTakeFirst()
      : Promise.resolve(),
    // code
    //   ? db
    //       .selectFrom('codes')
    //       .selectAll()
    //       .where('code', '=', code)
    //       .executeTakeFirst()
    //   : Promise.resolve(),
    coolingMethod
      ? db
          .selectFrom('coolingMethods')
          .selectAll()
          .where('code', '=', coolingMethod)
          .executeTakeFirst()
      : Promise.resolve(),
  ]);

  try {
    await Promise.all([
      // customer && !existingCustomer
      //   ? db
      //       .insertInto('customers')
      //       .values({ name: customer })
      //       .executeTakeFirstOrThrow()
      //   : Promise.resolve(),
      dieCode && !existingDie
        ? db
            .insertInto('dies')
            .values({ code: dieCode })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
      // item && !existingItem
      //   ? db
      //       .insertInto('items')
      //       .values({ item: item })
      //       .executeTakeFirstOrThrow()
      //   : Promise.resolve(),
      lotNumberCode && !existingLotNo
        ? db
            .insertInto('lotNumbers')
            .values({ code: lotNumberCode })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
      billetType && !existingBilletType
        ? db
            .insertInto('billetTypes')
            .values({ name: billetType })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
      // code && !existingCode
      //   ? db
      //       .insertInto('codes')
      //       .values({ code: code })
      //       .executeTakeFirstOrThrow()
      //   : Promise.resolve(),
      coolingMethod && !existingCoolingMethod
        ? db
            .insertInto('coolingMethods')
            .values({ code: coolingMethod })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
    ]);
  } catch (err: any) {
    console.error('Error when preparing reference tables', err);
    return Response.json({ message: err?.message }, { status: 500 });
  }

  try {
    await db
      .updateTable('extrusions')
      .where('id', '=', log.id)
      .set({ ...body, lastEdited: sql`DEFAULT` })
      .execute();

    return Response.json({ ok: true });
  } catch (err: any) {
    console.error('Error when updating extrusion', err);
    return Response.json({ message: err?.message }, { status: 500 });
  }
}
