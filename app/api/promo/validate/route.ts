import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { promoCodes } from "@/data/promo-codes";

// Simple file-based storage for usage counts (development/demo only)
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

function saveUsage(usage: Record<string, { used: number; users: Record<string, number> }>) {
  fs.writeFileSync(usageFilePath, JSON.stringify(usage, null, 2), "utf8");
}

function nowIsoDateOnly(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const codeInput: string = (body.code || "").toString().trim().toUpperCase();
    const phone: string = (body.phone || "").toString().trim();
    const subtotal: number = Number(body.subtotal || 0);
    const city: string = (body.city || "").toString();
    const items: any[] = Array.isArray(body.items) ? body.items : [];

    if (!codeInput) {
      return NextResponse.json({ valid: false, reason: "CODE_REQUIRED" }, { status: 400 });
    }

    // Find promo definition
    const promo = promoCodes.find((p) => p.code.toUpperCase() === codeInput);
    if (!promo || promo.active === false) {
      return NextResponse.json({ valid: false, reason: "NOT_FOUND_OR_INACTIVE" }, { status: 200 });
    }

    // Date window checks
    const today = nowIsoDateOnly();
    if (promo.startAt && today < promo.startAt) {
      return NextResponse.json({ valid: false, reason: "NOT_STARTED" }, { status: 200 });
    }
    if (promo.endAt && today > promo.endAt) {
      return NextResponse.json({ valid: false, reason: "EXPIRED" }, { status: 200 });
    }

    // Min subtotal rule
    if (promo.minSubtotal && subtotal < promo.minSubtotal) {
      return NextResponse.json({ valid: false, reason: "MIN_SUBTOTAL_NOT_MET", minSubtotal: promo.minSubtotal }, { status: 200 });
    }

    // Load and check usage limits
    const usage = loadUsage();
    const key = codeInput;
    const entry = usage[key] || { used: 0, users: {} };

    if (promo.maxUses != null && entry.used >= promo.maxUses) {
      return NextResponse.json({ valid: false, reason: "MAX_USES_REACHED" }, { status: 200 });
    }

    if (promo.perUserLimit && phone) {
      const userCount = entry.users[phone] || 0;
      if (userCount >= promo.perUserLimit) {
        return NextResponse.json({ valid: false, reason: "PER_USER_LIMIT_REACHED" }, { status: 200 });
      }
    }

    // Eligibility examples (extend as needed)
    if (promo.eligibleCities && promo.eligibleCities.length > 0) {
      const cityNorm = city.toLowerCase();
      const ok = promo.eligibleCities.map((c) => c.toLowerCase()).includes(cityNorm);
      if (!ok) {
        return NextResponse.json({ valid: false, reason: "CITY_NOT_ELIGIBLE" }, { status: 200 });
      }
    }

    // Usage counting will now happen during order completion (redeem endpoint)

    // Normalize the response for frontend
    const response: any = { valid: true, message: "Code promo appliqué." };
    if (promo.type === "percent") {
      response.discountType = "percent";
      response.value = promo.value; // 0.15 for 15%
    } else if (promo.type === "fixed") {
      response.discountType = "fixed";
      response.value = promo.value; // e.g., 50 (MAD)
    } else if (promo.type === "free_shipping") {
      response.discountType = "free_shipping";
      response.value = 0;
    } else {
      // default percent for backward compatibility
      response.discountType = "percent";
      response.value = typeof (promo as any).discount === "number" ? (promo as any).discount : 0;
    }

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Promo validate error:", err);
    return NextResponse.json({ valid: false, reason: "SERVER_ERROR" }, { status: 500 });
  }
}