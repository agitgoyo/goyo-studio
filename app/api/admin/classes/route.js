import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  buildClassId,
  hasSupabaseConfig,
  isMissingColumnError,
  readClasses,
  stripTimeText,
  writeClasses,
} from "@/app/lib/classes-store";

function getSupabase() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function checkAdmin(request) {
  const password = request.headers.get("x-admin-password");
  return Boolean(password) && password === process.env.ADMIN_PASSWORD;
}

function unauthorized() {
  return NextResponse.json(
    { message: "관리자 비밀번호가 올바르지 않습니다." },
    { status: 401 }
  );
}

function missingRequiredFields() {
  return NextResponse.json(
    { message: "수업명, 날짜, 시간, 금액, 정원을 모두 입력해 주세요." },
    { status: 400 }
  );
}

function normalizeClassInput(item, fallbackId) {
  return {
    id: String(item?.id || fallbackId || "").trim(),
    title: String(item?.title || "").trim(),
    date: String(item?.date || "").trim(),
    time_text: String(item?.time_text || "").trim(),
    price: Number(item?.price || 0),
    capacity: Number(item?.capacity || 0),
    sort_order: Number(item?.sort_order || 99),
    is_active: item?.is_active ?? true,
  };
}

function buildUniqueClassId(baseId, existingIds) {
  const takenIds = new Set(existingIds.filter(Boolean));

  if (!takenIds.has(baseId)) {
    return baseId;
  }

  let index = 2;
  let nextId = `${baseId}-${index}`;

  while (takenIds.has(nextId)) {
    index += 1;
    nextId = `${baseId}-${index}`;
  }

  return nextId;
}

async function updateSupabaseClass(supabase, nextItem) {
  const result = await supabase
    .from("classes")
    .update(nextItem)
    .eq("id", nextItem.id)
    .select("id, title, date, time_text, price, capacity, sort_order, is_active")
    .single();

  if (!result.error) {
    return result.data;
  }

  if (!isMissingColumnError(result.error, "time_text")) {
    throw result.error;
  }

  const legacyResult = await supabase
    .from("classes")
    .update(stripTimeText(nextItem))
    .eq("id", nextItem.id)
    .select("id, title, date, price, capacity, sort_order, is_active")
    .single();

  if (legacyResult.error) {
    throw legacyResult.error;
  }

  return {
    ...legacyResult.data,
    time_text: nextItem.time_text,
  };
}

async function insertSupabaseClass(supabase, nextItem) {
  const result = await supabase
    .from("classes")
    .insert(nextItem)
    .select("id, title, date, time_text, price, capacity, sort_order, is_active")
    .single();

  if (!result.error) {
    return result.data;
  }

  if (!isMissingColumnError(result.error, "time_text")) {
    throw result.error;
  }

  const legacyResult = await supabase
    .from("classes")
    .insert(stripTimeText(nextItem))
    .select("id, title, date, price, capacity, sort_order, is_active")
    .single();

  if (legacyResult.error) {
    throw legacyResult.error;
  }

  return {
    ...legacyResult.data,
    time_text: nextItem.time_text,
  };
}

async function syncClassesFileWithSupabase(updatedItem = null, deletedId = null) {
  const currentFileClasses = await writeClasses(
    deletedId
      ? (await readClasses()).filter((item) => item.id !== deletedId)
      : await readClasses()
  );

  if (!updatedItem) {
    return currentFileClasses;
  }

  const nextClasses = currentFileClasses.some((item) => item.id === updatedItem.id)
    ? currentFileClasses.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    : [...currentFileClasses, updatedItem];

  return writeClasses(nextClasses);
}

async function cleanupLinkedData(id) {
  const supabase = getSupabase();

  if (!supabase) {
    return;
  }

  try {
    await Promise.allSettled([
      supabase.from("applications").delete().eq("class_id", id),
      supabase.from("reviews").delete().eq("class_id", id),
    ]);
  } catch (error) {
    console.error("linked class cleanup error:", error);
  }
}

export async function GET(request) {
  if (!checkAdmin(request)) {
    return unauthorized();
  }

  try {
    const classes = await readClasses();
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "수업 목록을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  if (!checkAdmin(request)) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const nextItem = normalizeClassInput(body, body?.id);

    if (
      !nextItem.id ||
      !nextItem.title ||
      !nextItem.date ||
      !nextItem.time_text ||
      !nextItem.price ||
      !nextItem.capacity
    ) {
      return missingRequiredFields();
    }

    if (hasSupabaseConfig()) {
      const supabase = getSupabase();
      const data = await updateSupabaseClass(supabase, nextItem);
      await syncClassesFileWithSupabase(data);
      return NextResponse.json(data);
    }

    const classes = await readClasses();
    const existingIndex = classes.findIndex((item) => item.id === nextItem.id);

    if (existingIndex === -1) {
      return NextResponse.json(
        { message: "저장할 수업을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const updatedClasses = [...classes];
    updatedClasses[existingIndex] = nextItem;
    const savedClasses = await writeClasses(updatedClasses);
    const savedItem = savedClasses.find((item) => item.id === nextItem.id) || nextItem;

    return NextResponse.json(savedItem);
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "수업 저장 중 문제가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!checkAdmin(request)) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const classes = await readClasses();
    const baseId = buildClassId(body?.title);
    const nextId = buildUniqueClassId(
      baseId,
      classes.map((item) => item.id)
    );
    const nextItem = normalizeClassInput(body, nextId);

    if (
      !nextItem.title ||
      !nextItem.date ||
      !nextItem.time_text ||
      !nextItem.price ||
      !nextItem.capacity
    ) {
      return missingRequiredFields();
    }

    if (hasSupabaseConfig()) {
      const supabase = getSupabase();
      const data = await insertSupabaseClass(supabase, nextItem);
      await syncClassesFileWithSupabase(data);
      return NextResponse.json(data);
    }

    const createdItem = {
      ...nextItem,
    };

    await writeClasses([...classes, createdItem]);
    return NextResponse.json(createdItem);
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "새 수업을 만들지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  if (!checkAdmin(request)) {
    return unauthorized();
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "삭제할 수업 ID가 없습니다." },
        { status: 400 }
      );
    }

    if (hasSupabaseConfig()) {
      const supabase = getSupabase();
      const { error } = await supabase.from("classes").delete().eq("id", id);

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }

      await cleanupLinkedData(id);
      await syncClassesFileWithSupabase(null, id);

      return NextResponse.json({
        message: "수업을 삭제했습니다.",
        id,
      });
    }

    const classes = await readClasses();
    const exists = classes.some((item) => item.id === id);

    if (!exists) {
      return NextResponse.json(
        { message: "삭제할 수업을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    await writeClasses(classes.filter((item) => item.id !== id));
    await cleanupLinkedData(id);

    return NextResponse.json({
      message: "수업을 삭제했습니다.",
      id,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "수업 삭제 중 문제가 발생했습니다." },
      { status: 500 }
    );
  }
}
