import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		"Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
	);
}

export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);

export async function hasPurchased(
	userId: string,
	titleId: string,
): Promise<boolean> {
	const { data, error } = await supabaseBrowser
		.from("purchases")
		.select("id")
		.eq("user_id", userId)
		.eq("title_id", titleId)
		.eq("status", "complete")
		.maybeSingle();

	if (error) {
		return false;
	}

	return Boolean(data?.id);
}