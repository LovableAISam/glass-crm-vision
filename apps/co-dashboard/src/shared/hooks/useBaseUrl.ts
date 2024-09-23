import { useCommunityOwner } from "../context/CommunityOwnerContext";

function useBaseUrl() {
  const { coName } = useCommunityOwner();
  
  return {
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL_API!}/${coName}`
  }
}

export default useBaseUrl;