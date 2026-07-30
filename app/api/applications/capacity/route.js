import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getClassById } from "@/app/lib/classes-store";

export const dynamic = "force-dynamic";
const db = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request) {
  const classId = new URL(request.url).searchParams.get("classId");
  if (!classId) return NextResponse.json({ message: "classId가 필요합니다." }, { status: 400 });
  const selected = await getClassById(classId);
  if (!selected) return NextResponse.json({ message: "강의를 찾을 수 없습니다." }, { status: 404 });
  const { data, error } = await db().rpc("get_capacity", { p_class_id: classId });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  const classes = data || [];
  const remaining = classes.length ? Math.min(...classes.map((row) => Number(row.remaining))) : 0;
  return NextResponse.json({
    paidCount: selected.class_type === "master" ? null : (classes[0]?.occupied || 0),
    capacity: selected.class_type === "master" ? null : (classes[0]?.capacity || 0),
    remaining, isFull: remaining <= 0, classType: selected.class_type || "individual", members: classes,
  });
}
