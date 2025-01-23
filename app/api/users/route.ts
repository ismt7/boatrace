import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient";
import dotenv from "dotenv";

dotenv.config();

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { firstName, lastName, email } = await request.json();

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Failed to register user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
