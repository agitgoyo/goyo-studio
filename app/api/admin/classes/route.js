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

export async function POST(request) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }

  const body = await request.json();
  const { id, title, date, price, capacity, is_active, sort_order } = body;

  if (!id || !title || !date || !price || !capacity) {
    return NextResponse.json(
      { message: "필수 값이 누락되었습니다." },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("classes")
    .insert({
      id,
      title,
      date,
      price: Number(price),
      capacity: Number(capacity),
      is_active: is_active ?? true,
      sort_order: Number(sort_order || 99),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "삭제할 강의 ID가 없습니다." },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  const { count, error: countError } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("class_id", id)
    .eq("payment_status", "paid");

  if (countError) {
    return NextResponse.json({ message: countError.message }, { status: 500 });
  }

  if ((count || 0) > 0) {
    return NextResponse.json(
      {
        message:
          "이미 결제자가 있는 강의는 삭제할 수 없습니다. 대신 노출 여부를 꺼주세요.",
      },
      { status: 409 }
    );
  }

  const { error } = await supabase.from("classes").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "삭제되었습니다.", id });
}