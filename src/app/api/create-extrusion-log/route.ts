import { type NextRequest } from 'next/server';
import db from '@/lib/db';
import { getAccount } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const account = await getAccount();
  if (!account) {
    return Response.json({ message: 'Unauthorized!' }, { status: 401 });
  }

  const body = await request.json();
  const {
    billetKgpm,
    billetLength,
    billetQuantity,
    billetTemp,
    billetType,
    billetWeight,
    buttWeight,
    cavity,
    code,
    customer,
    date,
    dieCode,
    dieNumber,
    employeeId,
    endTime,
    ingotRatio,
    item,
    lotNumberCode,
    ngPercentage,
    ngQuantity,
    ngWeight,
    ok,
    orderLength,
    outputRate,
    outputTemp,
    productionQuantity,
    productionWeight,
    productKgpm,
    ramSpeed,
    remark,
    shift,
    startTime,
    outputYield,
  } = body || {};

  console.log('body', body);

  const extrusionLogValues = {
    billetKgpm,
    billetLength,
    billetQuantity,
    billetTemp,
    billetType,
    billetWeight,
    buttWeight,
    cavity,
    code,
    customer,
    date,
    dieCode,
    dieNumber,
    employeeId,
    endTime,
    ingotRatio,
    item,
    lotNumberCode,
    ngPercentage,
    ngQuantity,
    ngWeight,
    ok,
    orderLength,
    outputRate,
    outputTemp,
    productionQuantity,
    productionWeight,
    productKgpm,
    ramSpeed,
    remark,
    shift,
    startTime,
    outputYield,
    createdBy: account.id,
  };

  const [
    existingCustomer,
    existingDie,
    existingItem,
    existingLotNo,
    existingBilletType,
    existingCode,
  ] = await Promise.all([
    customer
      ? db
          .selectFrom('customers')
          .selectAll()
          .where('name', '=', customer)
          .executeTakeFirst()
      : Promise.resolve(),
    dieCode
      ? db
          .selectFrom('dies')
          .selectAll()
          .where('code', '=', dieCode)
          .executeTakeFirst()
      : Promise.resolve(),
    item
      ? db
          .selectFrom('items')
          .selectAll()
          .where('item', '=', item)
          .executeTakeFirst()
      : Promise.resolve(),
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
    code
      ? db
          .selectFrom('codes')
          .selectAll()
          .where('code', '=', code)
          .executeTakeFirst()
      : Promise.resolve(),
  ]);

  try {
    await Promise.all([
      customer && !existingCustomer
        ? db
            .insertInto('customers')
            .values({ name: customer })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
      dieCode && !existingDie
        ? db
            .insertInto('dies')
            .values({ code: dieCode })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
      item && !existingItem
        ? db
            .insertInto('items')
            .values({ item: item })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
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
      code && !existingCode
        ? db
            .insertInto('codes')
            .values({ code: code })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
    ]);
  } catch (err: any) {
    console.error('Error when preparing reference tables', err);
    return Response.json({ message: err?.message }, { status: 500 });
  }

  try {
    await db
      .insertInto('extrusions')
      .values(extrusionLogValues)
      .executeTakeFirst();

    return Response.json({ ok: true });
  } catch (err: any) {
    console.error('Error when inserting extrusion', err);
    return Response.json({ message: err?.message }, { status: 500 });
  }
}
