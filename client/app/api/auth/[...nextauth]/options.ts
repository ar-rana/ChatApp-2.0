import GoogleProvider from "next-auth/providers/google";
import { signIn, signOut } from "next-auth/react";

//const baseURL = process.env.NEXTAUTH_URL;

export const options = {
  session: {
    maxAge: 3 * 24 * 60 * 60,
    updateAge: 0,
  },
  // cookies: {
  //   sessionToken: {
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //     },
  //   },
  // },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLECLIENT_ID!,
      clientSecret: process.env.GOOGLECLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/api/auth/signin",
  },

  secret: process.env.NETXAUTH_SECRET,

  callbacks: {
    // async signIn({ user }: any) {
    //   const isAllowedToSignIn: boolean = true;
    //   console.log("signin call");
    //   if (isAllowedToSignIn) {
    //     const requestURI = "http://localhost:8000/authkey";
    //     try {
    //       const res = await fetch(requestURI, {
    //         method: "PUT",
    //         credentials: "include",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           user: user.email,
    //         }),
    //       });

    //       const responseBody = await res.text();
    //       console.log("Response Status:", res.status);
    //       console.log("Response Body:", responseBody);

    //       if (typeof window !== "undefined") {
    //         window.localStorage.setItem("authkey", responseBody);
    //       }
    //       if (!res.ok) {
    //         console.log("Failed to fetch auth key:", res.statusText);
    //       }
    //     } catch (e) {
    //       console.log("Error fetching auth key:", e);
    //     }
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    async session({ session }: any) {
      console.log("session call");
      return { ...session };
    },
  },
};
