import { text } from "@/lib/data";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <h2>{text.register.title}</h2>
      <form>
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
