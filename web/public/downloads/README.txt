Drop desktop build files here (direct installers, NOT zips):

  Bloomy-AI-Setup-1.0.0.exe       — Windows
  Bloomy-AI-1.0.0-arm64.dmg        — macOS (Apple Silicon)
  Bloomy-AI-1.0.0-x64.AppImage     — Linux
  Bloomy-AI-1.0.0-x64.tar.gz       — Linux (alternative)

After building with desktop-app (npm run build:win / build:mac / build:linux),
copy the files from desktop-app/dist/ into this folder.

Update manifest.json if you change version or filenames.

Old bloomy-desktop*.zip files are deprecated — delete them.
