export const roleOptions = [
  { key: "FACULTY", label: "Faculty" },
  { key: "STAFF", label: "Institute Staff" },
  { key: "HOD", label: "Head of Department" },
  { key: "ASSOCIATE_HOD", label: "Associate HoD" },
  { key: "DEAN", label: "Dean Affairs" },
  { key: "REGISTRAR", label: "Registrar" },
  { key: "DIRECTOR", label: "Director" },
  { key: "ACCOUNTS", label: "Accounts & Finance" },
  { key: "ESTABLISHMENT", label: "Establishment" },
  { key: "ADMIN", label: "Portal Admin" },
] as const;

export type RoleOptionKey = (typeof roleOptions)[number]["key"];
