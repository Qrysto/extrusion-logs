import { type NextRequest } from 'next/server';
import db from '@/lib/db';
import { getAccount } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const account = await getAccount();
  if (!account) {
    return Response.json({ message: 'Unauthorized!' }, { status: 401 });
  }

  const result = await fetchExtrusionLogs();
  return Response.json({ result });
}

async function fetchExtrusionLogs() {
  return await db
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
      'extrusions.ok',
      'extrusions.remark',
      'extrusions.startTime',
      'extrusions.endTime',
      'extrusions.ngQuantity',
      'extrusions.ngWeight',
      'extrusions.ngPercentage',
      'extrusions.code',
      'extrusions.buttWeight',
    ])
    .execute();
}

export type ExtrusionLog = Awaited<ReturnType<typeof fetchExtrusionLogs>>;
