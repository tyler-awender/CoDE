import { createClient } from "@/lib/supabase/client";

export async function createGameEntry(game_name: string, score: number) {
    const supabase = createClient();
    const { data: user, error: e } = await supabase.auth.getClaims();

    if (e || !user) {
        return;
    }

    const uuid = user.claims.sub;

    const { error } = await supabase.rpc('insert_game_record', {player: uuid, game: game_name, total_score: score});
    if (error) {
        console.error("Couldn't insert a new game entry");
        return false;
    }

    const { error: error2 } =  await supabase.rpc('update_streak', {player: uuid});
    if (error2) {
        console.error("Couldn't update daily streak");
        return false;
    }

    const { error: error3 } = await supabase.rpc('update_last_seen', {player: uuid});
    if (error3) {
        console.error("Couldn't update last seen");
        return false;
    }

    return true;
}