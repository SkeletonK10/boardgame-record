"use client";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { text } from "@/lib/data";
import { useSnackbar } from "notistack";
import { Role, RoleType } from "@/types/auth";

export default function ManageSeasonButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const handleClick = () => {
    const requiredRoles: RoleType[] = [Role.ADMIN, Role.MAHJONG_RECORD_ADMIN];

    if (!session?.user) {
      enqueueSnackbar(text.error.noSession, { variant: "error" });
      return;
    }
    const roles = (session?.user as any).roles;

    const intersect = roles.filter((role: RoleType) => {
      return requiredRoles.includes(role);
    });
    if (intersect.length === 0) {
      enqueueSnackbar(text.error.noRole, { variant: "error" });
    } else router.push("/mahjong/manage-season");
  };
  return (
    <Button
      variant="contained"
      color="error"
      sx={{
        width: "100%",
        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
      }}
      onClick={handleClick}
    >
      {text.mahjong.manageSeason.title}
    </Button>
  );
}
