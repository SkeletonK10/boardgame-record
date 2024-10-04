import { api } from "@/lib/axiosInterceptor";
import { RoleType } from "@/types/auth";
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
        const response = await api.post(`/auth/signin`, {
          username,
          password,
        });
        const data = (response.data as any).data;
        if (data) {
          cookies().set("access", data.access);
          cookies().set("refresh", data.refresh);
          const authResponse = await api.get(`/auth`);
          const { nickname, roles } = authResponse.data as any;
          return {
            id: username!,
            name: nickname || username!,
            token: data.access,
            roles: roles.map(
              ({ role }: { id: number; role: RoleType }) => role
            ),
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // 세션에 토큰 정보를 추가합니다.
      session.user = token as any;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: +process.env.NEXT_PUBLIC_REFRESH_DURATION!,
  },
});

export { handler as GET, handler as POST };
