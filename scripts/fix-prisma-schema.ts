import fs from "fs-extra"
import { fixSchema } from "~/lib/fix-prisma-schema"

fs.copyFileSync("./prisma/schema.prisma", "./prisma/schema.prisma.original")

const schema = fs.readFileSync("./prisma/schema.prisma", "utf8")

if (schema.match(`// normalized schema`)) {
  console.log(`schema.prisma is already normalized`)
  process.exit()
} else {
  console.log(`Normalizing schema.prisma`)
}

const fixedSchema = `// normalized schema

${fixSchema(schema, {
  ignoreModels: ["knex_migrations", "knex_migrations_lock"],
})}`

console.log(fixedSchema)

fs.writeFileSync("./prisma/schema.prisma", fixedSchema, "utf8")
