import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'node_modules/next/dist/build/index.js');
if (fs.existsSync(target)) {
  let content = fs.readFileSync(target, 'utf8');
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
    fs.writeFileSync(target, content, 'utf8');
    console.log('✓ Patched Next.js proxy build race condition in node_modules/next/dist/build/index.js');
  }
}
