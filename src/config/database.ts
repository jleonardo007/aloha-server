export default () => ({
  database: {
    host: parseInt(process.env.DB_HOST, 10),
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
});
