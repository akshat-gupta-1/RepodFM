"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Video, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const studio = session?.user?.name + "s Studio";
  const studioName = studio.toLowerCase().replace(/\s/g, "-");
  const id = nanoid();
  return (
    <div>
      <div className="mt-10 mb-8 flex flex-col gap-y-6">
        <h3 className="text-3xl font-bold text-textM-900">
          {session?.user?.name}&apos;s Studio
        </h3>
        <div className="flex gap-x-4">
          <Button
            className="p-6 bg-primaryM text-white hover:bg-textM-400"
            onClick={() => router.push(`/studio/${studioName}/${id}`)}
          >
            <Video className="mr-2 w-5 h-5" />
            Go to Studio
          </Button>
          <Button className="p-6 bg-slate-9 text-white hover:bg-slate-8">
            <Upload className="mr-2 w-5 h-5" />
            Upload
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-textM-900 text-lg font-bold">Recordings</h3>
      </div>
    </div>
  );
};

export default Page;
