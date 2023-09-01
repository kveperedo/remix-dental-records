import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.record.createMany({
    data: [
      {
        name: "John Smith",
        gender: "male",
        status: "single",
        address: "456 Elm St",
        occupation: "Web Developer",
        telephone: "555-555-5555",
        birthDate: new Date("1995-03-12"),
      },
      {
        name: "Emily Johnson",
        gender: "female",
        status: "married",
        address: "789 Oak St",
        occupation: "Data Analyst",
        telephone: "555-555-5555",
        birthDate: new Date("1988-07-22"),
      },
      {
        name: "Michael Brown",
        gender: "male",
        status: "divorced",
        address: "321 Pine St",
        occupation: "Software Engineer",
        telephone: "555-555-5555",
        birthDate: new Date("1976-11-05"),
      },
      {
        name: "Sarah Davis",
        gender: "female",
        status: "single",
        address: "987 Maple St",
        occupation: "UX Designer",
        telephone: "555-555-5555",
        birthDate: new Date("1992-02-18"),
      },
      {
        name: "David Wilson",
        gender: "male",
        status: "married",
        address: "654 Birch St",
        occupation: "Frontend Developer",
        telephone: "555-555-5555",
        birthDate: new Date("1983-09-30"),
      },
      {
        name: "Jessica Lee",
        gender: "female",
        status: "single",
        address: "246 Cedar St",
        occupation: "Fullstack Developer",
        telephone: "555-555-5555",
        birthDate: new Date("1990-06-08"),
      },
      {
        name: "Christopher Martin",
        gender: "male",
        status: "married",
        address: "135 Walnut St",
        occupation: "DevOps Engineer",
        telephone: "555-555-5555",
        birthDate: new Date("1979-04-14"),
      },
      {
        name: "Amanda Thompson",
        gender: "female",
        status: "divorced",
        address: "864 Pine St",
        occupation: "Backend Developer",
        telephone: "555-555-5555",
        birthDate: new Date("1985-12-27"),
      },
      {
        name: "Daniel Garcia",
        gender: "male",
        status: "single",
        address: "975 Oak St",
        occupation: "Mobile Developer",
        telephone: "555-555-5555",
        birthDate: new Date("1993-01-31"),
      },
      {
        name: "Melissa Hernandez",
        gender: "female",
        status: "married",
        address: "246 Elm St",
        occupation: "Software Engineer",
        telephone: "555-555-5555",
        birthDate: new Date("1982-08-11"),
      },
      {
        name: "Matthew Perez",
        gender: "male",
        status: "divorced",
        address: "753 Maple St",
        occupation: "Web Developer",
        telephone: "555-555-5555",
        birthDate: new Date("1977-05-23"),
      },
      {
        name: "Stephanie Rodriguez",
        gender: "female",
        status: "single",
        address: "864 Cedar St",
        occupation: "Data Analyst",
        telephone: "555-555-5555",
        birthDate: new Date("1991-12-03"),
      },
      {
        name: "Joshua Martinez",
        gender: "male",
        status: "married",
        address: "975 Pine St",
        occupation: "Software Engineer",
        telephone: "555-555-5555",
        birthDate: new Date("1981-02-27"),
      },
      {
        name: "Ashley Gonzalez",
        gender: "female",
        status: "divorced",
        address: "753 Oak St",
        occupation: "UX Designer",
        telephone: "555-555-5555",
        birthDate: new Date("1986-09-15"),
      },
      {
        name: "Kevin Lewis",
        gender: "male",
        status: "single",
        address: "246 Birch St",
        occupation: "Frontend Developer",
        telephone: "555-555-5555",
        birthDate: new Date("1994-04-07"),
      },
    ],
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
