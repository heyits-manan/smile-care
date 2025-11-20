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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, specialty, photo, bio, availableSlots } = body;

    if (!name || !specialty || !photo || !bio || !availableSlots) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (typeof availableSlots !== 'object' || Array.isArray(availableSlots)) {
      return NextResponse.json(
        { error: 'Invalid availableSlots format. Must be an object.' },
        { status: 400 }
      );
    }

    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(photo)) {
      return NextResponse.json(
        { error: 'Invalid photo URL format' },
        { status: 400 }
      );
    }

    const [newDentist] = await db.insert(dentists).values({
      name,
      specialty,
      photo,
      bio,
      availableSlots,
    }).returning();

    return NextResponse.json({
      id: newDentist.id,
      name: newDentist.name,
      specialty: newDentist.specialty,
      photo: newDentist.photo,
      bio: newDentist.bio,
      availableSlots: newDentist.availableSlots as Record<string, string[]>,
      createdAt: newDentist.createdAt.toISOString(),
      updatedAt: newDentist.updatedAt.toISOString(),
    }, { status: 201 });

  } catch (error) {
    console.error('Create dentist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
