  # RentaDorm Iloilo

  RentaDorm Iloilo is a dorm-finding website for students and workers looking for affordable rooms in Iloilo City. The public pages let visitors browse listings, compare prices, and view each property with photos and a map. The admin dashboard lets a landlord manage dorm listings with a CRUD flow.

  ## Demo admin credentials

  - Email: admin@rentadormiloilo.com
  - Password: Admin123!

  If Supabase is configured, the app will try to validate the admin via Supabase Auth first. If the environment is not configured yet, the project falls back to the built-in demo admin login for local testing.

  ## User login and registration

  The website includes a public user sign-up and sign-in flow. A demo user is also available for quick testing:

  - Email: user@rentadormiloilo.com
  - Password: User123!

  ## Local development setup

  1. Open a terminal in the project folder.
  2. Run:

  ```bash
  npm install
  npm run dev
  ```

  3. Open http://localhost:3000.
  4. On the homepage, use the sign-in/register form to create a user account or log in with the demo user credentials.
  5. To open the admin dashboard, visit /admin/login or /secret-admin and use the demo admin credentials above.

  ## Real website deployment (Vercel + Supabase)

  This project is ready to run as a live website in Vercel once your Supabase project is connected.

  1. In Supabase, open your project and copy the project URL and anon key from the Connect section.
  2. In Vercel, open your project dashboard and add these environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  3. Add the same variables in your local `.env.local` for testing.
  4. Deploy the project from the Vercel GitHub branch or push to the connected repository.
  5. After deployment, open the live Vercel URL and sign in with the real Supabase-authenticated user or use the built-in demo credentials if the environment is not configured yet.

  ## Supabase SQL setup

  Run the SQL files in `supabase/sql/` in the Supabase SQL editor, in this order:

  1. `002-rentadorm-dorms.sql`
  2. `003-rentadorm-admins.sql`

  These create the dorm table and admin access rules. When real Supabase auth is enabled, the app automatically uses `supabase.auth` for registration and login instead of the fallback localStorage demo flow.

  ## Admin workflow

  1. Log in to `/admin/login` with the admin credentials above.
  2. Create, edit, or delete dorm listings from the dashboard.
  3. Each listing includes a name, area, price, status, room types, owner details, image gallery, and map location.
  4. Save the changes and the public homepage refreshes automatically with the new listing data.

  ## Production checklist

  - Keep all real credentials out of the repo.
  - Add the same Supabase environment variables in Vercel before deployment.
  - Test the live URL after every commit to confirm the public page and admin login still work.
