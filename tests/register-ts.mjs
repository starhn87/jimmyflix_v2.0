import { registerHooks } from 'node:module'

// Resolve the same source aliases as tsconfig without compiling or mocking helpers.
registerHooks({
  resolve(specifier, context, nextResolve) {
    // Tests run on Node; allow server modules while retaining production guards.
    if (specifier === 'server-only') return { url: 'data:text/javascript,export {}', shortCircuit: true }
    if (specifier.startsWith('@/')) {
      return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context)
    }
    return nextResolve(specifier, context)
  },
})
