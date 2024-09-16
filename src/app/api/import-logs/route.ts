import { type NextRequest } from 'next/server';
import db from '@/lib/db';
import { parse } from 'csv-parse/sync';
import { format } from 'date-fns';
import { readFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  if (process.env.LOCAL !== 'true') {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const content = await readFile('imports/sample1.csv');
  const rawData: any[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
  });
  // .slice(13);

  const logs = rawData.map(
    ({
      item,
      shift,
      plant,
      date,
      machine,
      inch,
      customer,
      dieCode,
      dieNumber,
      cavity,
      productKgpm,
      billetType,
      lotNumberCode,
      ingotRatio,
      billetKgpm,
      billetLength,
      billetQuantity,
      billetWeight,
      orderLength,
      ramSpeed,
      billetTemp,
      outputTemp,
      productionQuantity,
      productionWeight,
      outputYield,
      ok,
      remark,
      startTime,
      endTime,
      outputRate,
      ngQuantity,
      ngWeight,
      ngPercentage,
      code,
      buttWeight,
    }) => ({
      item,
      shift: shift?.toLowerCase(),
      plant,
      date: toDate(date),
      machine,
      inch,
      customer: customer || null,
      dieCode: dieCode || null,
      dieNumber: toNumber(dieNumber),
      cavity: toNumber(cavity),
      productKgpm: toNumber(productKgpm),
      billetType: billetType || null,
      lotNumberCode: lotNumberCode || null,
      ingotRatio: toNumber(ingotRatio),
      billetKgpm: toNumber(billetKgpm),
      billetLength: toNumber(billetLength),
      billetQuantity: toNumber(billetQuantity),
      billetWeight: toNumber(billetWeight),
      orderLength: toNumber(orderLength),
      ramSpeed: toNumber(ramSpeed),
      billetTemp: toNumber(billetTemp),
      outputTemp: toNumber(outputTemp),
      productionQuantity: toNumber(productionQuantity),
      productionWeight: toNumber(productionWeight),
      outputYield: toNumber(outputYield),
      ok: ok !== 'NG',
      remark,
      startTime: toTime(startTime),
      endTime: toTime(endTime),
      outputRate: toNumber(outputRate),
      ngQuantity: toNumber(ngQuantity),
      ngWeight: toNumber(ngWeight),
      ngPercentage: toNumber(ngPercentage),
      code: code || null,
      buttWeight: toNumber(buttWeight),
    })
  );

  let index = 1;
  const results = [];
  try {
    for (const log of logs) {
      console.log(index++, 'Adding log');
      results.push(await addLog(log));
    }

    return Response.json(results);
  } catch (err: any) {
    return Response.json({ message: err?.message }, { status: 500 });
  }
}

function toDate(input: number | string | null | undefined) {
  if (!input) return null;
  const num = typeof input === 'number' ? input : parseInt(input);
  const baseDate = new Date('2024-08-01T00:00:00.000Z'); // August 1, 2024
  const msPerDay = 24 * 60 * 60 * 1000; // milliseconds per day
  const offset = num - 45505; // calculate offset from base date
  const targetDate = new Date(baseDate.getTime() + offset * msPerDay);
  return format(targetDate, 'yyyy-MM-dd');
}

function toNumber(input: string) {
  const num = parseFloat(input);
  if (Number.isNaN(num)) return null;
  return num;
}

function toTime(input: string | null | undefined) {
  if (!input) return null;
  let num = parseFloat(input);
  if (num > 1) num -= 1;
  if (Number.isNaN(num)) return null;
  const time = num * 24;
  let hour = Math.floor(time);
  let min = Math.round((time - Math.floor(time)) * 60);
  if (min === 60) {
    min = 0;
    hour++;
  }
  return `${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}`;
}

async function addLog(log: any) {
  const {
    item,
    shift,
    plant,
    date,
    machine,
    inch,
    customer,
    dieCode,
    dieNumber,
    cavity,
    productKgpm,
    billetType,
    lotNumberCode,
    ingotRatio,
    billetKgpm,
    billetLength,
    billetQuantity,
    billetWeight,
    orderLength,
    ramSpeed,
    billetTemp,
    outputTemp,
    productionQuantity,
    productionWeight,
    outputYield,
    ok,
    remark,
    startTime,
    endTime,
    outputRate,
    ngQuantity,
    ngWeight,
    ngPercentage,
    code,
    buttWeight,
  } = log;
  console.log('log', log);

  const [
    existingAccount,
    existingCustomer,
    existingDie,
    existingItem,
    existingLotNo,
    existingBilletType,
    existingCode,
  ] = await Promise.all([
    db
      .selectFrom('accounts')
      .selectAll()
      .where('username', '=', machine)
      .executeTakeFirst(),
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
      !existingAccount
        ? db
            .insertInto('accounts')
            .values({
              role: 'team',
              username: machine,
              password: '1234',
              plant,
              inch,
            })
            .executeTakeFirstOrThrow()
        : Promise.resolve(),
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

    var account =
      existingAccount ||
      (await db
        .selectFrom('accounts')
        .selectAll()
        .where('username', '=', machine)
        .executeTakeFirst());
    if (!account) {
      throw new Error('Account not found' + account);
    }
  } catch (err: any) {
    console.error('Error when preparing reference tables', err);
    throw err;
  }

  try {
    const result = await db
      .insertInto('extrusions')
      .values({
        createdBy: account.id,
        item,
        shift,
        date,
        customer,
        dieCode,
        dieNumber,
        cavity,
        productKgpm,
        billetType,
        lotNumberCode,
        ingotRatio,
        billetKgpm,
        billetLength,
        billetQuantity,
        billetWeight,
        orderLength,
        ramSpeed,
        billetTemp,
        outputTemp,
        productionQuantity,
        productionWeight,
        outputYield,
        ok,
        remark,
        startTime,
        endTime,
        outputRate,
        ngQuantity,
        ngWeight,
        ngPercentage,
        code,
        buttWeight,
      })
      .execute();

    return result;
  } catch (err: any) {
    console.error('Error when inserting extrusion', err);
    throw err;
  }
}
