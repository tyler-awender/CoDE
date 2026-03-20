import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("get_personal_metrics");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const metrics = data?.[0] ?? {
    games_played: 0,
    best_score: 0,
    current_streak: 0,
  };

  return NextResponse.json({ metrics }, { status: 200 });
}
