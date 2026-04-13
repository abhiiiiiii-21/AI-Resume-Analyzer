import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // In a real application, you would save this to your database via Prisma
    console.log("Saving Resume Data:", JSON.stringify(data, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: "Resume saved successfully",
      id: data.id || Math.random().toString(36).substr(2, 9)
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Failed to save resume",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
