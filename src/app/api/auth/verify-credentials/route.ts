import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { verifyPassword } from '@/lib/password';
import { signInSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = await signInSchema.parseAsync(body);

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Return user object (without password)
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name || `${user.firstName} ${user.lastName}`,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      role: user.role,
      image: user.image,
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    console.error('Credential verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}