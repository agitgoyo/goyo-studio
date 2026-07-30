import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const envPath = path.join(process.cwd(), ".env.local");
const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf8").split(/\r?\n/).filter(Boolean).filter((line) => !line.startsWith("#"))
    .map((line) => { const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1)]; })
);
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const classes = [
  { id: "d5-basic", title: "D5 입문반", date: "08-22 토", time_text: "09:00 ~ 12:00", price: 120000, capacity: 8, sort_order: 1, is_active: true, class_type: "individual" },
  { id: "d5-exterior", title: "D5 외부투시도", date: "08-22 토", time_text: "13:00 ~ 16:00", price: 120000, capacity: 8, sort_order: 2, is_active: true, class_type: "individual" },
  { id: "d5-interior", title: "D5 실내투시도", date: "08-29 토", time_text: "09:00 ~ 12:00", price: 120000, capacity: 8, sort_order: 3, is_active: true, class_type: "individual" },
  { id: "d5-aerial", title: "D5 조감도", date: "08-29 토", time_text: "13:00 ~ 16:00", price: 120000, capacity: 8, sort_order: 4, is_active: true, class_type: "individual" },
  { id: "d5-master", title: "D5 마스터클래스", date: "08-22 / 08-29 토", time_text: "총 4회 · 12시간", price: 432000, capacity: 0, sort_order: 5, is_active: true, class_type: "master" },
  { id: "d5-practical", title: "D5 실전클래스", date: "08-22 / 08-29 토", time_text: "총 3회 · 9시간", price: 324000, capacity: 0, sort_order: 6, is_active: true, class_type: "master" },
];

const bundleItems = [
  ...["d5-basic", "d5-exterior", "d5-interior", "d5-aerial"].map((member_class_id) => ({ master_class_id: "d5-master", member_class_id })),
  ...["d5-exterior", "d5-interior", "d5-aerial"].map((member_class_id) => ({ master_class_id: "d5-practical", member_class_id })),
];

async function run() {
  for (const [table, query] of [
    ["application_class_slots", supabase.from("application_class_slots").delete().not("application_id", "is", null)],
    ["applications", supabase.from("applications").delete().not("id", "is", null)],
    ["reviews", supabase.from("reviews").delete().not("id", "is", null)],
    ["class_bundle_items", supabase.from("class_bundle_items").delete().not("master_class_id", "is", null)],
    ["classes", supabase.from("classes").delete().not("id", "is", null)],
  ]) {
    const { error } = await query;
    if (error) throw new Error(`${table}: ${error.message}`);
  }
  let { error: classError } = await supabase.from("classes").insert(classes);
  if (classError?.message?.includes("time_text")) {
    ({ error: classError } = await supabase.from("classes").insert(
      classes.map(({ time_text, ...classRow }) => classRow)
    ));
  }
  if (classError) throw classError;
  const { error: bundleError } = await supabase.from("class_bundle_items").insert(bundleItems);
  if (bundleError) throw bundleError;
  console.log("Reset complete: 4 individual classes, 2 bundled classes.");
}

run().catch((error) => { console.error(error.message); process.exit(1); });
