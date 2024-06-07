/* eslint-disable prettier/prettier */
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';

export const queries = {
  GET_ALL_USERS: Prisma.sql`SELECT * FROM "User"`,

  CREATE_USER: (email: string, password: string, name?: string) =>
    Prisma.sql`INSERT INTO "User" (email, password, name) VALUES (${email}, ${password}, ${name})`,

  GET_USER_BY_EMAIL: (email: string) =>
    Prisma.sql`SELECT * FROM "User" WHERE email = ${email}`,

  GET_USER_BY_ID: (id: number) =>
    Prisma.sql`SELECT * FROM "User" WHERE id = ${id}`,

  //   UPDATE_USER: (id: number, email: string, password: string, name?: string) =>
  //     Prisma.sql`UPDATE "User" SET email = ${email}, password = ${password}, name = ${name} WHERE id = ${id}`,

  UPDATE_USER: (id: number, updateUserDto: any) => {
    const { email, password, name } = updateUserDto;
    const updateFields: any[] = [];

    if (email) {
      updateFields.push(Prisma.sql`email = ${email}`);
    }
    if (password) {
      const hasedPassword = hashSync(password, 10);
      updateFields.push(Prisma.sql`password = ${hasedPassword}`);
    }
    if (name) {
      updateFields.push(Prisma.sql`name = ${name}`);
    }

    return Prisma.sql`
          UPDATE "User" 
          SET ${Prisma.join(updateFields, ', ')} 
          WHERE id = ${id}
        `;
  },
};
