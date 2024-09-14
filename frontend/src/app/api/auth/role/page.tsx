"use client";
import { text } from "@/lib/data";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { fetchUsers, grantRole } from "./actions";
import { useFormState } from "react-dom";
import { useSnackbar } from "notistack";
import { useEffect, useState, useTransition } from "react";
import { UserWithRolesDto } from "./dto";

const initialState = {
  message: "",
};

export default function MahjongAddRecordPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [formState, formAction] = useFormState(grantRole, initialState);
  const [users, setUsers] = useState<UserWithRolesDto[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => await setUsers(await fetchUsers()));
  }, []);

  useEffect(() => {
    if (formState.message === text.auth.manageRole.success) {
      enqueueSnackbar(formState.message, { variant: "success" });
      router.refresh();
    } else if (formState.message === text.auth.manageRole.error) {
      enqueueSnackbar(formState.message, { variant: "error" });
    }
  }, [formState]);
  return (
    <Box>
      <h2>{text.auth.manageRole.title}</h2>
      <form action={formAction}>
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
