import { type NextRequest } from 'next/server';
import db from '@/lib/db';
import { getAccount } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const account = await getAccount();
  if (!account) {
    return Response.json({ message: 'Unauthorized!' }, { status: 401 });
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
  const itemQuery = db.selectFrom('items').selectAll().execute();
  const customerQuery = db.selectFrom('customers').selectAll().execute();
  const dieQuery = db.selectFrom('dies').selectAll().execute();
  const lotNoQuery = db.selectFrom('lotNumbers').selectAll().execute();

  const [accounts, items, customers, dies, lotNumbers] = await Promise.all([
    accountQuery || Promise.resolve(),
    itemQuery,
    customerQuery,
    dieQuery,
    lotNoQuery,
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
  const itemList = items.map(({ item }) => item);
  const customerList = customers.map(({ name }) => name);
  const dieCodeList = dies.map(({ code }) => code);
  const lotNoList = lotNumbers.map(({ code }) => code);

  const data: any = {
    itemList,
    customerList,
    dieCodeList,
    lotNoList,
  };

  if (admin) {
    data.plantList = plantList;
    data.machineList = machineList;
  }

  return data;
}
