const { faker } = require('@faker-js/faker');

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

let data = [...Array(100).keys()].map(x => (
  {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    avatarURL: faker.image.avatar()
  }
))

prisma.user.createMany({
  data
}).then(r=> (
  console.log(r)
))