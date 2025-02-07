import { prettier } from 'config-aeryle'

/** @type {import('prettier').Config} */
export default {
  ...prettier.config,

  plugins: ['prettier-plugin-tailwindcss'],
}
