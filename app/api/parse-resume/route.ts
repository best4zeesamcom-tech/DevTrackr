import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check if it's a PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Use require to avoid TypeScript issues with pdf-parse
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);

    console.log("PDF parsed successfully. Pages:", data.numpages);
    console.log("Text preview:", data.text.substring(0, 200));

    return NextResponse.json({
      success: true,
      text: data.text,
      pages: data.numpages,
      info: data.info,
    });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF. Make sure it's a text-based PDF (not scanned)." },
      { status: 500 }
    );
  }
}