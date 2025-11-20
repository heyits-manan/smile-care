import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dentists } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [dentist] = await db
      .select()
      .from(dentists)
      .where(eq(dentists.id, id))
      .limit(1);

    if (!dentist) {
      return NextResponse.json(
        { error: 'Dentist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: dentist.id,
      name: dentist.name,
      specialty: dentist.specialty,
      photo: dentist.photo,
      bio: dentist.bio,
      availableSlots: dentist.availableSlots as Record<string, string[]>,
    });

  } catch (error) {
    console.error('Get dentist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
