import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {Dashboard} from "@/components/admin-dashboard";
export const dynamic="force-dynamic";
export default async function AdminDashboard(){const c=await createClient();if(!c)redirect("/admin/login?setup=1");const {data:{user}}=await c.auth.getUser();if(!user)redirect("/admin/login");const {data}=await c.rpc("is_site_admin");if(!data)redirect("/admin/login?error=owner");return <Dashboard email={user.email||""}/>}
