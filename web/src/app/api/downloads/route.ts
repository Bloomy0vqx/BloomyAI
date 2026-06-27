import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

type ManifestPlatform = {
  id: string;
  name: string;
  file: string;
  hint: string;
  kind: "installer" | "portable";
};

type Manifest = {
  version: string;
  platforms: ManifestPlatform[];
};

async function fileExists(publicPath: string): Promise<boolean> {
  try {
    await readFile(publicPath);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const manifestPath = path.join(process.cwd(), "public", "downloads", "manifest.json");
    const raw = await readFile(manifestPath, "utf-8");
    const manifest: Manifest = JSON.parse(raw);

    const platforms = await Promise.all(
      manifest.platforms.map(async (p) => {
        const filePath = path.join(process.cwd(), "public", "downloads", p.file);
        const exists = await fileExists(filePath);
        const filePathFull = path.join(process.cwd(), "public", "downloads", p.file);
        let size = "";
        if (exists) {
          const { stat } = await import("fs/promises");
          const info = await stat(filePathFull);
          size = `${(info.size / (1024 * 1024)).toFixed(0)} MB`;
        }
        return {
          id: p.id,
          name: p.name,
          fileName: p.file,
          url: exists ? `/downloads/${encodeURIComponent(p.file)}` : "",
          size,
          hint: p.hint,
          kind: p.kind,
          available: exists,
        };
      })
    );

    const availablePlatforms = platforms.filter((p) => p.available);

    return NextResponse.json({
      available: availablePlatforms.length > 0,
      version: manifest.version,
      platforms: availablePlatforms,
      pending: platforms.filter((p) => !p.available).map((p) => p.fileName),
      message:
        availablePlatforms.length === 0
          ? "Desktop installers are not uploaded yet. Place build files in web/public/downloads/ (see README.txt)."
          : undefined,
    });
  } catch (error) {
    console.error("Downloads manifest error:", error);
    return NextResponse.json({
      available: false,
      version: "1.0.0",
      platforms: [],
      message: "Could not load download manifest.",
    });
  }
}
