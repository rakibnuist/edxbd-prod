import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'node_modules/next/dist/build/index.js');
if (fs.existsSync(target)) {
  let content = fs.readFileSync(target, 'utf8');
  let changed = false;

  // 1. Patch proxy rename race to copyFile so both proxy.js and middleware.js remain available
  const proxyRenameTarget = "await _fs.promises.rename(_path.default.join(distDir, _constants1.SERVER_DIRECTORY, 'proxy.js.nft.json')";
  if (content.includes(proxyRenameTarget)) {
    content = content
      .replace(
        "await _fs.promises.rename(_path.default.join(distDir, _constants1.SERVER_DIRECTORY, 'proxy.js'),",
        "await _fs.promises.copyFile(_path.default.join(distDir, _constants1.SERVER_DIRECTORY, 'proxy.js'),",
      )
      .replace(
        "await _fs.promises.rename(_path.default.join(distDir, _constants1.SERVER_DIRECTORY, 'proxy.js.nft.json'),",
        "await _fs.promises.copyFile(_path.default.join(distDir, _constants1.SERVER_DIRECTORY, 'proxy.js.nft.json'),",
      );
    changed = true;
  }

  // 2. Ensure writeFileUtf8 creates parent directories recursively so _ssgManifest.js and other manifests never throw ENOENT
  const writeFileTarget = "async function writeFileUtf8(filePath, content) {\n    await _fs.promises.writeFile(filePath, content, 'utf-8');\n}";
  const writeFileReplacement = "async function writeFileUtf8(filePath, content) {\n    await _fs.promises.mkdir(_path.default.dirname(filePath), { recursive: true });\n    await _fs.promises.writeFile(filePath, content, 'utf-8');\n}";
  if (content.includes(writeFileTarget)) {
    content = content.replace(writeFileTarget, writeFileReplacement);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(target, content, 'utf8');
    console.log('✓ Patched Next.js proxy and writeFileUtf8 mkdir in node_modules/next/dist/build/index.js');
  }
}
