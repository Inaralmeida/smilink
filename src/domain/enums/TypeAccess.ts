export const TYPE_ACCESS = {
  admin: "admin",
  paciente: "paciente",
  profissional: "profissional",
};

export type TypeAccess = keyof typeof TYPE_ACCESS;
