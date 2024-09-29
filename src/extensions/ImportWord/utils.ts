export function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64.split(',')[1])
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}
// 将 Blob 转换成 File 对象
export function blobToFile(blob, fileName) {
  return new File([blob], fileName, { type: blob.type })
}
