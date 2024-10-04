export const Role = {
  ADMIN: "ADMIN",
  MAHJONG_RECORD_ADMIN: "MAHJONG_RECORD_ADMIN",
  USER: "USER",
} as const;

export type RoleType = keyof typeof Role;

export class UserWithRolesDto {
  username!: string;
  nickname!: string;
  roles!: RoleType[];
}
