import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function checkAdmin(request) {
  const password = request.headers.get("x-admin-password");
  return password && password === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }

  const body = await request.json();
  const { id, title, date, price, capacity, is_active } = body;

  if (!id || !title || !date || !price || !capacity) {
    return NextResponse.json(
      { message: "필수 값이 누락되었습니다." },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("classes")
    .update({
      title,
      date,
      price: Number(price),
      capacity: Number(capacity),
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}