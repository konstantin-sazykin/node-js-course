export const cookieParse = (cookies: string[]) => {
  const res: { [key: string]: string } = {};

  cookies.forEach((str) => {
    const cookie = decodeURIComponent(str.split(';')[0]).split('=');
    const cookieName = cookie[0];
    const cookieValue = cookie[1];

    res[cookieName] = cookieValue;
  });

  return res;
};
