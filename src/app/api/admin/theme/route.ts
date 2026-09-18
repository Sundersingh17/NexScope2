import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Only these keys are ever accepted into a preset's `colors` JSON. This is
// the enforcement point for "accent colors only, never layout" — it's what
// keeps a visitor-facing theme swap from ever being able to break the page,
// no matter what an admin (or a bug) sends through this route.
const ALLOWED_COLOR_KEYS = ["cream", "paper", "ink", "ink-soft", "orange", "yellow", "gray"];

// Must match the FONT_PAIRS slugs in theme-switcher.tsx / admin ThemeManager.
// Kept as an allowlist so a bad request can never set an arbitrary font
// string that doesn't correspond to a font actually preloaded in layout.tsx.
const ALLOWED_FONT_PAIRS = ["grotesk-archivo", "fraunces-inter", "syne-manrope"];
const ALLOWED_DESIGNS = ["signature", "sharp", "soft"];
const ALLOWED_MOODS = ["none", "noir", "vivid"];

function sanitizeFontPair(input: unknown): string {
  return typeof input === "string" && ALLOWED_FONT_PAIRS.includes(input) ? input : "grotesk-archivo";
}

function sanitizeDesign(input: unknown): string {
  return typeof input === "string" && ALLOWED_DESIGNS.includes(input) ? input : "signature";
}

function sanitizeMood(input: unknown): string {
  return typeof input === "string" && ALLOWED_MOODS.includes(input) ? input : "none";
}

function sanitizeColors(input: unknown): string {
  if (!input || typeof input !== "object") {
    throw new Error("colors must be an object");
  }
  const out: Record<string, string> = {};
  for (const key of ALLOWED_COLOR_KEYS) {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value === "string" && /^#[0-9a-fA-F]{3,8}$/.test(value)) {
      out[key] = value;
    }
  }
  if (Object.keys(out).length === 0) {
    throw new Error("colors must include at least one valid hex value for a known key");
  }
  return JSON.stringify(out);
}

export async function GET(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const presets = await prisma.themePreset.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({
      presets: presets.map((p) => ({ ...p, colors: JSON.parse(p.colors) })),
    });
  } catch (error) {
    console.error("Error fetching theme presets:", error);
    return NextResponse.json({ presets: [] });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, name, colors, fontPair, design, mood, isDefault, order, published } = body;

    if (!slug || !name) {
      return NextResponse.json({ message: "Slug and name are required" }, { status: 400 });
    }

    let colorsJson: string;
    try {
      colorsJson = sanitizeColors(colors);
    } catch (e) {
      return NextResponse.json({ message: (e as Error).message }, { status: 400 });
    }

    if (isDefault) {
      // Only one preset can be the default the site loads for new visitors.
      await prisma.themePreset.updateMany({ data: { isDefault: false } });
    }

    const preset = await prisma.themePreset.create({
      data: {
        slug,
        name,
        colors: colorsJson,
        fontPair: sanitizeFontPair(fontPair),
        design: sanitizeDesign(design),
        mood: sanitizeMood(mood),
        isDefault: !!isDefault,
        order: typeof order === "number" ? order : 0,
        published: published ?? true,
      },
    });

    return NextResponse.json({ preset, message: "Created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating theme preset:", error);
    return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, slug, name, colors, fontPair, design, mood, isDefault, order, published } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    let colorsJson: string;
    try {
      colorsJson = sanitizeColors(colors);
    } catch (e) {
      return NextResponse.json({ message: (e as Error).message }, { status: 400 });
    }

    if (isDefault) {
      await prisma.themePreset.updateMany({ data: { isDefault: false } });
    }

    const preset = await prisma.themePreset.update({
      where: { id },
      data: {
        slug,
        name,
        colors: colorsJson,
        fontPair: sanitizeFontPair(fontPair),
        design: sanitizeDesign(design),
        mood: sanitizeMood(mood),
        isDefault: !!isDefault,
        order: typeof order === "number" ? order : 0,
        published: published ?? true,
      },
    });

    return NextResponse.json({ preset, message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating theme preset:", error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    await prisma.themePreset.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting theme preset:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}
