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
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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

    const availableSlots = dentist.availableSlots as Record<string, string[]>;

    if (!startDate || !endDate) {
      return NextResponse.json(availableSlots);
    }

    const filteredSlots: Record<string, string[]> = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (const [date, slots] of Object.entries(availableSlots)) {
      const currentDate = new Date(date);
      if (currentDate >= start && currentDate <= end) {
        filteredSlots[date] = slots;
      }
    }

    return NextResponse.json(filteredSlots);

  } catch (error) {
    console.error('Get available slots error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
