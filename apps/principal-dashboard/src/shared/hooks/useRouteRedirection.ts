import { useRouter } from "next/router";
import { UrlObject } from "url";

function useRouteRedirection() {
  const router = useRouter();

  const onNavigate = (url?: UrlObject | string) => {
    if (typeof url === 'string') {
      router.push(`${url}`);
      return;
    }
    router.push({
      ...url,
      pathname: `${url?.pathname}`,
    });
  }

  const generateRoute = (route: string) => {
    return route;
  }

  return { onNavigate, generateRoute }
}

export default useRouteRedirection;