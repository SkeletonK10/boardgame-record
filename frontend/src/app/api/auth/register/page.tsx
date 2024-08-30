"use client";
import { api } from "@/lib/axiosInterceptor";
import { text } from "@/lib/data";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
      nickname: { value: string };
    };
    const username = target.username.value;
    const password = target.password.value;
    const nickname = target.nickname.value;

    const response = await api.post(`/user`, {
      username,
      password,
      nickname,
    });

    const data = response.data;
    if (data) {
      alert(`회원가입 성공!`);
      router.push(`/api/auth/signin`);
    } else {
      alert(`알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.`);
    }
  };

  return (
    <Box>
      <h2>{text.register.title}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디</label>
          <input type="text" name="username"></input>
        </div>
        <div>
          <label>비밀번호</label>
          <input type="password" name="password"></input>
        </div>
        <div>
          <label>닉네임</label>
          <input type="text" name="nickname"></input>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </Box>
  );
}
