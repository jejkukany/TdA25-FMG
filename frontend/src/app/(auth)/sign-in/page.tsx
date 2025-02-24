"use client";

import { useState } from "react";
import { client } from "@/server/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [identifier, setIdentifier] = useState(""); // Changed from email to identifier
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const signIn = async () => {
    setLoading(true);
    setError(null);

    if (!identifier || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      if (isEmail(identifier)) {
        await client.signIn.email(
          {
            email: identifier,
            password,
          },
          {
            onSuccess: () => {
              router.push('/');
            },
            onError: (ctx) => {
              setError(ctx.error.message);
            },
          },
        );
      } else {
        await client.signIn.username(
          {
            username: identifier,
            password,
          },
          {
            onSuccess: () => {
              router.push('/');
            },
            onError: (ctx) => {
              setError(ctx.error.message);
            },
          },
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen min-w-96 items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign in to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await signIn();
            }}
          >
            <div>
              <Label htmlFor="identifier">Email or Username</Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setIdentifier(e.target.value)
                }
                placeholder="Email or username"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}