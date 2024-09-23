
const getExtensionByUrl = (docUrl: string): string => {
  try {
    return docUrl.split('?').shift()?.split('/')?.pop()?.split('.')?.slice(-1)?.[0] || '';
  } catch {
    return '';
  }
}

const getFileNameByUrl = (docUrl?: string): string => {
  try {
    return docUrl?.split('?').shift()?.split('/')?.pop() || '';
  } catch {
    return '';
  }
}

export default {
  getExtensionByUrl,
  getFileNameByUrl,
}