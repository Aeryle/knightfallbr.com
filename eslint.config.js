import { eslint } from 'config-aeryle'
import { createNodeResolver } from 'eslint-plugin-import-x'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'

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
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver(), createNodeResolver()],
    },
    rules: {
      'import-x/no-unresolved': 'off',
    },
  },
]
