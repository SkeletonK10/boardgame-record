import axios from "axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;
        console.log("POST /auth/signin");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`,
          {
            username,
            password,
          }
        );
        const data = (response.data as any).data;
        if (data) {
          cookies().set("refresh", data.refresh);
          return {
            id: data.id,
            name: data.username,
            token: data.access,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // 세션에 토큰 정보를 추가합니다.
      session.user = token as any;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 10,
  },
});

export { handler as GET, handler as POST };
