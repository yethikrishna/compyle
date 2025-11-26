"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { GoogleIcon } from "@/icons";
import { signIn } from "@/lib/auth-client";
import { Github } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SocialAuth() {
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function signInWithGithub() {
    setGithubLoading(true);
    const data = await signIn.social({ provider: "github" });

    if (data.error) {
      setGithubLoading(false);
      toast.error(`Error: ${data.error.message}`);
    } else {
      setGithubLoading(false);
      toast.success("Github signin successful.");
    }
  }

  async function signInWithGoogle() {
    setGoogleLoading(true);
    const data = await signIn.social({ provider: "google" });

    if (data.error) {
      setGoogleLoading(false);
      toast.error(`Error: ${data.error.message}`);
    } else {
      setGoogleLoading(false);
      toast.success("Google signin successful.");
    }
  }

  return (
    <div className="flex flex-col items-center px-5">
      <Separator />
      <p className="text-center text-muted-foreground mt-4">Or continue with</p>
      <Button
        variant="outline"
        onClick={signInWithGithub}
        className="mt-4 w-full cursor-pointer"
        disabled={githubLoading || googleLoading}
      >
        {githubLoading ? <Spinner /> : <Github />}
        {githubLoading ? "Loading..." : "Github"}
      </Button>
      <Button
        variant="outline"
        onClick={signInWithGoogle}
        className="mt-2 w-full cursor-pointer"
        disabled={githubLoading || googleLoading}
      >
        {googleLoading ? <Spinner /> : <GoogleIcon />}
        {googleLoading ? "Loading..." : "Google"}
      </Button>
    </div>
  );
}
