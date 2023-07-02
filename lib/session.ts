import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AdapterUser } from "next-auth/adapters";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { SessionInterface, UserProfile } from "@/typing";
import { createUser, getUser } from "./action";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    jwt: {
        encode: async ({ secret, token }) => {
            const encodedToken = jsonwebtoken.sign(
                {
                    ...token,
                    iss: "grafbase",
                    expiresIn: Math.floor(Date.now() / 100 + 60 * 60),
                },
                secret
            );
            return encodedToken;
        },
        decode: async ({ secret, token }) => {
            const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;

            return decodedToken;
        },
    },
    theme: {
        colorScheme: "light",
        logo: "/logo.png",
    },
    callbacks: {
        async session({ session }) {
            // console.log(session);

            const email = session?.user?.email;
            try {
                const data = (await getUser(email!)) as { user?: UserProfile };
                const newSession = {
                    ...session,
                    user: {
                        ...session.user,
                        ...data?.user,
                    },
                };
                // console.log("NEW SESSION", newSession);

                return newSession;
            } catch (error) {
                console.log(error, "SESSION_ERROR");
                return session;
            }
        },
        async signIn({ user }: { user: AdapterUser | User }) {
            try {
                const userExists = (await getUser(user.email as string)) as {
                    user?: UserProfile;
                };
                console.log("userEcists", userExists);

                if (!userExists.user) {
                    await createUser(
                        user.name as string,
                        user.email as string,
                        user.image as string
                    );
                }
                return true;
            } catch (error: any) {
                console.log(error, "SESSION_CALLBACKS_SIGN-IN_ERROR");
            }
            return false;
        },
    },
};

export async function getCurrentUser() {
    const session = (await getServerSession(authOptions)) as SessionInterface;

    return session;
}
