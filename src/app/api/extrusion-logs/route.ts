import { type NextRequest } from 'next/server';
import db from '@/lib/db';
import { getAccount } from '@/lib/auth';
import { parseDateRange } from '@/lib/dateTime';
import { DateRange } from '@/lib/types';
import { fetchLimit } from '@/lib/const';

export async function GET(request: NextRequest) {
  const account = await getAccount();
  if (!account) {
    return Response.json({ message: 'Unauthorized!' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const shift = searchParams.get('shift');
  const plant = searchParams.get('plant');
  const machine = searchParams.get('machine');
  const item = searchParams.get('item');
  const customer = searchParams.get('customer');
  const dieCode = searchParams.get('dieCode');
  const cavity = searchParams.get('cavity');
  const lotNo = searchParams.get('lotNo');
  const result = searchParams.get('result');
  const remarkSearch = searchParams.get('remarkSearch');
  const sort = searchParams.get('sort');
  const skip = searchParams.get('skip');

  const res = await fetchExtrusionLogs({
    account,
    dateRange: parseDateRange(date),
    shift: shift === 'day' ? 'day' : shift === 'night' ? 'night' : null,
    plant,
    machine,
    item,
    customer,
    dieCode,
    cavity: cavity ? parseInt(cavity) : null,
    lotNo,
    result: result === 'OK' ? 'OK' : result === 'NG' ? 'NG' : null,
    remarkSearch,
    sort: sort && JSON.parse(sort),
    skip: skip ? parseInt(skip) : undefined,
  });
  return Response.json(res);
}

async function fetchExtrusionLogs({
  account,
  dateRange,
  shift,
  plant,
  machine,
  item,
  customer,
  dieCode,
  cavity,
  lotNo,
  result,
  remarkSearch,
  sort,
  skip = 0,
}: {
  account: Awaited<ReturnType<typeof getAccount>>;
  dateRange: DateRange | null;
  shift: 'day' | 'night' | null;
  plant: string | null;
  machine: string | null;
  item: string | null;
  customer: string | null;
  dieCode: string | null;
  cavity: number | null;
  lotNo: string | null;
  result: 'OK' | 'NG' | null;
  remarkSearch: string | null;
  sort: { id: string; desc: boolean }[] | null;
  skip?: number;
}) {
  let query = db
    .selectFrom('extrusions')
    .leftJoin('accounts', 'accounts.id', 'extrusions.createdBy')
    .select([
      'extrusions.id',
      'accounts.username as machine',
      'accounts.plant as plant',
      'accounts.inch as inch',
      'extrusions.employeeId',
      'extrusions.date',
      'extrusions.shift',
      'extrusions.item',
      'extrusions.customer',
      'extrusions.billetType',
      'extrusions.lotNumberCode',
      'extrusions.billetLength',
      'extrusions.billetQuantity',
      'extrusions.billetKgpm',
      'extrusions.billetWeight',
      'extrusions.ramSpeed',
      'extrusions.dieCode',
      'extrusions.dieNumber',
      'extrusions.cavity',
      'extrusions.productKgpm',
      'extrusions.ingotRatio',
      'extrusions.orderLength',
      'extrusions.billetTemp',
      'extrusions.outputTemp',
      'extrusions.productionQuantity',
      'extrusions.productionWeight',
      'extrusions.outputRate',
      'extrusions.outputYield',
      'extrusions.result',
      'extrusions.remark',
      'extrusions.startTime',
      'extrusions.endTime',
      'extrusions.ngQuantity',
      'extrusions.ngWeight',
      'extrusions.ngPercentage',
      'extrusions.code',
      'extrusions.buttWeight',
    ])
    .limit(fetchLimit);
  if (account?.role === 'team') {
    query = query.where('extrusions.createdBy', '=', account.id);
  }
  if (dateRange) {
    if (dateRange.from.getTime() === dateRange.to.getTime()) {
      query = query.where('extrusions.date', '=', dateRange.from);
    } else {
      query = query
        .where('extrusions.date', '>=', dateRange.from)
        .where('date', '<=', dateRange.to);
    }
  }
  if (shift) {
    query = query.where('extrusions.shift', '=', shift);
  }
  if (plant) {
    query = query.where('accounts.plant', '=', plant);
  }
  if (machine) {
    query = query.where('accounts.username', '=', machine);
  }
  if (item) {
    query = query.where('extrusions.item', '=', item);
  }
  if (customer) {
    query = query.where('extrusions.customer', '=', customer);
  }
  if (dieCode) {
    query = query.where('extrusions.dieCode', '=', dieCode);
  }
  if (cavity) {
    query = query.where('extrusions.cavity', '=', cavity);
  }
  if (lotNo) {
    query = query.where('extrusions.lotNumberCode', '=', lotNo);
  }
  if (result) {
    query = query.where('extrusions.result', '=', result);
  }
  if (remarkSearch) {
    query = query.where('extrusions.remark', 'like', `%${remarkSearch}%`);
  }
  if (sort?.length) {
    for (const { id, desc } of sort) {
      // @ts-ignore
      query = query.orderBy(`${id} ${desc ? 'desc' : 'asc'}`);
    }
  } else {
    query = query.orderBy('date desc').orderBy('startTime desc');
  }
  if (skip) {
    query = query.offset(skip);
  }

  return await query.execute();
}

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
    result,
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
    result,
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

export type ExtrusionLog = Awaited<ReturnType<typeof fetchExtrusionLogs>>[0];
