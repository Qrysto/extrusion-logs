import { DB } from 'kysely-codegen';
import { CamelCasePlugin } from 'kysely';
import { createKysely } from '@vercel/postgres-kysely';

const db = createKysely<DB>(undefined, {
  plugins: [new CamelCasePlugin()],
});

export default db;
