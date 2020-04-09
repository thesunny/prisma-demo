import { fixSchema } from "."

const BOOKS_SCHEMA = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model archived_pages {
  ancestor_ids String
  book_id      Int
  cid          Int
  id           Int     @default(autoincrement()) @id
  inserted_at  Int
  inserted_by  Int
  markdown     String
  name         String?
  page_id      Int
  sibling_ids  String
  title        String

  @@unique([book_id, page_id], name: "archived_pages_book_id_page_id_unique")
}

model bookmarks {
  all_read_at          Int?
  all_read_max_page_id Int?
  book_id              Int
  id                   Int    @default(autoincrement()) @id
  pages_read_at_map    String @default(dbgenerated())
  user_id              Int

  @@unique([user_id, book_id], name: "bookmarks_user_id_book_id_unique")
}

model books {
  created_at Int
  id         Int      @default(autoincrement()) @id
  last_cid   Int      @default(0)
  name       String
  privacy    Int
  shelf_id   Int?
  title      String
  toc        String
  updated_at Int
  shelves    shelves? @relation(fields: [shelf_id], references: [id])
  pages      pages[]

  @@unique([shelf_id, name], name: "books_shelf_id_name_unique")
}

model knex_migrations {
  batch          Int?
  id             Int       @default(autoincrement()) @id
  migration_time DateTime?
  name           String?
}

model knex_migrations_lock {
  index     Int  @default(autoincrement()) @id
  is_locked Int?
}

model members {
  created_at Int
  id         Int     @default(autoincrement()) @id
  role       Int
  team_id    Int
  user_id    Int
  shelves    shelves @relation(fields: [team_id], references: [id])
  users      users   @relation(fields: [user_id], references: [id])

  @@unique([team_id, user_id], name: "members_team_id_user_id_unique")
}

model pages {
  book_id    Int
  cid        Int
  created_at Int
  edited_at  Int
  id         Int     @default(autoincrement()) @id
  markdown   String
  name       String?
  title      String
  books      books   @relation(fields: [book_id], references: [id])

  @@unique([book_id, cid], name: "pages_book_id_cid_unique")
  @@unique([book_id, name], name: "pages_book_id_name_unique")
}

model removed_pages {
  ancestor_ids String
  book_id      Int
  cid          Int
  id           Int     @default(autoincrement()) @id
  inserted_at  Int
  inserted_by  Int
  markdown     String
  name         String?
  page_id      Int
  sibling_ids  String
  title        String

  @@unique([book_id, page_id], name: "removed_pages_book_id_page_id_unique")
}

model sessions {
  created_at Int
  expires_at Int
  id         Int    @default(autoincrement()) @id
  token      String @unique
  user_id    Int?
  users      users? @relation(fields: [user_id], references: [id])
}

model shelves {
  created_at      Int
  id              Int       @default(autoincrement()) @id
  name            String    @unique
  pinned_book_ids String    @default(dbgenerated())
  type            String
  books           books[]
  members         members[]
}

model signin_redirects {
  created_at    Int
  expires_at    Int
  id            Int    @default(autoincrement()) @id
  redirect_to   String
  session_token String @unique
}

model teams {
  created_at Int
  id         Int    @default(autoincrement()) @id
  name       String @unique
  title      String
}

model users {
  created_at       Int
  email            String
  first_name       String
  id               Int        @id
  last_name        String
  name             String     @unique
  starred_book_ids String     @default(dbgenerated())
  members          members[]
  sessions         sessions[]
}
`

describe("Fix model name", () => {
  it("should fix books", async () => {
    const s = fixSchema(`
model teams {
  id         Int    @default(autoincrement()) @id
}
`)
    console.log(s)
  })
})
