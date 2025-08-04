import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/prisma";
import { signUpSchema } from "@/lib/validations";
import { saltAndHashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = await signUpSchema.parseAsync(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await saltAndHashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        email: validatedData.email,
        password: hashedPassword,
        address: validatedData.address || null,
        mobileNumber: validatedData.mobileNumber || null,
        role: "USER",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
