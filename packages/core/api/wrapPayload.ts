
function wrapPayload(
  payloadData?: Object,
  filePayload?: { [key: string]: File },
) {
  const mainRequestPayload = payloadData || {}

  if (!filePayload) {
    return mainRequestPayload;
  }

  const formData = new FormData();
  formData.append('main-request', JSON.stringify(mainRequestPayload));

  for (const key in filePayload) {
    if (filePayload.hasOwnProperty(key)) {
      const file = filePayload[key];
      formData.append(`data.${key}`, file, file.name);
    }
  }

  return formData;
}

export default wrapPayload;
