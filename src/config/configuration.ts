export default () => ({
  nodeEnv: process.env.NODE_ENV,

  port: parseInt(process.env.PORT || String(7000), 10) || 7000,

  dbUser: process.env.DB_USER as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
  dbPort: parseInt(process.env.DB_PORT as string),
  dbHost: process.env.DB_HOST as string,

  redisPassword: process.env.REDIS_PASSWORD || undefined,

  redisUserName: process.env.REDIS_USERNAME,

  redisHost: process.env.REDIS_HOST,

  redisDB: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,

  redisPort: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,

  tokenExpiration: process.env.JWT_EXPIRATION || "999d",

  jwtSecret: process.env.JWT_SECRET || "jwtSecret11546584894dfgedsfaqrwgqwgqw8t7281489112452",

  emailHost: process.env.EMAIL_HOST,

  emailPort: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465,

  emailUserName: process.env.EMAIL_USERNAME,

  emailPassword: process.env.EMAIL_PASSWORD,

  frontEnd: process.env.FRONT_END,

  loginAttempt: {
    maxFailureLoginAttempts: parseInt(process.env.MAX_FAILURE_LOGIN_ATTEMPTS || "3"),

    maxFailureLoginAttemptsBlockHours: parseInt(process.env.MAX_FAILURE_LOGIN_ATTEMPTS_BLOCK_HOURS || "1"),
  },

  s3: {
    bucketName: process.env.S3_BUCKET,
    accessKey: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    region: process.env.S3_REGION,
    isMinIO: process.env.S3_MINIO === "true" ? true : false,
    endpoint: process.env.S3_END_POINT,
  },
  optValidTo: parseInt(process.env.OTP_MINUTES || "5"),
  firstAdminEmail: process.env.FIRST_ADMIN_EMAIL,
  firstAdminPassword: process.env.FIRST_ADMIN_PASSWORD,
  firstAdminUsername: process.env.FIRST_ADMIN_USERNAME,
});
