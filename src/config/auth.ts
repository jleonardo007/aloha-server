export default () => ({
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    accessTokenExp: process.env.JWT_ACCESS_TOKEN_EXP,
    refreshTokenExp: process.env.JWT_REFRESH_TOKEN_EXP,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
  encrypt: {
    saltRounds: parseInt(process.env.ENCRYPT_SALT),
  },
  cookie: {
    domain: process.env.COOKIE_DOMAIN,
    sameSite: process.env.COOKIE_SAME_SITE,
    maxAge: parseInt(process.env.COOKIE_MAX_AGE) * 365, //1 year
    secure: process.env.NODE_ENV === 'development' ? false : true,
    httpOnly: true,
    name: process.env.COOKIE_NAME,
  },
});
