
const sessions = {};

const createSession = (req) => {
  const name = req.bodyParams.get('name');
  const time = new Date();
  const id = time.getTime();

  const session = { name, id, time };
  sessions[id] = session;
  return session;
};

const injectSession = (req, res, next) => {
  const { id } = req.cookies;
  if (!id) {
    return next();
  }
  req.session = sessions[id];
  return next();
};

const cookieParser = (cookie) => {
  const cookies = {};
  if (!cookie) {
    return cookies;
  }
  cookie.split(';').forEach(cookieString => {
    const [name, value] = cookieString.split('=');
    cookies[name.trim()] = value.trim();
  });
  return cookies;
};

const setCookie = (res, id) => {
  res.setHeader('set-cookie', 'id=' + id);
  return true;
};

const injectCookies = (req, res, next) => {
  req.cookies = cookieParser(req.headers.cookie);
  return next();
};

module.exports = {
  injectSession, injectCookies, setCookie, sessions, createSession
};
