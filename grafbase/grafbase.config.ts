import { g, auth, config } from "@grafbase/sdk";
import { rule } from "postcss";

// Welcome to Grafbase!
// Define your data models, integrate auth, permission rules, custom resolvers, search, and more with Grafbase.
// Integrate Auth
// https://grafbase.com/docs/auth
//
// const authProvider = auth.OpenIDConnect({
//   issuer: process.env.ISSUER_URL ?? ''
// })
//
// Define Data Models
// https://grafbase.com/docs/database
// @ts-ignore
const User = g
    .model("User", {
        name: g.string().length({ min: 2, max: 20 }),
        email: g.string().unique(),
        avatarUrl: g.url(),
        description: g.string().optional(),
        githubUrl: g.url().optional(),
        linkedinUrl: g.url().optional(),
        projects: g
            .relation(() => Project)
            .list()
            .optional(),
    })
    .auth((rules) => rules.public().read());
// @ts-ignore
const Project = g
    .model("Project", {
        title: g.string().length({ min: 5 }),
        description: g.string(),
        image: g.url(),
        githubUrl: g.url().optional(),
        liveSiteUrl: g.url().optional(),
        category: g.string().optional().search(),
        createdBy: g.relation(() => User),
    })
    .auth((rules) => {
        rules.public().read().create().delete().update();
    });

const jwt = auth.JWT({
    issuer: "grafbase",
    secret: process.env.NEXTAUTH_SECRET!,
});

export default config({
    schema: g,
    // Integrate Auth
    // https://grafbase.com/docs/auth
    auth: {
        providers: [jwt],
        rules: (rules) => {
            rules.private();
        },
    },
});
