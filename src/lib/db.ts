import { Database } from './dbSchema';
import { CamelCasePlugin } from 'kysely';
import { createKysely } from '@vercel/postgres-kysely';

const db = createKysely<Database>(undefined, {
  plugins: [new CamelCasePlugin()],
});

export default db;
