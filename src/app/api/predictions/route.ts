import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { mirofish } from "@/lib/mirofish/client";
import { buildSimulationConfig } from "@/lib/mirofish/seed-adapter";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const simulations = await db.simulation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ simulations });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, templateId, customScenario, rounds } = body;

    if (!title || !templateId) {
      return NextResponse.json(
        { error: "title and templateId are required" },
        { status: 400 }
      );
    }

    const config = await buildSimulationConfig(templateId, customScenario, rounds);

    const simulation = await db.simulation.create({
      data: {
        userId: session.user.id,
        title,
        scenario: config.scenario,
        seedData: config.seed_data as object,
        config: { rounds: config.rounds, agents: config.agents },
        rounds: config.rounds ?? 20,
        status: "PENDING",
      },
    });

    // Fire-and-forget: start MiroFish session asynchronously
    triggerMiroFishSession(simulation.id, config).catch((err) =>
      console.error("MiroFish trigger failed:", err)
    );

    return NextResponse.json({ simulation }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function triggerMiroFishSession(
  simulationId: string,
  config: Awaited<ReturnType<typeof buildSimulationConfig>>
) {
  try {
    await db.simulation.update({
      where: { id: simulationId },
      data: { status: "RUNNING" },
    });

    const miroSession = await mirofish.createSession(config);

    await db.simulation.update({
      where: { id: simulationId },
      data: { miroSessionId: miroSession.session_id },
    });
  } catch (err) {
    console.error("Failed to start MiroFish session:", err);
    await db.simulation.update({
      where: { id: simulationId },
      data: { status: "FAILED" },
    });
  }
}
