import { Role } from "@/lib/data";

export class UserWithRolesDto {
  username!: string;
  nickname!: string;
  roles!: Role[];
}
