"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

export default function NewAppImage() {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-secondary/50 p-3 rounded-lg">
            <ImageIcon className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-semibold mb-1">
              Image or Screenshot
            </h2>
            <p className="text-muted-foreground text-sm">
              Upload an image or screenshot of your app
            </p>
          </div>
        </div>

        <div className="pl-16 mt-2 space-y-6"></div>
      </CardContent>
    </Card>
  );
}
