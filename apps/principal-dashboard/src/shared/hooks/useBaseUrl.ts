
function useBaseUrl() {
  return {
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL_API!}`
  }
}

export default useBaseUrl;