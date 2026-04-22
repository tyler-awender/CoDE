import { createClient } from "@/lib/supabase/client";

export async function createGameEntry(game_name: String, score: Number) {
    const supabase = await createClient();
    const { data: user, error: e } = await supabase.auth.getClaims();

    if (e || !user) {
        return;
    }

    const uuid = user.claims.sub;

    const { data, error } = await supabase.rpc('insert_game_record', {player: uuid, game: game_name, total_score: score});
    if (error) {
        return false;
    }
    return true;
}