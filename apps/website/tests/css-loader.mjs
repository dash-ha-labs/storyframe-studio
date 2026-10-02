export async function load(url, context, nextLoad) {
  if (url.includes('?url')) return {format:'module',shortCircuit:true,source:'export default "/test-asset";'};
  if (url.endsWith('.css') || url.includes('.css')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default {};',
    };
  }
  return nextLoad(url, context);
}
