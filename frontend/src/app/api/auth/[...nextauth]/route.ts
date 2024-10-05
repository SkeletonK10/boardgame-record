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
        const response = await api.post(`/auth/signin`, {
          username,
          password,
        });
        if (response.status === 200) {
          const data = response.data as any;
          cookies().set("access", data.access);
          cookies().set("refresh", data.refresh);
          return {
            id: username!,
            name: username!,
            token: data.access,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const authResponse = await api.get(`/auth`);
      const { nickname, roles } = authResponse.data as any;
      return {
        ...token,
        ...user,
        roles: roles.map(({ role }: { id: number; role: RoleType }) => role),
      };
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
