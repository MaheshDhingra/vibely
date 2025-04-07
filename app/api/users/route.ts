import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // const { userId } = await auth()
  try{
    // if (!userId){
    //   return NextResponse.json({message: "Unauthorized"}, {status: 401});
    // };

    const users = await prisma.user.findMany({
      include: {
        username: true,
      },
    });

    console.log(users);
    return users;
  } catch (error) {
    console.log(Error)
  } 
}