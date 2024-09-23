import Cookies from 'js-cookie';

const getCookie = async (cookiename: string, cookiestring: string) => {
  var name = cookiename + '=';
  var decodedCookie = decodeURIComponent(cookiestring);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

const getClientCookie = (cookiename: string) => {
  return Cookies.get(cookiename);
};

const setCookie = (cookiename: string, cookievalue: any) => {
  Cookies.set(cookiename, cookievalue, { expires: 365 });
};

const removeCookie = (cookiename: string) => {
  Cookies.remove(cookiename);
};

export default {
  getServer: getCookie,
  get: getClientCookie,
  set: setCookie,
  remove: removeCookie,
};