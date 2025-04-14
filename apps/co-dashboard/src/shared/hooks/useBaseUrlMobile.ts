import { useCommunityOwner } from "../context/CommunityOwnerContext";

function useBaseMobileUrl() {
  const { coName } = useCommunityOwner();
  
  return {
    baseMobileUrl: `${process.env.NEXT_PUBLIC_BASE_URL_API_MOBILE!}/${coName}`
  }
}

export default useBaseMobileUrl;