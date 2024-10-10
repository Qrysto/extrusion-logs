import db from '@/lib/db';
import { getAccount } from '@/lib/auth';
import { dummyTranslate as __ } from '@/lib/intl/server';

export async function GET() {
  const account = await getAccount();
  if (!account) {
    return Response.json({ message: __('Unauthorized!') }, { status: 401 });
  }

  const data = await loadSuggestionData(account.role === 'admin');
  return Response.json(data);
}

async function loadSuggestionData(admin: boolean) {
  const accountQuery =
    admin &&
    db
      .selectFrom('accounts')
      .select(['username', 'plant'])
      .where('role', '=', 'team')
      .execute();
  // const itemQuery = db.selectFrom('items').selectAll().execute();
  // const customerQuery = db.selectFrom('customers').selectAll().execute();
  const dieQuery = db.selectFrom('dies').selectAll().execute();
  const lotNoQuery = db.selectFrom('lotNumbers').selectAll().execute();
  const billetTypeQuery = db.selectFrom('billetTypes').selectAll().execute();
  // const codeQuery = db.selectFrom('codes').selectAll().execute();
  const coolingMethodQuery = db
    .selectFrom('coolingMethods')
    .selectAll()
    .execute();

  const [accounts, dies, lotNumbers, billetTypes, coolingMethods] =
    await Promise.all([
      accountQuery || Promise.resolve(),
      // itemQuery,
      // customerQuery,
      dieQuery,
      lotNoQuery,
      billetTypeQuery,
      // codeQuery,
      coolingMethodQuery,
    ]);

  const plantSet = new Set<string>();
  accounts &&
    accounts.forEach(({ plant }) => {
      if (plant) {
        plantSet.add(plant);
      }
    });
  const plantList = accounts && Array.from(plantSet);
  const machineList = accounts && accounts.map(({ username }) => username);
  // const itemList = items.map(({ item }) => item);
  // const customerList = customers.map(({ name }) => name);
  const dieCodeList = dies.map(({ code }) => code);
  const lotNoList = lotNumbers.map(({ code }) => code);
  const billetTypeList = billetTypes.map(({ name }) => name);
  // const codeList = codes.map(({ code }) => code);
  const coolingMethodList = coolingMethods.map(({ code }) => code);

  const data: any = {
    // itemList,
    // customerList,
    dieCodeList,
    lotNoList,
    billetTypeList,
    // codeList,
    coolingMethodList,
  };

  if (admin) {
    data.plantList = plantList;
    data.machineList = machineList;
  }

  return data;
}
