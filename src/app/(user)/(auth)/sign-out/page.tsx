"use client";
import { client } from "@/server/auth/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignUp() {
  const signOut = async () => {
    await client.signOut();
  };

  const user = client.useSession();

  return (
    <div className="flex min-h-screen min-w-96 items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
      <Card className="w-full max-w-md">
        {user.data ? (
          <div>
            <CardHeader>
              <CardTitle>Sign Out</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await signOut();
                }}
              >
                <Button type="submit" className="w-full">
                  Sign Out
                </Button>
              </form>
            </CardContent>{" "}
          </div>
        ) : (
          <div>
            <CardHeader>
              <CardTitle>You are not signed in</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-center gap-2">
              <Link href={"/sign-up"} className="w-full">
                <Button className="w-full" variant={"outline"}>
                  Sign Up
                </Button>
              </Link>
              <Link href={"/sign-in"} className="w-full">
                <Button className="w-full">Sign In</Button>
              </Link>
            </CardContent>
          </div>
        )}
      </Card>
    </div>
  );
}
