import { DB } from 'kysely-codegen';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { createKysely } from '@vercel/postgres-kysely';
import { Pool } from 'pg';

function createDevConnection() {
  const dialect = new PostgresDialect({
    pool: new Pool({
      database: process.env.POSTGRES_DATABASE,
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port:
        process.env.POSTGRES_PORT !== undefined
          ? parseInt(process.env.POSTGRES_PORT)
          : undefined,
      ssl: false,
      max: 10,
    }),
  });

  // Database interface is passed to Kysely's constructor, and from now on, Kysely
  // knows your database structure.
  // Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
  // to communicate with your database.
  return new Kysely<DB>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });
}

const db =
  process.env.NODE_ENV === 'development'
    ? createDevConnection()
    : createKysely<DB>(undefined, {
        plugins: [new CamelCasePlugin()],
      });

export default db;
