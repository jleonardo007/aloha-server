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
});
