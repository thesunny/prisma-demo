/**
 * Typescript based knexfile
 *
 * <https://gist.github.com/tukkajukka/9893e5f111862d06044b73fa944a8741>
 */

module.exports = {
  development: {
    client: "postgresql",
    connection:
      "postgresql://postgres:my-password@localhost:5437/postgres?schema=public",
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      stub: "knex/migration.stub",
    },
  },
  timezone: "UTC",
}
