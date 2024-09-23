
function constructFormData(payload: any): FormData {
  const formData = new FormData();
  if (payload) {
    for (const [key, value] of Object.entries(payload)) {
      // @ts-ignore
      if (value) formData.append(key, value);
    }
  }
  return formData;
}

export default constructFormData;