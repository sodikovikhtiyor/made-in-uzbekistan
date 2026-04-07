import { NextResponse } from "next/server";
import { SCENARIO_TEMPLATES } from "@/lib/mirofish/seed-adapter";

export async function GET() {
  return NextResponse.json({ templates: SCENARIO_TEMPLATES });
}
