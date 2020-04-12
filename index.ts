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
  const allUsers = await prisma.users.findMany({
    where: {
      shelf: {
        pinned_book_ids: "john",
      },
    },
    select: {
      name: true,
      email: true,
      shelf: {
        select: {
          name: true,
        },
      },
    },
  })
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
