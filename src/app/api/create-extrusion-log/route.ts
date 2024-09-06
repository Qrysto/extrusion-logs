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
    db
      .selectFrom('customers')
      .selectAll()
      .where('name', '=', customer)
      .executeTakeFirst(),
    db
      .selectFrom('dies')
      .selectAll()
      .where('code', '=', dieCode)
      .executeTakeFirst(),
    db
      .selectFrom('items')
      .selectAll()
      .where('item', '=', item)
      .executeTakeFirst(),
    db
      .selectFrom('lotNumbers')
      .selectAll()
      .where('code', '=', lotNumberCode)
      .executeTakeFirst(),
    db
      .selectFrom('billetTypes')
      .selectAll()
      .where('name', '=', billetType)
      .executeTakeFirst(),
    db
      .selectFrom('codes')
      .selectAll()
      .where('code', '=', code)
      .executeTakeFirst(),
  ]);

  try {
    await Promise.all([
      !existingCustomer
        ? db
            .insertInto('customers')
            .values({ name: customer })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
      !existingDie
        ? db
            .insertInto('dies')
            .values({ code: dieCode })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
      !existingItem
        ? db
            .insertInto('items')
            .values({ item: item })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
      !existingLotNo
        ? db
            .insertInto('lotNumbers')
            .values({ code: lotNumberCode })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
      !existingBilletType
        ? db
            .insertInto('billetTypes')
            .values({ name: billetType })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
      !existingCode
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
