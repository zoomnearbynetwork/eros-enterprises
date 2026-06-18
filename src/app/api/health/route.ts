import { NextResponse } from "next/server";

export async function GET() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    return NextResponse.json({ status: "error", error: "DATABASE_URL not set" }, { status: 500 });
  }

  try {
    const pg = await import("pg");
    const Pool = pg.default.Pool;
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10_000,
      max: 1,
    });

    const client = await pool.connect();
    const result = await client.query("SELECT NOW() as time, current_database() as db");
    client.release();
    await pool.end();

    return NextResponse.json({
      status: "ok",
      db: result.rows[0].db,
      time: result.rows[0].time,
      host: DATABASE_URL.split("@")[1]?.split("/")[0] ?? "unknown",
    });
  } catch (err) {
    const error = err as Error & { code?: string };
    return NextResponse.json({
      status: "error",
      message: error.message,
      code: error.code,
      name: error.name,
      host: DATABASE_URL.split("@")[1]?.split("/")[0] ?? "unknown",
    }, { status: 500 });
  }
}
