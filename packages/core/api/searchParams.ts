
function searchParamsSpec (payload: any): URLSearchParams {
  const params = new URLSearchParams();
  if (payload) {
    for (const [key, value] of Object.entries(payload)) {
      // @ts-ignore
      if (value) params.append(key, value);
    }
  }
  return params;
}

export default searchParamsSpec;