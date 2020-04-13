import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
  // const allUsers = await prisma.user.findMany()
  // console.log(allUsers)
  // await prisma.user.create({
  //   data: {
  //     name: "Alice",
  //     email: "alice@prisma.io",
  //     posts: {
  //       create: { title: "Hello World" },
  //     },
  //     profile: {
  //       create: { bio: "I like turtles" },
  //     },
  //   },
  // })
  const at = new Date().getTime()
  // const r = await prisma.shelves.create({
  //   data: {
  //     name: "david",
  //     type: "u",
  //     created_at: at,
  //     user: {
  //       create: {
  //         name: "david",
  //         first_name: "John",
  //         last_name: "Doe",
  //         email: "johndoe@gmail.com",
  //         starred_book_ids: `[1, 2, 3]`,
  //         created_at: at,
  //       },
  //     },
  //   },
  // })
  // https://softwareengineering.stackexchange.com/questions/304593/how-to-store-ordered-information-in-a-relational-database
  const allUsers = await prisma.users.findMany({
    where: {
      name: "david",
    },
    select: {
      name: true,
      email: true,
      starred_book_ids: true,
      shelf: {
        select: {
          name: true,
          type: true,
          created_at: true,
          books: {
            select: {},
            orderBy: {
              name: "asc",
            },
          },
        },
      },
    },
  })
  await prisma.users.updateMany({ name: "abc" })
  console.dir(allUsers, { depth: null })
  // const post = await prisma.post.update({
  //   where: { id: 1 },
  //   data: { published: true },
  // })
  // console.log(post)
}
main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.disconnect()
  })
