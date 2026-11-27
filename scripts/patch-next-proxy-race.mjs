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

  // 2. Ensure writeFileUtf8 creates parent directories recursively so manifests never throw ENOENT
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

// 3. Patch copyTracedFiles in utils.js to tolerate missing static/manifest assets during standalone packaging
const utilsTarget = path.join(process.cwd(), 'node_modules/next/dist/build/utils.js');
if (fs.existsSync(utilsTarget)) {
  let utilsContent = fs.readFileSync(utilsTarget, 'utf8');
  let utilsChanged = false;

  const copyTracedTarget = "await _fs.promises.copyFile(tracedFilePath, fileOutputPath);";
  const copyTracedReplacement = "await _fs.promises.copyFile(tracedFilePath, fileOutputPath).catch((err) => { if (err.code !== 'ENOENT') throw err; });";

  if (utilsContent.includes(copyTracedTarget)) {
    utilsContent = utilsContent.replaceAll(copyTracedTarget, copyTracedReplacement);
    utilsChanged = true;
  }

  const copyOriginalTarget = "await _fs.promises.copyFile(originalPath, fileOutputPath);";
  const copyOriginalReplacement = "await _fs.promises.copyFile(originalPath, fileOutputPath).catch((err) => { if (err.code !== 'ENOENT') throw err; });";

  if (utilsContent.includes(copyOriginalTarget)) {
    utilsContent = utilsContent.replaceAll(copyOriginalTarget, copyOriginalReplacement);
    utilsChanged = true;
  }

  // 4. Patch next-server.js.nft.json trace loading race condition in writeStandaloneDirectory
  const nextServerTraceTarget = "await handleTraceFiles(_path.default.join(distDir, 'next-server.js.nft.json'));";
  const nextServerTraceReplacement = "await handleTraceFiles(_path.default.join(distDir, 'next-server.js.nft.json')).catch(async (err) => { if (err.code === 'ENOENT') { await new Promise((r) => setTimeout(r, 1000)); await handleTraceFiles(_path.default.join(distDir, 'next-server.js.nft.json')).catch((e) => { if (e.code !== 'ENOENT') throw e; }); return; } throw err; });";

  if (utilsContent.includes(nextServerTraceTarget)) {
    utilsContent = utilsContent.replace(nextServerTraceTarget, nextServerTraceReplacement);
    utilsChanged = true;
  }

  if (utilsChanged) {
    fs.writeFileSync(utilsTarget, utilsContent, 'utf8');
    console.log('✓ Patched Next.js copyTracedFiles ENOENT tolerance in node_modules/next/dist/build/utils.js');
  }
}
