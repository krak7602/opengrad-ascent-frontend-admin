import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
        id: { label: "Id" },
      },
      authorize: async (credentials) => {
        let volunteer1 = null;
        let partner1 = null;
        let admin1 = null;
        const { email, password, role } =
          await signInSchema.parseAsync(credentials);
        volunteer1 = {
          email: "volunteer1@gmail.com",
          password: "volu2#AA",
          role: "volunteer",
        };
        partner1 = {
          email: "partner1@gmail.com",
          password: "part2#AA",
          role: "partner",
        };
        admin1 = {
          email: "admin1@gmail.com",
          password: "admi2#AA",
          role: "admin",
        };
        try {
          const resp = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
              email: email,
              password: password,
            },
          );

          const resp2 = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/getfulldata`,
            {
              headers: {
                authorization: `Bearer ${resp.data.token}`,
              },
            },
          );

          if (resp.data.id) {
            return {
              email: email,
              password: password,
              role: role,
              auth_id: resp2.data.id,
              auth_token: resp.data.token,
            };
          }
        } catch (e) {
          console.log(e);
        }

        if (role === "admin") {
          if (email != admin1.email || password != admin1.password) {
            throw new Error("Adminstrator account not found.");
          }
        }
        if (role === "partner") {
          if (email != partner1.email || password != partner1.password) {
            throw new Error("Organization account not found.");
          }
        }
        if (role === "volunteer") {
          if (email != volunteer1.email || password != volunteer1.password) {
            throw new Error("Volunteer account not found.");
          }
        }
        return { email: email, password: password, role: role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.auth_id = user.auth_id;
        token.auth_token = user.auth_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.auth_id = token.auth_id;
        session.user.auth_token = token.auth_token;
      }
      return session;
    },
  },
  trustHost: true,
});
