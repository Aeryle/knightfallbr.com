export const rgbToHex = (color: string) => {
  const colors = color.startsWith('#')
    ? color.replace('#', '').split(/.{2}/g)
    : color.replace('rgb(', '').replace(')', '').split(', ')

  return colors.map(color => parseInt(color).toString(16).padStart(2, '0'))
}

const convertedFontSizes = {
  '1rem': '50%',
  '2rem': '100%',
  '3rem': '200%',
} as const
export const validEmojis = [
  '😊',
  '😋',
  '😍',
  '😎',
  '😀',
  '😄',
  '😂',
  '😃',
  '😃',
  '😄',
  '😅',
  '😩',
  '😜',
  '❓',
  '🤣',
  '🙂',
  '☹️',
  '☹️',
] as const

export const wrapColor = (content: string, color: string) => {
  const [r, g, b, a = 'ff'] = rgbToHex(color)

  return `<color=#${r}${g}${b}${a}>${content}</color>`
}
export const wrapFontSize = (content: string, size: keyof typeof convertedFontSizes) =>
  `<size=${convertedFontSizes[size]}>${content}</size>`

export const wrapBold = (content: string) => `<b>${content}</b>`
export const wrapItalic = (content: string) => `<i>${content}</i>`
export const wrapStrike = (content: string) => `<s>${content}</s>`
export const wrapUnderline = (content: string) => `<u>${content}</u>`
export const wrapCode = (content: string) => `<mspace>${content}</mspace>`
export const wrapSubscript = (content: string) => `<sub>${content}</sub>`
export const wrapSuperscript = (content: string) => `<sup>${content}</sup>`
export const wrapEmoji = (content: (typeof validEmojis)[number]) =>
  `<sprite=${validEmojis.findIndex(emoji => emoji === content)}>`
export const stripNewLines = (content: string) =>
  content //
    .replaceAll('<p></p>', '')
    .replaceAll('<br>', '')
    .replaceAll('<br/>', '')
