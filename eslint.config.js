import { eslint } from 'config-aeryle';
import { fileURLToPath } from 'node:url';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default [
  eslint.ignores.base,
  eslint.ignores.env,
  eslint.ignores.svelte,
  ...eslint.ignores.packageManagers,

  ...eslint.prettier,
  ...eslint.typescript,
  ...eslint.imports,
]
