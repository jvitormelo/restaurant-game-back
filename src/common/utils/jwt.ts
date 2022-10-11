// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require("jsonwebtoken");

export const validateToken = (token: string) => {
  const decoded = jwt.verify(token, "secret");
  return decoded;
};

export const generateToken = (value: Record<string, unknown>) => {
  const token = jwt.sign(value, "secret");
  return token;
};
