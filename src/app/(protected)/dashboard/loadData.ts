import db from '@/lib/db';

export async function loadData() {
  const [accounts, items, customers, dies, lotNumbers] = await Promise.all([
    accountQuery,
    itemQuery,
    customerQuery,
    dieQuery,
    lotNoQuery,
  ]);

  const plantSet = new Set<string>();
  accounts.forEach(({ plant }) => {
    if (plant) {
      plantSet.add(plant);
    }
  });
  const plantList = Array.from(plantSet);

  const machineList = accounts.map(({ username }) => username);

  const itemList = items.map(({ item }) => item);

  const customerList = customers.map(({ name }) => name);

  const dieCodeList = dies.map(({ code }) => code);

  const lotNoList = lotNumbers.map(({ code }) => code);

  return {
    plantList,
    machineList,
    itemList,
    customerList,
    dieCodeList,
    lotNoList,
  };
}

const accountQuery = db
  .selectFrom('accounts')
  .select(['username', 'plant'])
  .where('role', '=', 'team')
  .execute();

const itemQuery = db.selectFrom('items').selectAll().execute();

const customerQuery = db.selectFrom('customers').selectAll().execute();

const dieQuery = db.selectFrom('dies').selectAll().execute();

const lotNoQuery = db.selectFrom('lotNumbers').selectAll().execute();

export type LoadDataResult = Awaited<ReturnType<typeof loadData>>;
