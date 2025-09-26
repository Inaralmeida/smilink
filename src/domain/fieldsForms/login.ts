export const LOGIN_FIELDS = {
  email: "email",
  password: "password",
} as const;

export type TLoginFields = keyof typeof LOGIN_FIELDS;
