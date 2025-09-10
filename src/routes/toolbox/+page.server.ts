import { stripNewLines } from '$lib/flowbite/utils.js'

export const load = ({ url }) => {
  const content = url.searchParams.get('nickname') ?? ''

  try {
    return { content: stripNewLines(atob(content).trim()) }
  } catch {
    return { content: '' }
  }
}
