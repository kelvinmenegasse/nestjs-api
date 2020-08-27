export const config = (): any => ({
  port: Number(process.env.PORT),
  jwtKey: process.env.JWT_KEY,
  jwtExpirationTime: process.env.JWT_EXPIRATIONTIME,
  jwtRenewalTime: process.env.JWT_RENEWALTIME,
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true,
  },
});
