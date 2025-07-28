# installation: Installation

URL: /docs/installation
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/installation.mdx

Learn how to configure Better Auth in your project.
        
***

title: Installation
description: Learn how to configure Better Auth in your project.
----------------------------------------------------------------

<Steps>
  <Step>
    ### Install the Package

    Let's start by adding Better Auth to your project:

    <Tabs items={}>
      <Tab value="npm">
        ```bash
        npm install better-auth
        ```
      </Tab>

      <Tab value="pnpm">
        ```bash
        pnpm add better-auth
        ```
      </Tab>

      <Tab value="yarn">
        ```bash
        yarn add better-auth
        ```
      </Tab>

      <Tab value="bun">
        ```bash
        bun add better-auth
        ```
      </Tab>
    </Tabs>

    <Callout type="info">
      If you're using a separate client and server setup, make sure to install Better Auth in both parts of your project.
    </Callout>
  </Step>

  <Step>
    ### Set Environment Variables

    Create a `.env` file in the root of your project and add the following environment variables:

    1. **Secret Key**

    Random value used by the library for encryption and generating hashes. **You can generate one using the button below** or you can use something like openssl.

    ```txt title=".env"
    BETTER_AUTH_SECRET=
    ```

    <GenerateSecret />

    2. **Set Base URL**

    ```txt title=".env"
    BETTER_AUTH_URL=http://localhost:3000 #Base URL of your app
    ```
  </Step>

  <Step>
    ### Create A Better Auth Instance

    Create a file named `auth.ts` in one of these locations:

    * Project root
    * `lib/` folder
    * `utils/` folder

    You can also nest any of these folders under `src/`, `app/` or `server/` folder. (e.g. `src/lib/auth.ts`, `app/lib/auth.ts`).

    And in this file, import Better Auth and create your auth instance. Make sure to export the auth instance with the variable name `auth` or as a `default` export.

    ```ts title="auth.ts"
    import { betterAuth } from "better-auth";

    export const auth = betterAuth({
      //...
    });
    ```
  </Step>

  <Step>
    ### Configure Database

    Better Auth requires a database to store user data.
    You can easily configure Better Auth to use SQLite, PostgreSQL, or MySQL, and more!

    <Tabs items={["sqlite", "postgres", "mysql"]}>
      <Tab value="sqlite">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import Database from "better-sqlite3";

        export const auth = betterAuth({
            database: new Database("./sqlite.db"),
        })
        ```
      </Tab>

      <Tab value="postgres">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import { Pool } from "pg";

        export const auth = betterAuth({
            database: new Pool({
                // connection options
            }),
        })
        ```
      </Tab>

      <Tab value="mysql">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import { createPool } from "mysql2/promise";

        export const auth = betterAuth({
            database: createPool({
                // connection options
            }),
        })
        ```
      </Tab>
    </Tabs>

    Alternatively, if you prefer to use an ORM, you can use one of the built-in adapters.

    <Tabs items={["drizzle", "prisma", "mongodb"]}>
      <Tab value="drizzle">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import { drizzleAdapter } from "better-auth/adapters/drizzle";
        import { db } from "@/db"; // your drizzle instance

        export const auth = betterAuth({
            database: drizzleAdapter(db, {
                provider: "pg", // or "mysql", "sqlite"
            }),
        });
        ```
      </Tab>

      <Tab value="prisma">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import { prismaAdapter } from "better-auth/adapters/prisma";
        // If your Prisma file is located elsewhere, you can change the path
        import { PrismaClient } from "@/generated/prisma";

        const prisma = new PrismaClient();
        export const auth = betterAuth({
            database: prismaAdapter(prisma, {
                provider: "sqlite", // or "mysql", "postgresql", ...etc
            }),
        });
        ```
      </Tab>

      <Tab value="mongodb">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import { mongodbAdapter } from "better-auth/adapters/mongodb";
        import { client } from "@/db"; // your mongodb client

        export const auth = betterAuth({
            database: mongodbAdapter(client),
        });
        ```
      </Tab>
    </Tabs>

    <Callout>
      If your database is not listed above, check out our other supported
      [databases](/docs/adapters/other-relational-databases) for more information,
      or use one of the supported ORMs.
    </Callout>
  </Step>

  <Step>
    ### Create Database Tables

    Better Auth includes a CLI tool to help manage the schema required by the library.

    * **Generate**: This command generates an ORM schema or SQL migration file.

    <Callout>
      If you're using Kysely, you can apply the migration directly with `migrate` command below. Use `generate` only if you plan to apply the migration manually.
    </Callout>

    ```bash title="Terminal"
    npx @better-auth/cli generate
    ```

    * **Migrate**: This command creates the required tables directly in the database. (Available only for the built-in Kysely adapter)

    ```bash title="Terminal"
    npx @better-auth/cli migrate
    ```

    see the [CLI documentation](/docs/concepts/cli) for more information.

    <Callout>
      If you instead want to create the schema manually, you can find the core schema required in the [database section](/docs/concepts/database#core-schema).
    </Callout>
  </Step>

  <Step>
    ### Authentication Methods

    Configure the authentication methods you want to use. Better Auth comes with built-in support for email/password, and social sign-on providers.

    ```ts title="auth.ts"
    import { betterAuth } from "better-auth";

    export const auth = betterAuth({
      //...other options
      emailAndPassword: {
        // [!code highlight]
        enabled: true, // [!code highlight]
      }, // [!code highlight]
      socialProviders: {
        // [!code highlight]
        github: {
          // [!code highlight]
          clientId: process.env.GITHUB_CLIENT_ID as string, // [!code highlight]
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string, // [!code highlight]
        }, // [!code highlight]
      }, // [!code highlight]
    });
    ```

    <Callout type="info">
      You can use even more authentication methods like [passkey](/docs/plugins/passkey), [username](/docs/plugins/username), [magic link](/docs/plugins/magic-link) and more through plugins.
    </Callout>
  </Step>

  <Step>
    ### Mount Handler

    To handle API requests, you need to set up a route handler on your server.

    Create a new file or route in your framework's designated catch-all route handler. This route should handle requests for the path `/api/auth/*` (unless you've configured a different base path).

    <Callout>
      Better Auth supports any backend framework with standard Request and Response
      objects and offers helper functions for popular frameworks.
    </Callout>

    <Tabs items={["next-js", "nuxt", "svelte-kit", "remix", "solid-start", "hono", "express", "elysia", "tanstack-start", "expo"]} defaultValue="react">
      <Tab value="next-js">
        ```ts title="/app/api/auth/[...all]/route.ts"
        import { auth } from "@/lib/auth"; // path to your auth file
        import { toNextJsHandler } from "better-auth/next-js";

        export const { POST, GET } = toNextJsHandler(auth);
        ```
      </Tab>

      <Tab value="nuxt">
        ```ts title="/server/api/auth/[...all].ts"
        import { auth } from "~/utils/auth"; // path to your auth file

        export default defineEventHandler((event) => {
            return auth.handler(toWebRequest(event));
        });
        ```
      </Tab>

      <Tab value="svelte-kit">
        ```ts title="hooks.server.ts"
        import { auth } from "$lib/auth"; // path to your auth file
        import { svelteKitHandler } from "better-auth/svelte-kit";
        import { building } from '$app/environment'

        export async function handle({ event, resolve }) {
            return svelteKitHandler({ event, resolve, auth, building });
        }
        ```
      </Tab>

      <Tab value="remix">
        ```ts title="/app/routes/api.auth.$.ts"
        import { auth } from '~/lib/auth.server' // Adjust the path as necessary
        import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node"

        export async function loader({ request }: LoaderFunctionArgs) {
            return auth.handler(request)
        }

        export async function action({ request }: ActionFunctionArgs) {
            return auth.handler(request)
        }
        ```
      </Tab>

      <Tab value="solid-start">
        ```ts title="/routes/api/auth/*all.ts"
        import { auth } from "~/lib/auth"; // path to your auth file
        import { toSolidStartHandler } from "better-auth/solid-start";

        export const { GET, POST } = toSolidStartHandler(auth);
        ```
      </Tab>

      <Tab value="hono">
        ```ts title="src/index.ts"
        import { Hono } from "hono";
        import { auth } from "./auth"; // path to your auth file
        import { serve } from "@hono/node-server";
        import { cors } from "hono/cors";

        const app = new Hono();

        app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

        serve(app);
        ```
      </Tab>

      <Tab value="express">
        <Callout type="warn">
          ExpressJS v5 introduced breaking changes to route path matching by switching to `path-to-regexp@6`. Wildcard routes like `*` should now be written using the new named syntax, e.g. `/{*any}`, to properly capture catch-all patterns. This ensures compatibility and predictable behavior across routing scenarios.
          See the [Express v5 migration guide](https://expressjs.com/en/guide/migrating-5.html) for details.

          As a result, the implementation in ExpressJS v5 should look like this:

          ```ts
          app.all('/api/auth/{*any}', toNodeHandler(auth));
          ```

          *The name any is arbitrary and can be replaced with any identifier you prefer.*
        </Callout>

        ```ts title="server.ts"
        import express from "express";
        import { toNodeHandler } from "better-auth/node";
        import { auth } from "./auth";

        const app = express();
        const port = 8000;

        app.all("/api/auth/*", toNodeHandler(auth));

        // Mount express json middleware after Better Auth handler
        // or only apply it to routes that don't interact with Better Auth
        app.use(express.json());

        app.listen(port, () => {
            console.log(`Better Auth app listening on port ${port}`);
        });
        ```

        This will also work for any other node server framework like express, fastify, hapi, etc., but may require some modifications. See [fastify guide](/docs/integrations/fastify). Note that CommonJS (cjs) isn't supported.
      </Tab>

      <Tab value="astro">
        ```ts title="/pages/api/auth/[...all].ts"
        import type { APIRoute } from "astro";
        import { auth } from "@/auth"; // path to your auth file

        export const GET: APIRoute = async (ctx) => {
            return auth.handler(ctx.request);
        };

        export const POST: APIRoute = async (ctx) => {
            return auth.handler(ctx.request);
        };
        ```
      </Tab>

      <Tab value="elysia">
        ```ts
        import { Elysia, Context } from "elysia";
        import { auth } from "./auth";

        const betterAuthView = (context: Context) => {
            const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
            // validate request method
            if(BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
                return auth.handler(context.request);
            } else {
                context.error(405)
            }
        }

        const app = new Elysia().all("/api/auth/*", betterAuthView).listen(3000);

        console.log(
        `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
        );
        ```
      </Tab>

      <Tab value="tanstack-start">
        ```ts title="src/routes/api/auth/$.ts"
        import { auth } from '~/lib/server/auth'
        import { createServerFileRoute } from '@tanstack/react-start/server'

        export const ServerRoute = createServerFileRoute('/api/auth/$').methods({
        GET: ({ request }) => {
            return auth.handler(request)
        },
        POST: ({ request }) => {
            return auth.handler(request)
        },
        });
        ```
      </Tab>

      <Tab value="expo">
        ```ts title="app/api/auth/[...all]+api.ts"
        import { auth } from '@/lib/server/auth'; // path to your auth file

        const handler = auth.handler;
        export { handler as GET, handler as POST };
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step>
    ### Create Client Instance

    The client-side library helps you interact with the auth server. Better Auth comes with a client for all the popular web frameworks, including vanilla JavaScript.

    1. Import `createAuthClient` from the package for your framework (e.g., "better-auth/react" for React).
    2. Call the function to create your client.
    3. Pass the base URL of your auth server. (If the auth server is running on the same domain as your client, you can skip this step.)

    <Callout type="info">
      If you're using a different base path other than `/api/auth` make sure to pass
      the whole URL including the path. (e.g.
      `http://localhost:3000/custom-path/auth`)
    </Callout>

    <Tabs
      items={["react", "vue", "svelte", "solid",
"vanilla"]}
      defaultValue="react"
    >
      <Tab value="vanilla">
        ```ts title="lib/auth-client.ts"
        import { createAuthClient } from "better-auth/client"
        export const authClient = createAuthClient({
            /** The base URL of the server (optional if you're using the same domain) */ // [!code highlight]
            baseURL: "http://localhost:3000" // [!code highlight]
        })
        ```
      </Tab>

      <Tab value="react" title="lib/auth-client.ts">
        ```ts title="lib/auth-client.ts"
        import { createAuthClient } from "better-auth/react"
        export const authClient = createAuthClient({
            /** The base URL of the server (optional if you're using the same domain) */ // [!code highlight]
            baseURL: "http://localhost:3000" // [!code highlight]
        })
        ```
      </Tab>

      <Tab value="vue" title="lib/auth-client.ts">
        ```ts title="lib/auth-client.ts"
        import { createAuthClient } from "better-auth/vue"
        export const authClient = createAuthClient({
            /** The base URL of the server (optional if you're using the same domain) */ // [!code highlight]
            baseURL: "http://localhost:3000" // [!code highlight]
        })
        ```
      </Tab>

      <Tab value="svelte" title="lib/auth-client.ts">
        ```ts title="lib/auth-client.ts"
        import { createAuthClient } from "better-auth/svelte"
        export const authClient = createAuthClient({
            /** The base URL of the server (optional if you're using the same domain) */ // [!code highlight]
            baseURL: "http://localhost:3000" // [!code highlight]
        })
        ```
      </Tab>

      <Tab value="solid" title="lib/auth-client.ts">
        ```ts title="lib/auth-client.ts"
        import { createAuthClient } from "better-auth/solid"
        export const authClient = createAuthClient({
            /** The base URL of the server (optional if you're using the same domain) */ // [!code highlight]
            baseURL: "http://localhost:3000" // [!code highlight]
        })
        ```
      </Tab>
    </Tabs>

    <Callout type="info">
      Tip: You can also export specific methods if you prefer:
    </Callout>

    ```ts
    export const { signIn, signUp, useSession } = createAuthClient()
    ```
  </Step>

  <Step>
    ### 🎉 That's it!

    That's it! You're now ready to use better-auth in your application. Continue to [basic usage](/docs/basic-usage) to learn how to use the auth instance to sign in users.
  </Step>
</Steps>



---

# concepts: CLI
URL: /docs/concepts/cli
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/concepts/cli.mdx

Built-in CLI for managing your project.
        
***

title: CLI
description: Built-in CLI for managing your project.
----------------------------------------------------

Better Auth comes with a built-in CLI to help you manage the database schemas, initialize your project, and generate a secret key for your application.

## Generate

The `generate` command creates the schema required by Better Auth. If you're using a database adapter like Prisma or Drizzle, this command will generate the right schema for your ORM. If you're using the built-in Kysely adapter, it will generate an SQL file you can run directly on your database.

```bash title="Terminal"
npx @better-auth/cli@latest generate
```

### Options

* `--output` - Where to save the generated schema. For Prisma, it will be saved in prisma/schema.prisma. For Drizzle, it goes to schema.ts in your project root. For Kysely, it’s an SQL file saved as schema.sql in your project root.
* `--config` - The path to your Better Auth config file. By default, the CLI will search for a auth.ts file in **./**, **./utils**, **./lib**, or any of these directories under `src` directory.
* `--yes` - Skip the confirmation prompt and generate the schema directly.

## Migrate

The migrate command applies the Better Auth schema directly to your database. This is available if you’re using the built-in Kysely adapter. For other adapters, you'll need to apply the schema using your ORM's migration tool.

```bash title="Terminal"
npx @better-auth/cli@latest migrate
```

### Options

* `--config` - The path to your Better Auth config file. By default, the CLI will search for a auth.ts file in **./**, **./utils**, **./lib**, or any of these directories under `src` directory.
* `--yes` - Skip the confirmation prompt and apply the schema directly.

## Init

The `init` command allows you to initialize Better Auth in your project.

```bash title="Terminal"
npx @better-auth/cli@latest init
```

### Options

* `--name` - The name of your application. (Defaults to your `package.json`'s `name` property.)
* `--framework` - The framework your codebase is using. Currently, the only supported framework is `nextjs`.
* `--plugins` - The plugins you want to use. You can specify multiple plugins by separating them with a comma.
* `--database` - The database you want to use. Currently, the only supported database is `sqlite`.
* `--package-manager` - The package manager you want to use. Currently, the only supported package managers are `npm`, `pnpm`, `yarn`, `bun`. (Defaults to the manager you used to initialize the CLI.)

## Secret

The CLI also provides a way to generate a secret key for your Better Auth instance.

```bash title="Terminal"
npx @better-auth/cli@latest secret
```

## Common Issues

**Error: Cannot find module X**

If you see this error, it means the CLI can’t resolve imported modules in your Better Auth config file. We're working on a fix for many of these issues, but in the meantime, you can try the following:

* Remove any import aliases in your config file and use relative paths instead. After running the CLI, you can revert to using aliases.


# basic-usage: Basic Usage
URL: /docs/basic-usage
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/basic-usage.mdx

Getting started with Better Auth
        
***

title: Basic Usage
description: Getting started with Better Auth
---------------------------------------------

Better Auth provides built-in authentication support for:

* **Email and password**
* **Social provider (Google, GitHub, Apple, and more)**

But also can easily be extended using plugins, such as: [username](/docs/plugins/username), [magic link](/docs/plugins/magic-link), [passkey](/docs/plugins/passkey), [email-otp](/docs/plugins/email-otp), and more.

## Email & Password

To enable email and password authentication:

```ts title="auth.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
    emailAndPassword: {    // [!code highlight]
        enabled: true // [!code highlight]
    } // [!code highlight]
})
```

### Sign Up

To sign up a user you need to call the client method `signUp.email` with the user's information.

```ts title="sign-up.ts"
import { authClient } from "@/lib/auth-client"; //import the auth client // [!code highlight]

const { data, error } = await authClient.signUp.email({
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
        image, // User image URL (optional)
        callbackURL: "/dashboard" // A URL to redirect to after the user verifies their email (optional)
    }, {
        onRequest: (ctx) => {
            //show loading
        },
        onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        },
});
```

By default, the users are automatically signed in after they successfully sign up. To disable this behavior you can set `autoSignIn` to `false`.

```ts title="auth.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
    emailAndPassword: {
    	enabled: true,
    	autoSignIn: false //defaults to true // [!code highlight]
  },
})
```

### Sign In

To sign a user in, you can use the `signIn.email` function provided by the client.

```ts title="sign-in"
const { data, error } = await authClient.signIn.email({
        /**
         * The user email
         */
        email,
        /**
         * The user password
         */
        password,
        /**
         * A URL to redirect to after the user verifies their email (optional)
         */
        callbackURL: "/dashboard",
        /**
         * remember the user session after the browser is closed. 
         * @default true
         */
        rememberMe: false
}, {
    //callbacks
})
```

<Callout type="warn">
  Always invoke client methods from the client side. Don't call them from the server.
</Callout>

### Server-Side Authentication

To authenticate a user on the server, you can use the `auth.api` methods.

```ts title="server.ts"
import { auth } from "./auth"; // path to your Better Auth server instance

const response = await auth.api.signInEmail({
    body: {
        email,
        password
    },
    asResponse: true // returns a response object instead of data
});
```

<Callout>
  If the server cannot return a response object, you'll need to manually parse and set cookies. But for frameworks like Next.js we provide [a plugin](/docs/integrations/next#server-action-cookies) to handle this automatically
</Callout>

## Social Sign-On

Better Auth supports multiple social providers, including Google, GitHub, Apple, Discord, and more. To use a social provider, you need to configure the ones you need in the `socialProviders` option on your `auth` object.

```ts title="auth.ts"
import { betterAuth } from "better-auth";

export const auth = betterAuth({
    socialProviders: { // [!code highlight]
        github: { // [!code highlight]
            clientId: process.env.GITHUB_CLIENT_ID!, // [!code highlight]
            clientSecret: process.env.GITHUB_CLIENT_SECRET!, // [!code highlight]
        } // [!code highlight]
    }, // [!code highlight]
})
```

### Sign in with social providers

To sign in using a social provider you need to call `signIn.social`. It takes an object with the following properties:

```ts title="sign-in.ts"
import { authClient } from "@/lib/auth-client"; //import the auth client // [!code highlight]

await authClient.signIn.social({
    /**
     * The social provider ID
     * @example "github", "google", "apple"
     */
    provider: "github",
    /**
     * A URL to redirect after the user authenticates with the provider
     * @default "/"
     */
    callbackURL: "/dashboard", 
    /**
     * A URL to redirect if an error occurs during the sign in process
     */
    errorCallbackURL: "/error",
    /**
     * A URL to redirect if the user is newly registered
     */
    newUserCallbackURL: "/welcome",
    /**
     * disable the automatic redirect to the provider. 
     * @default false
     */
    disableRedirect: true,
});
```

You can also authenticate using `idToken` or `accessToken` from the social provider instead of redirecting the user to the provider's site. See social providers documentation for more details.

## Signout

To signout a user, you can use the `signOut` function provided by the client.

```ts title="user-card.tsx"
await authClient.signOut();
```

you can pass `fetchOptions` to redirect onSuccess

```ts title="user-card.tsx" 
await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/login"); // redirect to login page
    },
  },
});
```

## Session

Once a user is signed in, you'll want to access the user session. Better Auth allows you easily to access the session data from the server and client side.

### Client Side

#### Use Session

Better Auth provides a `useSession` hook to easily access session data on the client side. This hook is implemented using nanostore and has support for each supported framework and vanilla client, ensuring that any changes to the session (such as signing out) are immediately reflected in your UI.

<Tabs items={["React", "Vue","Svelte", "Solid", "Vanilla"]} defaultValue="React">
  <Tab value="React">
    ```tsx title="user.tsx"
    import { authClient } from "@/lib/auth-client" // import the auth client // [!code highlight] 

    export function User(){

        const { // [!code highlight]
            data: session, // [!code highlight]
            isPending, //loading state // [!code highlight]
            error, //error object // [!code highlight]
            refetch //refetch the session
        } = authClient.useSession() // [!code highlight]

        return (
            //...
        )
    }
    ```
  </Tab>

  <Tab value="Vue">
    ```vue title="index.vue"
    <script setup lang="ts">
    import { authClient } from "~/lib/auth-client" // [!code highlight]

    const session = authClient.useSession() // [!code highlight]
    </script>

    <template>
        <div>
            <div>
                <pre>{{ session.data }}</pre>
                <button v-if="session.data" @click="authClient.signOut()">
                    Sign out
                </button>
            </div>
        </div>
    </template>
    ```
  </Tab>

  <Tab value="Svelte">
    ```svelte title="user.svelte"
    <script lang="ts">
    import { authClient } from "$lib/auth-client"; // [!code highlight]

    const session = authClient.useSession(); // [!code highlight]
    </script>
    <p>
        {$session.data?.user.email}
    </p>
    ```
  </Tab>

  <Tab value="Vanilla">
    ```ts title="user.svelte"
    import { authClient } from "~/lib/auth-client"; //import the auth client

    authClient.useSession.subscribe((value)=>{
        //do something with the session //
    }) 
    ```
  </Tab>

  <Tab value="Solid">
    ```tsx title="user.tsx"
    import { authClient } from "~/lib/auth-client"; // [!code highlight]

    export default function Home() {
        const session = authClient.useSession() // [!code highlight]
        return (
            <pre>{JSON.stringify(session(), null, 2)}</pre>
        );
    }
    ```
  </Tab>
</Tabs>

#### Get Session

If you prefer not to use the hook, you can use the `getSession` method provided by the client.

```ts title="user.tsx"
import { authClient } from "@/lib/auth-client" // import the auth client // [!code highlight]

const { data: session, error } = await authClient.getSession()
```

You can also use it with client-side data-fetching libraries like [TanStack Query](https://tanstack.com/query/latest).

### Server Side

The server provides a `session` object that you can use to access the session data. It requires request headers object to be passed to the `getSession` method.

**Example: Using some popular frameworks**

<Tabs items={["Next.js", "Nuxt", "Svelte", "Astro", "Hono", "TanStack"]}>
  <Tab value="Next.js">
    ```ts title="server.ts"
    import { auth } from "./auth"; // path to your Better Auth server instance
    import { headers } from "next/headers";

    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    ```
  </Tab>

  <Tab value="Remix">
    ```ts title="route.ts"
    import { auth } from "lib/auth"; // path to your Better Auth server instance

    export async function loader({ request }: LoaderFunctionArgs) {
        const session = await auth.api.getSession({
            headers: request.headers
        })

        return json({ session })
    }
    ```
  </Tab>

  <Tab value="Astro">
    ```astro title="index.astro"
    ---
    import { auth } from "./auth";

    const session = await auth.api.getSession({
        headers: Astro.request.headers,
    });
    ---
    <!-- Your Astro Template -->
    ```
  </Tab>

  <Tab value="Svelte">
    ```ts title="+page.ts"
    import { auth } from "./auth";

    export async function load({ request }) {
        const session = await auth.api.getSession({
            headers: request.headers
        })
        return {
            props: {
                session
            }
        }
    }
    ```
  </Tab>

  <Tab value="Hono">
    ```ts title="index.ts"
    import { auth } from "./auth";

    const app = new Hono();

    app.get("/path", async (c) => {
        const session = await auth.api.getSession({
            headers: c.req.raw.headers
        })
    });
    ```
  </Tab>

  <Tab value="Nuxt">
    ```ts title="server/session.ts"
    import { auth } from "~/utils/auth";

    export default defineEventHandler((event) => {
        const session = await auth.api.getSession({
            headers: event.headers,
        })
    });
    ```
  </Tab>

  <Tab value="TanStack">
    ```ts title="app/routes/api/index.ts"
    import { auth } from "./auth";
    import { createAPIFileRoute } from "@tanstack/start/api";

    export const APIRoute = createAPIFileRoute("/api/$")({
        GET: async ({ request }) => {
            const session = await auth.api.getSession({
                headers: request.headers
            })
        },
    });
    ```
  </Tab>
</Tabs>

<Callout>
  For more details check [session-management](/docs/concepts/session-management) documentation.
</Callout>

## Using Plugins

One of the unique features of Better Auth is a plugins ecosystem. It allows you to add complex auth related functionality with small lines of code.

Below is an example of how to add two factor authentication using two factor plugin.

<Steps>
  <Step>
    ### Server Configuration

    To add a plugin, you need to import the plugin and pass it to the `plugins` option of the auth instance. For example, to add two factor authentication, you can use the following code:

    ```ts title="auth.ts"
    import { betterAuth } from "better-auth"
    import { twoFactor } from "better-auth/plugins" // [!code highlight]

    export const auth = betterAuth({
        //...rest of the options
        plugins: [ // [!code highlight]
            twoFactor() // [!code highlight]
        ] // [!code highlight]
    })
    ```

    now two factor related routes and method will be available on the server.
  </Step>

  <Step>
    ### Migrate Database

    After adding the plugin, you'll need to add the required tables to your database. You can do this by running the `migrate` command, or by using the `generate` command to create the schema and handle the migration manually.

    generating the schema:

    ```bash title="terminal"
    npx @better-auth/cli generate
    ```

    using the `migrate` command:

    ```bash title="terminal"
    npx @better-auth/cli migrate
    ```

    <Callout>
      If you prefer adding the schema manually, you can check the schema required on the [two factor plugin](/docs/plugins/2fa#schema) documentation.
    </Callout>
  </Step>

  <Step>
    ### Client Configuration

    Once we're done with the server, we need to add the plugin to the client. To do this, you need to import the plugin and pass it to the `plugins` option of the auth client. For example, to add two factor authentication, you can use the following code:

    ```ts title="auth-client.ts"  
    import { createAuthClient } from "better-auth/client";
    import { twoFactorClient } from "better-auth/client/plugins"; // [!code highlight]

    const authClient = createAuthClient({
        plugins: [ // [!code highlight]
            twoFactorClient({ // [!code highlight]
                twoFactorPage: "/two-factor" // the page to redirect if a user need to verify 2nd factor // [!code highlight]
            }) // [!code highlight]
        ] // [!code highlight]
    })
    ```

    now two factor related methods will be available on the client.

    ```ts title="profile.ts"
    import { authClient } from "./auth-client"

    const enableTwoFactor = async() => {
        const data = await authClient.twoFactor.enable({
            password // the user password is required
        }) // this will enable two factor
    }

    const disableTwoFactor = async() => {
        const data = await authClient.twoFactor.disable({
            password // the user password is required
        }) // this will disable two factor
    }

    const signInWith2Factor = async() => {
        const data = await authClient.signIn.email({
            //...
        })
        //if the user has two factor enabled, it will redirect to the two factor page
    }

    const verifyTOTP = async() => {
        const data = await authClient.twoFactor.verifyTOTP({
            code: "123456", // the code entered by the user 
            /**
             * If the device is trusted, the user won't
             * need to pass 2FA again on the same device
             */
            trustDevice: true
        })
    }
    ```
  </Step>

  <Step>
    Next step: See the <Link href="/docs/plugins/2fa">two factor plugin documentation</Link>.
  </Step>
</Steps>



---


# integrations: Astro Integration
URL: /docs/integrations/astro
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/integrations/astro.mdx

Integrate Better Auth with Astro.
        
***

title: Astro Integration
description: Integrate Better Auth with Astro.
----------------------------------------------

Better Auth comes with first class support for Astro. This guide will show you how to integrate Better Auth with Astro.

Before you start, make sure you have a Better Auth instance configured. If you haven't done that yet, check out the [installation](/docs/installation).

### Mount the handler

To enable Better Auth to handle requests, we need to mount the handler to a catch all API route. Create a file inside `/pages/api/auth` called `[...all].ts` and add the following code:

```ts title="pages/api/auth/[...all].ts"
import { auth } from "~/auth";
import type { APIRoute } from "astro";

export const ALL: APIRoute = async (ctx) => {
	// If you want to use rate limiting, make sure to set the 'x-forwarded-for' header to the request headers from the context
	// ctx.request.headers.set("x-forwarded-for", ctx.clientAddress);
	return auth.handler(ctx.request);
};
```

<Callout>
  You can change the path on your better-auth configuration but it's recommended to keep it as `/api/auth/[...all]`
</Callout>

## Create a client

Astro supports multiple frontend frameworks, so you can easily import your client based on the framework you're using.

If you're not using a frontend framework, you can still import the vanilla client.

<Tabs
  items={[ "vanilla", "react", "vue", "svelte", "solid",
]}
  defaultValue="react"
>
  <Tab value="vanilla">
    ```ts title="lib/auth-client.ts"
    import { createAuthClient } from "better-auth/client"
    export const authClient =  createAuthClient()
    ```
  </Tab>

  <Tab value="react" title="lib/auth-client.ts">
    ```ts title="lib/auth-client.ts"
    import { createAuthClient } from "better-auth/react"
    export const authClient =  createAuthClient()
    ```
  </Tab>

  <Tab value="vue" title="lib/auth-client.ts">
    ```ts title="lib/auth-client.ts"
    import { createAuthClient } from "better-auth/vue"
    export const authClient =  createAuthClient()
    ```
  </Tab>

  <Tab value="svelte" title="lib/auth-client.ts">
    ```ts title="lib/auth-client.ts"
    import { createAuthClient } from "better-auth/svelte"
    export const authClient =  createAuthClient()
    ```
  </Tab>

  <Tab value="solid" title="lib/auth-client.ts">
    ```ts title="lib/auth-client.ts"
    import { createAuthClient } from "better-auth/solid"
    export const authClient =  createAuthClient()
    ```
  </Tab>
</Tabs>

## Auth Middleware

### Astro Locals types

To have types for your Astro locals, you need to set it inside the `env.d.ts` file.

```ts title="env.d.ts"

/// <reference path="../.astro/types.d.ts" />

declare namespace App {
    // Note: 'import {} from ""' syntax does not work in .d.ts files.
    interface Locals {
        user: import("better-auth").User | null;
        session: import("better-auth").Session | null;
    }
}
```

### Middleware

To protect your routes, you can check if the user is authenticated using the `getSession` method in middleware and set the user and session data using the Astro locals with the types we set before. Start by creating a `middleware.ts` file in the root of your project and follow the example below:

```ts title="middleware.ts"
import { auth } from "@/auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const isAuthed = await auth.api
        .getSession({
            headers: context.request.headers,
        })

    if (isAuthed) {
        context.locals.user = isAuthed.user;
        context.locals.session = isAuthed.session;
    } else {
        context.locals.user = null;
        context.locals.session = null;
    }

    return next();
});
```

### Getting session on the server inside `.astro` file

You can use `Astro.locals` to check if the user has session and get the user data from the server side. Here is an example of how you can get the session inside an `.astro` file:

```astro
---
import { UserCard } from "@/components/user-card";

const session = () => {
    if (Astro.locals.session) {
        return Astro.locals.session;
    } else {
        // Redirect to login page if the user is not authenticated
        return Astro.redirect("/login");
    }
}

---

<UserCard initialSession={session} />
```

---

# adapters: SQLite
URL: /docs/adapters/sqlite
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/adapters/sqlite.mdx

Integrate Better Auth with SQLite.
        
***

title: SQLite
description: Integrate Better Auth with SQLite.
-----------------------------------------------

SQLite is a lightweight, serverless, self-contained SQL database engine that is widely used for local data storage in applications.
Read more [here.](https://www.sqlite.org/)

## Example Usage

Make sure you have SQLite installed and configured.
Then, you can connect it straight into Better Auth.

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("database.sqlite"),
});
```

<Callout>
  For more information, read Kysely's documentation to the
  [SqliteDialect](https://kysely-org.github.io/kysely-apidoc/classes/SqliteDialect.html).
</Callout>

## Schema generation & migration

The [Better Auth CLI](/docs/concepts/cli) allows you to generate or migrate
your database schema based on your Better Auth configuration and plugins.

<table>
  <tr className="border-b">
    <th>
      <p className="font-bold text-[16px] mb-1">SQLite Schema Generation</p>
    </th>

    <th>
      <p className="font-bold text-[16px] mb-1">SQLite Schema Migration</p>
    </th>
  </tr>

  <tr className="h-10">
    <td>✅ Supported</td>
    <td>✅ Supported</td>
  </tr>
</table>

```bash title="Schema Generation"
npx @better-auth/cli@latest generate
```

```bash title="Schema Migration"
npx @better-auth/cli@latest migrate
```

## Additional Information

SQLite is supported under the hood via the [Kysely](https://kysely.dev/) adapter, any database supported by Kysely would also be supported. (<Link href="/docs/adapters/other-relational-databases">Read more here</Link>)

If you're looking for performance improvements or tips, take a look at our guide to <Link href="/docs/guides/optimizing-for-performance">performance optimizations</Link>.


