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
    signIn: "/api/auth/signin",
  },

  secret: process.env.NETXAUTH_SECRET,

  callbacks: {
    async session({ session, token } : any) {
      console.log("token : ", token);
      const requestURI = "http://localhost:8000/authkey";
      let key : String | null;

      try {
        const res = await fetch(requestURI, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body : JSON.stringify({
            user : session.user.email,
          })
        })
        if (res) {
          console.log("res", res);
        }
      } catch(e) {
        key = null;
      }
      key = "hello";
      session.user.authkey = key; 
      
      return { ...session };
    },
  },
};