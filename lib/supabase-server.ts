import { createServerClient as createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function getSupabaseServer() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
	const cookieStore = cookies();

	return createServerComponentClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll().map((cookie) => ({
					name: cookie.name,
					value: cookie.value,
				}));
			},
			setAll() {
				// No-op for server component contexts.
			},
		},
	});
}