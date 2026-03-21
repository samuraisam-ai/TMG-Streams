import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const data = Object.fromEntries(params.entries());

  const merchantId = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    data.payment_status === "COMPLETE" &&
    data.merchant_id === merchantId &&
    supabaseUrl &&
    serviceRoleKey &&
    data.m_payment_id
  ) {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    await supabaseAdmin
      .from("purchases")
      .update({ status: "complete" })
      .eq("id", data.m_payment_id);
  }

  return new NextResponse("OK", { status: 200 });
}
