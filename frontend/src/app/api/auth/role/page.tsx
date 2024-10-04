"use client";
import { text } from "@/lib/data";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { depriveRole, fetchUsers, grantRole } from "./actions";
import { useFormState } from "react-dom";
import { useSnackbar } from "notistack";
import { useEffect, useState, useTransition } from "react";
import { UserWithRolesDto } from "@/types/auth";

const initialState = {
  message: "",
};

export default function MahjongAddRecordPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [grantState, grantFormAction] = useFormState(grantRole, initialState);
  const [depriveState, depriveFormAction] = useFormState(
    depriveRole,
    initialState
  );
  const [users, setUsers] = useState<UserWithRolesDto[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => await setUsers(await fetchUsers()));
  }, []);

  useEffect(() => {
    if (grantState.message === text.auth.manageRole.successToGrant) {
      enqueueSnackbar(grantState.message, { variant: "success" });
      router.refresh();
    } else if (grantState.message === text.auth.manageRole.error) {
      enqueueSnackbar(grantState.message, { variant: "error" });
    }
  }, [grantState, enqueueSnackbar, router]);

  useEffect(() => {
    if (depriveState.message === text.auth.manageRole.successToDeprive) {
      enqueueSnackbar(depriveState.message, { variant: "success" });
      router.refresh();
    } else if (depriveState.message === text.auth.manageRole.error) {
      enqueueSnackbar(depriveState.message, { variant: "error" });
    }
  }, [depriveState, enqueueSnackbar, router]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2>{text.auth.manageRole.title}</h2>
      <Box>
        <form action={grantFormAction}>
          <div>
            <label>username</label>
            <input type="text" id="username" name="username"></input>
          </div>
          <div>
            <label>role</label>
            <input type="text" id="role" name="role"></input>
          </div>
          <button type="submit">추가</button>
        </form>
        <form action={depriveFormAction}>
          <div>
            <label>username</label>
            <input type="text" id="username" name="username"></input>
          </div>
          <div>
            <label>role</label>
            <input type="text" id="role" name="role"></input>
          </div>
          <button type="submit">제거</button>
        </form>
      </Box>
      <Box>
        유저 역할 목록
        {users.map(({ username, nickname, roles }) => (
          <Box key={username}>
            {`${nickname}(${username})`}
            {roles.map((role) => (
              <Box key={`${username}${role}`}>{` ${role} `}</Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
