import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

 const {
  data: {user},
 } = await supabase.auth.getUser();

 const pathname = request.nextUrl.pathname;
 const isDashboardRoute = pathname.startsWith("/dashboard");

 if (isDashboardRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!user) {
    return response;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile?.role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const role = profile.role;

  const rolePaths: Record<string, string> = {
  admin: "/dashboard/admin",
  teacher: "/dashboard/pengasuh",
  parent: "/dashboard/orang-tua",
};

const correctPath = rolePaths[role];

if (!correctPath) {
  return NextResponse.redirect(new URL("/login", request.url));
}

if (pathname.startsWith("/dashboard") && !pathname.startsWith(correctPath)) {
  return NextResponse.redirect(new URL(correctPath, request.url));
}

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};