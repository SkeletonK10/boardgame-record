"use client";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Role, text } from "../../lib/data";
import { useSnackbar } from "notistack";

export function AddButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const handleClick = () => {
    const requiredRoles = [Role.mahjongRecordAdmin, Role.admin];
    const roles = (session?.user as any).roles;
    console.log(session);
    console.log(roles);
    if (!roles) {
      enqueueSnackbar(text.error.noSession, { variant: "error" });
      return;
    }
    const intersect = roles.filter((role: Role) => {
      return requiredRoles.includes(role);
    });
    if (intersect.length === 0) {
      enqueueSnackbar(text.error.noRole, { variant: "error" });
    } else router.push("/mahjong/add-record");
  };
  return (
    <Button
      variant="contained"
      sx={{
        width: "100%",
        marginTop: "1rem",
        marginBottom: "1rem",
        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
      }}
      onClick={handleClick}
    >
      기록 추가하기
    </Button>
  );
}
