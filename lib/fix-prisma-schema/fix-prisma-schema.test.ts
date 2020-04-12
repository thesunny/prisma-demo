import { fixSchema } from "."
import fs from "fs-extra"

describe("Fix model name", () => {
  it("should not fix model name", async () => {
    const s = fixSchema(`
      model teams {
        id         Int    @default(autoincrement()) @id
        name       String @unique
      }`)

    expect(s).toEqual(`
      model teams {
        id         Int    @default(autoincrement()) @id
        name       String @unique
      }`)
  })

  it("should fix optional relation", async () => {
    const s = fixSchema(`
      model teams {
        shelves    shelves? @relation(fields: [shelf_id], references: [id])
      }`)

    expect(s).toEqual(`
      model teams {
        shelf    shelves? @relation(fields: [shelf_id], references: [id])
      }`)
  })

  it("should fix required relation", async () => {
    const s = fixSchema(`
      model teams {
        shelves    shelves @relation(fields: [shelf_id], references: [id])
      }`)

    expect(s).toEqual(`
      model teams {
        shelf    shelves @relation(fields: [shelf_id], references: [id])
      }`)
  })

  it("should fix one to many relation", async () => {
    const s = fixSchema(`
      model teams {
        shelves    shelves[] @relation(fields: [shelf_id], references: [id])
      }`)

    expect(s).toEqual(`
      model teams {
        shelves    shelves[] @relation(fields: [shelf_id], references: [id])
      }`)
  })

  it("should skip ignoredModels", async () => {
    const s = fixSchema(
      `
  model knex_migrations {
    batch          Int?
    id             Int       @default(autoincrement()) @id
    migration_time DateTime?
    name           String?
  }

  model users {
    id Int
  }

  model knex_migrations_lock {
    index     Int  @default(autoincrement()) @id
    is_locked Int?
  }`,
      {
        ignoreModels: ["knex_migrations", "knex_migrations_lock"],
      }
    )
    expect(s).toEqual(`  model users {
    id Int
  }
`)
  })

  it("should leave other stuff alone like generator and datasource", async () => {
    const s = fixSchema(`
  generator client {
    provider = "prisma-client-js"
  }

  model users {
    id Int
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }`)
    expect(s).toEqual(`
  generator client {
    provider = "prisma-client-js"
  }

  model users {
    id Int
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }`)
  })
})
