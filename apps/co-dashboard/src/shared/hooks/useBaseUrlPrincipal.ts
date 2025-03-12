function useBaseUrlPrincipal() {
  return {
    baseUrlPrincipal: `${process.env.NEXT_PUBLIC_BASE_URL_API!}`
  };
}

export default useBaseUrlPrincipal;