import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { promoCodes } from "@/data/promo-codes";

// Re-use same usage file as validate endpoint
const usageFilePath = path.resolve(process.cwd(), "data", "promo-usage.json");

function ensureUsageFile() {
  if (!fs.existsSync(usageFilePath)) {
    fs.mkdirSync(path.dirname(usageFilePath), { recursive: true });
    fs.writeFileSync(usageFilePath, JSON.stringify({}), "utf8");
  }
}

function loadUsage(): Record<string, { used: number; users: Record<string, number> }> {
  ensureUsageFile();
  try {
    const raw = fs.readFileSync(usageFilePath, "utf8");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsage(data: Record<string, { used: number; users: Record<string, number> }>) {
  fs.writeFileSync(usageFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const codeInput: string = (body.code || "").toString().trim().toUpperCase();
    const phone: string = (body.phone || "").toString().trim();

    if (!codeInput) {
      return NextResponse.json({ redeemed: false, reason: "CODE_REQUIRED" }, { status: 400 });
    }

    // verify code exists
    const promo = promoCodes.find((p) => p.code.toUpperCase() === codeInput);
    if (!promo) {
      return NextResponse.json({ redeemed: false, reason: "NOT_FOUND" }, { status: 400 });
    }

    const usage = loadUsage();
    const entry = usage[codeInput] || { used: 0, users: {} };

    entry.used += 1;
    if (phone) {
      entry.users[phone] = (entry.users[phone] || 0) + 1;
    }
    usage[codeInput] = entry;
    saveUsage(usage);

    return NextResponse.json({ redeemed: true, used: entry.used }, { status: 200 });
  } catch (err) {
    console.error("Promo redeem error:", err);
    return NextResponse.json({ redeemed: false, reason: "SERVER_ERROR" }, { status: 500 });
  }
}