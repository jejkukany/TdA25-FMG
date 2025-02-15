"use client";

import { client } from "~/server/auth/client";
import Link from "next/link";
import { Button } from "~/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = client.useSession();

  if (user?.isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-4 text-2xl font-bold">Loading</h1>
      </div>
    );
  }
  if (!(user?.data?.user as { isAdmin?: boolean })?.isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-4 text-2xl font-bold">Please Sign In</h1>
        <p className="mb-4">
          You need to be authenticated and an admin to view this page.
        </p>
        <Button>
          <Link href="/sign-in">Go to Sign In</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
