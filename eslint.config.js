import { eslint } from 'config-aeryle'

/** @type {import('eslint').Linter.Config} */
export default [
  eslint.ignores.base,
  eslint.ignores.env,
  eslint.ignores.svelte,
  ...eslint.ignores.packageManagers,

  ...eslint.prettier,
  ...eslint.typescript,
  ...eslint.imports,

  {
    rules: {
      'import-x/no-unresolved': 'off',
    },
  },
]
