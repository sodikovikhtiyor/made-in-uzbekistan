import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { mirofish } from "@/lib/mirofish/client";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const simulation = await db.simulation.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!simulation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // If still running, poll MiroFish for status
    if (simulation.status === "RUNNING" && simulation.miroSessionId) {
      try {
        const miroStatus = await mirofish.getStatus(simulation.miroSessionId);

        if (miroStatus.status === "completed") {
          const report = miroStatus.report ?? (await mirofish.getReport(simulation.miroSessionId));
          const updated = await db.simulation.update({
            where: { id: simulation.id },
            data: { status: "COMPLETED", report: report as object },
          });
          return NextResponse.json({ simulation: updated });
        }

        if (miroStatus.status === "failed") {
          const updated = await db.simulation.update({
            where: { id: simulation.id },
            data: { status: "FAILED" },
          });
          return NextResponse.json({ simulation: updated });
        }
      } catch {
        // MiroFish unreachable — return current DB state
      }
    }

    return NextResponse.json({ simulation });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
