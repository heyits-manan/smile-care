import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dentists } from '@/db/schema';
import { eq, SQL } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty');

    const query = db.select().from(dentists);

    if (specialty) {
      query.where(eq(dentists.specialty, specialty) as SQL);
    }

    const results = await query;

    const formattedResults = results.map(dentist => ({
      id: dentist.id,
      name: dentist.name,
      specialty: dentist.specialty,
      photo: dentist.photo,
      bio: dentist.bio,
      availableSlots: dentist.availableSlots as Record<string, string[]>,
    }));

    return NextResponse.json(formattedResults);

  } catch (error) {
    console.error('Get dentists error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
