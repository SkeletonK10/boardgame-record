"use client";
import { text } from "@/lib/data";
import { Box } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const username = target.username.value;
    const password = target.password.value;

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (result?.error) {
      if (result.error === "CredentialsSignin")
        alert(`아이디 또는 비밀번호가 다릅니다. 다시 시도해 주세요.`);
      else
        alert(
          `알 수 없는 오류가 발생했습니다. 관리자에게 문의해 주세요.(로그인)`
        );
      router.refresh();
    } else {
      router.push(`/`);
    }
  };

  return (
    <Box>
      <h2>{text.signIn.title}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디</label>
          <input type="text" id="username" name="username"></input>
        </div>
        <div>
          <label>비밀번호</label>
          <input type="password" id="password" name="password"></input>
        </div>
        <button type="submit">로그인</button>
      </form>
    </Box>
  );
}
