export const config = (): any => ({
  port: Number(process.env.API_PORT),
  jwtKey: process.env.JWT_KEY,
  jwtExpirationTime: process.env.JWT_EXPIRATIONTIME,
  jwtRenewalTimeDefault: process.env.JWT_RENEWALTIME_DEFAULT,
  jwtRenewalTimeLong: process.env.JWT_RENEWALTIME_LONG,
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
  accountAdminConfig: {
    id: process.env.ACCOUNT_ID,
    username: process.env.ACCOUNT_USERNAME,
    email: process.env.ACCOUNT_EMAIL,
    password: process.env.ACCOUNT_PASSWORD,
    fullname: process.env.ACCOUNT_FULLNAME,
    level: process.env.ACCOUNT_LEVEL,
  }
});
