import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const workspaceClassesFilePath = path.join(process.cwd(), "data", "classes.json");
const fallbackClassesFilePath = path.join(os.tmpdir(), "goyo-studio", "classes.json");

const fullSelectColumns =
  "id, title, date, time_text, price, capacity, sort_order, is_active, class_type";
const legacySelectColumns = "id, title, date, price, capacity, sort_order, is_active, class_type";

let resolvedClassesFilePathPromise;

const defaultClasses = [
  {
    id: "왕초보반",
    title: "왕초보반",
    date: "06-20(토)",
    time_text: "오전 9시~12시",
    price: 120000,
    capacity: 8,
    sort_order: 1,
    is_active: true,
  },
  {
    id: "완성도반",
    title: "완성도반",
    date: "06-20(토)",
    time_text: "오후 1시~4시",
    price: 120000,
    capacity: 8,
    sort_order: 2,
    is_active: true,
  },
];

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseAdmin() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function isMissingColumnError(error, columnName) {
  const message = String(error?.message || "").toLowerCase();
  const target = columnName.toLowerCase();

  return (
    message.includes(target) &&
    (message.includes("does not exist") ||
      message.includes("could not find") ||
      message.includes("schema cache"))
  );
}

function normalizeClassRecord(item, fallbackIndex = 0) {
  return {
    id: String(item?.id || item?.title || `class-${fallbackIndex + 1}`).trim(),
    title: String(item?.title || "").trim(),
    date: String(item?.date || "").trim(),
    time_text: String(item?.time_text || "").trim(),
    price: Number(item?.price || 0),
    capacity: Number(item?.capacity || 0),
    sort_order: Number(item?.sort_order ?? fallbackIndex + 1),
    is_active: item?.is_active ?? true,
    class_type: item?.class_type === "master" ? "master" : "individual",
  };
}

function normalizeClassList(list) {
  return (Array.isArray(list) ? list : [])
    .map((item, index) => normalizeClassRecord(item, index))
    .sort((a, b) => a.sort_order - b.sort_order);
}

function buildClassLookupKeys(item) {
  return [
    String(item?.id || "").trim(),
    String(item?.title || "").trim(),
  ].filter(Boolean);
}

function mergeTimeTextFromOverrides(classes, overrides) {
  const overrideMap = new Map();

  for (const item of normalizeClassList(overrides)) {
    for (const key of buildClassLookupKeys(item)) {
      if (item.time_text) {
        overrideMap.set(key, item.time_text);
      }
    }
  }

  return normalizeClassList(classes).map((item) => {
    const overrideTimeText = buildClassLookupKeys(item)
      .map((key) => overrideMap.get(key))
      .find(Boolean);

    return {
      ...item,
      time_text: String(overrideTimeText || item.time_text || "").trim(),
    };
  });
}

function stripTimeText(item) {
  return Object.fromEntries(
    Object.entries(item).filter(
      ([key]) => key !== "time_text" && key !== "bundle_class_ids" && key !== "capacity_details" && key !== "occupied" && key !== "remaining"
    )
  );
}

async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeJsonFile(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

async function pathIsWritable(filePath) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const probePath = `${filePath}.probe`;
    await fs.writeFile(probePath, "ok", "utf8");
    await fs.unlink(probePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureFallbackSeeded() {
  try {
    const parsed = await readJsonFile(fallbackClassesFilePath);
    if (Array.isArray(parsed)) {
      return;
    }
  } catch {}

  try {
    const parsed = await readJsonFile(workspaceClassesFilePath);
    if (Array.isArray(parsed)) {
      await writeJsonFile(fallbackClassesFilePath, normalizeClassList(parsed));
      return;
    }
  } catch {}

  await writeJsonFile(fallbackClassesFilePath, defaultClasses);
}

async function resolveClassesFilePath() {
  if (!resolvedClassesFilePathPromise) {
    resolvedClassesFilePathPromise = (async () => {
      if (await pathIsWritable(workspaceClassesFilePath)) {
        return workspaceClassesFilePath;
      }

      await ensureFallbackSeeded();
      return fallbackClassesFilePath;
    })();
  }

  return resolvedClassesFilePathPromise;
}

async function resetClassesFile(filePath) {
  const normalized = normalizeClassList(defaultClasses);
  await writeJsonFile(filePath, normalized);
  return normalized;
}

async function readClassesFromFile() {
  const filePath = await resolveClassesFilePath();

  try {
    const parsed = await readJsonFile(filePath);
    if (!Array.isArray(parsed)) {
      return resetClassesFile(filePath);
    }

    return normalizeClassList(parsed);
  } catch {
    return resetClassesFile(filePath);
  }
}

async function readTimeTextOverrides() {
  try {
    return await readClassesFromFile();
  } catch {
    return [];
  }
}

async function insertDefaultClasses(supabase) {
  const { error } = await supabase.from("classes").insert(defaultClasses);

  if (!error) {
    return;
  }

  if (isMissingColumnError(error, "time_text")) {
    const { error: legacyError } = await supabase
      .from("classes")
      .insert(defaultClasses.map(stripTimeText));

    if (legacyError) {
      throw legacyError;
    }

    return;
  }

  throw error;
}

async function ensureSupabaseSeeded(supabase) {
  const { count, error } = await supabase
    .from("classes")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  if ((count || 0) > 0) {
    return;
  }

  await insertDefaultClasses(supabase);
}

async function readClassesFromSupabase() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return null;
  }

  await ensureSupabaseSeeded(supabase);

  const { data, error } = await supabase
    .from("classes")
    .select(fullSelectColumns)
    .order("sort_order", { ascending: true });

  if (!error) {
    return normalizeClassList(data);
  }

  if (!isMissingColumnError(error, "time_text")) {
    throw error;
  }

  const legacyResult = await supabase
    .from("classes")
    .select(legacySelectColumns)
    .order("sort_order", { ascending: true });

  if (legacyResult.error) {
    throw legacyResult.error;
  }

  const timeTextOverrides = await readTimeTextOverrides();
  return mergeTimeTextFromOverrides(legacyResult.data, timeTextOverrides);
}

export async function readClasses() {
  if (hasSupabaseConfig()) {
    return readClassesFromSupabase();
  }

  return readClassesFromFile();
}

export async function writeClasses(classes) {
  const filePath = await resolveClassesFilePath();
  const normalized = normalizeClassList(classes);
  await writeJsonFile(filePath, normalized);
  return normalized;
}

export async function getPublicClasses() {
  const classes = await readClasses();
  return classes.filter((item) => item.is_active);
}

export async function getDetailClasses() {
  return readClasses();
}

export async function getClassById(classId, { activeOnly = false } = {}) {
  const classes = activeOnly ? await getPublicClasses() : await readClasses();
  return classes.find((item) => item.id === classId) || null;
}

export function buildClassId(title) {
  const normalized = String(title || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `class-${Date.now().toString(36)}`;
}

export { hasSupabaseConfig, isMissingColumnError, stripTimeText };
