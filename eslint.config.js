import { eslint } from 'config-aeryle'

export default [
  eslint.ignores.base,
  eslint.ignores.env,
  eslint.ignores.svelte,
  ...eslint.ignores.packageManagers,

  ...eslint.prettier,
  ...eslint.typescript,
  ...eslint.imports,
]
