export const ENV = {
  SERVER_GRAPH_URL: process.env.SERVER_GRAPH_URL || 'http://localhost:3000',
};

export const SERVER_ONLY_ENV = {
  IRON_OPTIONS: {
    cookieName: process.env.SESSION_COOKIE_NAME || 'SESSION_COOKIE',
    password: process.env.SESSION_COOKIE_PASSWORD || 'Complex_Password_At_Least_32_Characters_Long',
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },
}