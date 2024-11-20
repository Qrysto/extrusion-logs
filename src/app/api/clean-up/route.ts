import { type NextRequest } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  console.log('[Clean up] Start Clean Up');
  const startTime = Date.now();
  const monthAgo = new Date(startTime - 30 * 24 * 60 * 60 * 1000);

  const oldLogs = await db
    .selectFrom('extrusions')
    .select(['id', 'lastEdited'])
    .where('deleted', '=', true)
    .where('lastEdited', '<', monthAgo)
    .execute();
  console.log('[Clean up] Old Extrusion logs', oldLogs);

  const [billetTypes, coolingMethods, dies, lotNumbers] = await Promise.all([
    db
      .selectFrom('billetTypes')
      .selectAll()
      .where('name', 'not in', (qb) =>
        qb
          .selectFrom('extrusions')
          .select('billetType')
          .where('billetType', 'is not', null)
      )
      .execute(),
    db
      .selectFrom('coolingMethods')
      .selectAll()
      .where('code', 'not in', (qb) =>
        qb
          .selectFrom('extrusions')
          .select('coolingMethod')
          .where('coolingMethod', 'is not', null)
      )
      .execute(),
    db
      .selectFrom('dies')
      .selectAll()
      .where('code', 'not in', (qb) =>
        qb
          .selectFrom('extrusions')
          .select('dieCode')
          .where('dieCode', 'is not', null)
      )
      .execute(),
    db
      .selectFrom('lotNumbers')
      .selectAll()
      .where('code', 'not in', (qb) =>
        qb
          .selectFrom('extrusions')
          .select('lotNumberCode')
          .where('lotNumberCode', 'is not', null)
      )
      .execute(),
  ]);
  const unusedBilletTypes = billetTypes.map((e) => e.name);
  const unusedCoolingMethods = coolingMethods.map((e) => e.code);
  const unusedDies = dies.map((e) => e.code);
  const unusedLotNumbers = lotNumbers.map((e) => e.code);

  console.log('[Clean up] Unused Billet types', unusedBilletTypes);
  console.log('[Clean up] Unused Cooling methods', unusedCoolingMethods);
  console.log('[Clean up] Unused Dies', unusedDies);
  console.log('[Clean up] Unused Lot numbers', unusedLotNumbers);

  const [
    billetTypesResult,
    coolingMethodsResult,
    diesResult,
    lotNumbersResult,
  ] = await Promise.all([
    unusedBilletTypes.length
      ? db
          .deleteFrom('billetTypes')
          .where('name', 'in', unusedBilletTypes)
          .execute()
      : Promise.resolve(null),
    unusedCoolingMethods.length
      ? db
          .deleteFrom('coolingMethods')
          .where('code', 'in', unusedCoolingMethods)
          .execute()
      : Promise.resolve(null),
    unusedDies.length
      ? db.deleteFrom('dies').where('code', 'in', unusedDies).execute()
      : Promise.resolve(null),
    unusedLotNumbers.length
      ? db
          .deleteFrom('lotNumbers')
          .where('code', 'in', unusedLotNumbers)
          .execute()
      : Promise.resolve(null),
  ]);

  console.log('[Clean up] Result for Billet types', billetTypesResult);
  console.log('[Clean up] Result for Cooling methods', coolingMethodsResult);
  console.log('[Clean up] Result for Dies', diesResult);
  console.log('[Clean up] Result for Lot numbers', lotNumbersResult);

  const duration = Date.now() - startTime;
  console.log(`[Clean up] Finished, took ${duration}ms`);

  return Response.json({
    ok: true,
    unusedBilletTypes,
    unusedCoolingMethods,
    unusedDies,
    unusedLotNumbers,
  });
}
