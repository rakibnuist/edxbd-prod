// Next resolves extensionless local TypeScript imports. Read-only Node checks
// use the same source files without changing the application's bundler config.
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.json')) {
    const importAttributes = { ...context.importAttributes, type: 'json' };
    return { ...await nextResolve(specifier, { ...context, importAttributes }), importAttributes };
  }
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND' || !specifier.startsWith('.') || /\.[a-z]+$/i.test(specifier)) throw error;
    return nextResolve(`${specifier}.ts`, context);
  }
}
