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

  // 2. Pre-create _ssgManifest.js as soon as buildId is obtained so async NFT tracing never hits ENOENT
  const buildIdTarget = "_buildcontext.NextBuildContext.buildId = buildId;";
  const ssgPrecreateCode = `_buildcontext.NextBuildContext.buildId = buildId;
            try {
                const _initSsgDir = _path.default.join(distDir, _constants1.CLIENT_STATIC_FILES_PATH, buildId);
                await _fs.promises.mkdir(_initSsgDir, { recursive: true });
                await _fs.promises.writeFile(_path.default.join(_initSsgDir, '_ssgManifest.js'), 'self.__SSG_MANIFEST=[];self.__SSG_MANIFEST_CB&&self.__SSG_MANIFEST_CB()', 'utf8');
            } catch (_) {}`;

  if (content.includes(buildIdTarget) && !content.includes('_initSsgDir')) {
    content = content.replace(buildIdTarget, ssgPrecreateCode);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(target, content, 'utf8');
    console.log('✓ Patched Next.js proxy and SSG manifest race conditions in node_modules/next/dist/build/index.js');
  }
}
