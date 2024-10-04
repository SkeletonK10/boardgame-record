export const RoleValues = ["ADMIN", "MAHJONG_RECORD_ADMIN", "USER"];

export type Role = (typeof RoleValues)[number];

export class UserWithRolesDto {
  username!: string;
  nickname!: string;
  roles!: Role[];
}
