export const pick = (obj: any, keys: string[]): any =>
  keys.reduce((acc, k) => ({ ...acc, [k]: obj[k] }), {})

let keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

// from react-native-base64
export const decodeBase64 = (input: string) => {
  let output = ''
  let chr1, chr2, chr3
  let enc1, enc2, enc3, enc4
  let i = 0

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  var base64test = /[^A-Za-z0-9\+\/\=]/g
  input = input.replace(base64test, '')

  do {
    enc1 = keyStr.indexOf(input.charAt(i++))
    enc2 = keyStr.indexOf(input.charAt(i++))
    enc3 = keyStr.indexOf(input.charAt(i++))
    enc4 = keyStr.indexOf(input.charAt(i++))

    chr1 = (enc1 << 2) | (enc2 >> 4)
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
    chr3 = ((enc3 & 3) << 6) | enc4

    output = output + String.fromCharCode(chr1)

    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2)
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3)
    }

    chr1 = chr2 = chr3 = ''
    enc1 = enc2 = enc3 = enc4 = ''
  } while (i < input.length)

  return output
}

export const parseMarkdown = (
  m: string
): { content: string; frontmatter: Record<string, string> } => {
  let frontmatter = new Map<string, string>()
  const frontmatterRegex = /^---([\w\W\n]*)---/
  const matchFrontmatter = m.match(frontmatterRegex)

  if (matchFrontmatter) {
    matchFrontmatter[1]
      .split('\n')
      .filter(Boolean)
      .forEach((propLine) => {
        const prop = propLine.split(':').map((part) => part.trim())

        frontmatter.set(prop[0], prop[1])
      })
  }

  return {
    content: m.replace(frontmatterRegex, '').trim(),
    frontmatter: [...frontmatter.entries()].reduce(
      (acc, [key, val]) => ({ ...acc, [key]: val }),
      {}
    )
  }
}

const MONTHS_LIST =
  'January, February, March, April, May, June, July, August, September, October, November, December'

export const formatDate = (date: Date, mode: 'compact' | 'normal' = 'normal') => {
  const months = MONTHS_LIST.split(', ')
  let month = months[date.getMonth()]
  const day = date.getDate()
  let year = date.getFullYear()

  if (mode === 'compact') {
    month = month.substring(0,3)
    year = year % 100
  }

  return `${month} ${day}, ${year}`
}
