# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Local

To run locally with supabase local:

### Install docker

### Run supabase:
```bash
npx supabase start
```

### Run migration local:

```bash
npx supabase db push
```

### Access supabase local 

Open `http://127.0.0.1:54323/` or URL given in the `PUBLIC_SUPABASE_URL`

## Migration

### Login
```bash
npx supabase login   
```

### Link to project

```bash                                                         
npx supabase link --project-ref <your-project-ref>
```

### Skipping migration

If remote db has already table without migration, need to skip like this:

```bash
npx supabase migration repair --status applied 20260422000001
```

### Update the changes

```bash
npx supabase db push
```
