import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Next resolves extensionless local TypeScript imports and @/* aliases.
// Read-only Node checks use the same source files without changing the bundler config.
export async function resolve(specifier, context, nextResolve) {
  let target = specifier;
  if (specifier.startsWith('@/')) {
    target = pathToFileURL(path.resolve(process.cwd(), 'src', specifier.slice(2))).href;
  }
  if (target.endsWith('.json')) {
    const importAttributes = { ...context.importAttributes, type: 'json' };
    return { ...await nextResolve(target, { ...context, importAttributes }), importAttributes };
  }
  try {
    return await nextResolve(target, context);
  } catch (error) {
    const isLocal = target.startsWith('.') || target.startsWith('file://');
    if (error.code !== 'ERR_MODULE_NOT_FOUND' || !isLocal || /\.[a-z]+$/i.test(target)) throw error;
    return nextResolve(`${target}.ts`, context);
  }
}
