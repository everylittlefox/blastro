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
