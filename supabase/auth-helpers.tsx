// Глобальный logout
import {createClient} from "@/lib/supabase/client";

export async function supabaseLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
}
