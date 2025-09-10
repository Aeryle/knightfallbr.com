export const rgbToHex = (rgb: string) => {
  return rgb
    .replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(color => parseInt(color))
    .map(color => color.toString(16))
}

export const wrapColor = (content: string, color: string) => `<color=#${color.replace('#', '')}ff>${content}</color>`

const convertedFontSizes = {
  '1rem': '-1',
  '2rem': '100%',
  '3rem': '+1',
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
