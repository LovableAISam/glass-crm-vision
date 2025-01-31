import { useRouter } from "next/router";
import { UrlObject } from "url";

const PREFIX = '[coName]';
const TRAILING_PREFIX = '/[coName]';

function useRouterWithPrefix() {
  const router = useRouter();
  const { route, asPath } = router;
  const coName = asPath.split('/')
    .filter(url => url)
    .shift() as string || 'co';
  const formattedRoute = route.replace(PREFIX, coName);
  const replacePrefix = formattedRoute.split('/').filter(url => url).shift() as string;
  const prefixText = replacePrefix !== '404' ? replacePrefix : coName;

  const getRoute = (_route: string) => {
    return _route.replace(PREFIX, prefixText);
  };

  const getRouteWithoutPrefix = (_route: string) => {
    return _route.replace(TRAILING_PREFIX, '');
  };

  const generateRoute = (_route: string) => {
    return `/${prefixText}${_route}`;
  };

  const onNavigate = (url?: UrlObject | string) => {
    if (typeof url === 'string') {
      router.push(`/${prefixText}${url}`);
      return;
    }
    router.push({
      ...url,
      pathname: `/${prefixText}${url?.pathname}`,
    });
  };

  return { prefix: PREFIX, prefixText, coName, onNavigate, getRoute, getRouteWithoutPrefix, generateRoute };
}

export default useRouterWithPrefix;