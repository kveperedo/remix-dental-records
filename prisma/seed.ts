import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const cleanupDatabase = async () => {
  await prisma.record.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.note.deleteMany();
  await prisma.user.deleteMany();
};

async function seed() {
  const email = "test@gmail.com";

  await cleanupDatabase();

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("sample123", 10);

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

  const record = await prisma.record.create({
    data: {
      name: "Aaron Nabors",
      gender: "female",
      status: "single",
      address: "123 Oak St",
      occupation: "Web Developer",
      telephone: "555-555-5555",
      birthDate: new Date("1984-10-12"),
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

  await prisma.transaction.createMany({
    data: [
      {
        date: new Date("2023-10-03"),
        tooth: "Wisdom",
        description: "Wisdom tooth extraction",
        amount: 1200.5,
        recordId: record.id,
      },
      {
        date: new Date("2023-05-21"),
        tooth: "Molar",
        description: "Molar tooth extraction",
        amount: 1500.75,
        recordId: record.id,
      },
      {
        date: new Date("2023-01-22"),
        tooth: "Canine",
        description: "Canine tooth extraction",
        amount: 800.25,
        recordId: record.id,
      },
      {
        date: new Date("2023-09-15"),
        tooth: "Premolar",
        description: "Premolar tooth extraction",
        amount: 1000.0,
        recordId: record.id,
      },
      {
        date: new Date("2023-07-07"),
        tooth: "Incisor",
        description: "Incisor tooth extraction",
        amount: 950.0,
        recordId: record.id,
      },
      {
        date: new Date("2023-12-01"),
        tooth: "Wisdom",
        description: "Wisdom tooth extraction",
        amount: 1300.0,
        recordId: record.id,
      },
      {
        date: new Date("2023-11-11"),
        tooth: "Molar",
        description: "Molar tooth extraction",
        amount: 1400.0,
        recordId: record.id,
      },
      {
        date: new Date("2023-06-30"),
        tooth: "Canine",
        description: "Canine tooth extraction",
        amount: 900.0,
        recordId: record.id,
      },
      {
        date: new Date("2023-08-22"),
        tooth: "Premolar",
        description: "Premolar tooth extraction",
        amount: 1100.0,
        recordId: record.id,
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
