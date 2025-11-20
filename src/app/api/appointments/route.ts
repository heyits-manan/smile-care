import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments, dentists } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientName, phone, email, date, time, notes, dentistId } = body;

    if (!patientName || !phone || !date || !time || !dentistId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const [dentist] = await db.select().from(dentists).where(eq(dentists.id, dentistId)).limit(1);

    if (!dentist) {
      return NextResponse.json(
        { error: 'Dentist not found' },
        { status: 404 }
      );
    }

    const [newAppointment] = await db.insert(appointments).values({
      dentistId,
      patientName,
      phone,
      email: email || undefined,
      date,
      time,
      notes: notes || undefined,
    }).returning();

    return NextResponse.json({
      id: newAppointment.id,
      dentistId: newAppointment.dentistId,
      dentistName: dentist.name,
      patientName: newAppointment.patientName,
      phone: newAppointment.phone,
      email: newAppointment.email,
      date: newAppointment.date,
      time: newAppointment.time,
      notes: newAppointment.notes,
      createdAt: newAppointment.createdAt.toISOString(),
    }, { status: 201 });

  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const query = db
      .select({
        id: appointments.id,
        dentistId: appointments.dentistId,
        dentistName: dentists.name,
        patientName: appointments.patientName,
        phone: appointments.phone,
        email: appointments.email,
        date: appointments.date,
        time: appointments.time,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
      })
      .from(appointments)
      .leftJoin(dentists, eq(appointments.dentistId, dentists.id));

    const results = await query;

    const formattedResults = results.map(result => ({
      id: result.id,
      dentistId: result.dentistId,
      dentistName: result.dentistName || '',
      patientName: result.patientName,
      phone: result.phone,
      email: result.email,
      date: result.date,
      time: result.time,
      notes: result.notes,
      createdAt: result.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedResults);

  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
