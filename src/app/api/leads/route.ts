import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, budget, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    // TODO: Save to database using Prisma
    // const lead = await prisma.lead.create({ data: { name, email, phone, company, service, budget, message, source: "website" } });

    // TODO: Send email notification
    // await sendEmail({ to: "hello@nexscope.in", subject: "New Lead from Website", ... });

    console.log("New lead:", { name, email, phone, company, service, budget, message });

    return NextResponse.json(
      { success: true, message: "Thank you! We'll reach out within 24 hours." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}