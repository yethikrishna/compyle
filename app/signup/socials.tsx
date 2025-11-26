"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/lib/auth-client";
import { Github } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SocialAuth() {
  const [loading, setLoading] = useState(false);

  async function signInWithGithub() {
    setLoading(true);
    const data = await signIn.social({ provider: "github" });

    if (data.error) {
      setLoading(false);
      toast.error(`Error: ${data.error.message}`);
    } else {
      setLoading(false);
      toast.success("Github signin successful.");
    }
  }

  return (
    <div className="flex flex-col items-center px-5">
      <Separator />
      <p className="text-center text-muted-foreground mt-4">Or continue with</p>
      <Button onClick={signInWithGithub} className="mt-4 w-full cursor-pointer">
        {loading ? <Spinner /> : <Github />}
        {loading ? "Loading..." : "Github"}
      </Button>
    </div>
  );
}
