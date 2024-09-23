import { useRouter } from "next/router";
import { UrlObject } from "url";

const PREFIX = '[coName]';
const TRAILING_PREFIX = '/[coName]';

function useRouterWithPrefix() {
  const router = useRouter();
  const { route, query } = router;
  const coName = query.coName as string || 'co';
  const formattedRoute = route.replace(PREFIX, coName);
  const prefixText = formattedRoute.split('/').filter(url => url).shift() as string;

  const getRoute = (_route: string) => {
    return _route.replace(PREFIX, prefixText);
  };

  const getRouteWithoutPrefix = (_route: string) => {
    return _route.replace(TRAILING_PREFIX, '');
  };

  const generateRoute = (_route: string) => {
    return `/${prefixText}${_route}`;
  };

  const onNavigate = (url: string) => {
    router.push(`/${prefixText}${url}`);
  };

  return { prefix: PREFIX, prefixText, coName, onNavigate, getRoute, getRouteWithoutPrefix, generateRoute };
}

export default useRouterWithPrefix;