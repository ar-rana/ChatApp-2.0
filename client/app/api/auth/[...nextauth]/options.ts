import GoogleProvider from "next-auth/providers/google";

//const baseURL = process.env.NEXTAUTH_URL;

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLECLIENT_ID!,
      clientSecret: process.env.GOOGLECLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/api/signin",
  },

  secret: process.env.NETXAUTH_SECRET,

  callbacks: {
    async session({ session } : any) {
      return { ...session };
    },
  },
};