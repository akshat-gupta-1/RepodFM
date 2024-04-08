"use client";
import React from "react";
import { convertToFormattedString } from "@/lib/utils";
import { useSocket } from "@/components/socket-provider";
import {
  ChevronLeft,
  Video,
  Mic,
  Volume2,
  AlertTriangle,
  MicOff,
  VideoOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Room from "./_components/Room";
import Header from "./_components/Header";
const Page = ({
  params,
}: {
  params: { studioName: string; RoomId: string };
}) => {
  const [cameraPermission, setCameraPermission] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const [micPermission, setMicPermission] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const { socket } = useSocket();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [name, setName] = useState<string>("");
  const [warning, setWarning] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const formattedStudioName = convertToFormattedString(params.studioName);
  const router = useRouter();
  const getStatus = async () => {
    //@ts-ignore
    const cameraPermission = await navigator.permissions.query({
      name: "camera",
    });
    //@ts-ignore
    const micPermission = await navigator.permissions.query({
      name: "microphone",
    });
    setCameraPermission(cameraPermission.state);
    setMicPermission(micPermission.state);
  };

  const toggle = (inputType: "Camera" | "Mic") => {
    if (inputType === "Camera") {
      if (streamRef.current) {
        const videoTrack = streamRef.current.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(!isCameraOn);
      }
    } else {
      if (streamRef.current) {
        const audioTrack = streamRef.current.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(!isMicOn);
      }
    }
  };
  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        setIsCameraOn(true);
        setIsMicOn(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        await getStatus();
      } catch (e) {
        console.log(e);
        await getStatus();
      }
    };
    getVideo();
  }, [videoRef, setIsCameraOn, setIsMicOn]);
  useEffect(() => {
    if (isJoined) {
      socket.emit("room:join", {
        roomId: params.RoomId,
        name,
      });
    }
  }, [socket, isJoined, params.RoomId, name]);
  if (!isJoined) {
    return (
      <div className="flex flex-col h-screen">
        <Header formattedStudioName={formattedStudioName} />
        <div className="flex-grow basis-auto flex-shrink">
          <div className="max-w-[820px] grid grid-cols-2 gap-x-16 w-full mx-auto h-full place-items-center">
            <div className="flex flex-col gap-y-4">
              {cameraPermission === "denied" && micPermission === "denied" && (
                <div className="flex border border-red-500 rounded-md p-2 text-red-500 text-sm">
                  <AlertTriangle className=" mr-2 w-6 h-6" />
                  Please enable both cam and mic permissions to proceed forward.
                </div>
              )}
              {warning && (
                <div className="flex border border-red-500 rounded-md p-2 text-red-500 text-sm">
                  <AlertTriangle className=" mr-2 w-6 h-6" />
                  Please enter a name before joining
                </div>
              )}

              <div className="flex flex-col gap-y-1">
                {" "}
                <h6 className="text-sm text-slate-9 font-medium">
                  You&apos;re about to join {formattedStudioName}
                </h6>
                <h3 className="text-2xl font-bold text-textM-900">
                  Let&apos;s check your cam and mic
                </h3>
              </div>
              <form
                className="w-full flex flex-col gap-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (name.length > 0) {
                    setIsJoined(true);
                  } else {
                    setWarning(true);
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Enter your name..."
                  className="bg-slate-4 rounded-md w-full py-2 px-4 text-sm"
                  onChange={(e) => {
                    if (e.target.value.length > 0) {
                      setWarning(false);
                    }
                    setName(e.target.value);
                  }}
                />
                <Button
                  className="bg-primaryM hover:bg-textM-400 -semibold text-white"
                  disabled={
                    cameraPermission == "denied" && micPermission == "denied"
                  }
                  type="submit"
                >
                  Join Studio
                </Button>
              </form>
            </div>
            {cameraPermission === "denied" && micPermission === "denied" ? (
              <div>Camera Setup</div>
            ) : (
              <div className="w-full bg-slate-4 rounded-lg p-4 flex flex-col gap-y-2">
                <div className="w-full h-[200px] rounded-md overflow-hidden  relative">
                  {" "}
                  <video
                    ref={videoRef}
                    className="relative"
                    autoPlay
                    muted
                  ></video>
                  {!isCameraOn && (
                    <div className="w-full h-full bg-slate-6 flex items-center justify-center text-textM-900 text-2xl font-semibold absolute z-20 top-0 left-0">
                      Camera is off
                    </div>
                  )}
                  <div className="absolute bottom-2 w-full justify-center z-30 flex gap-x-4  ">
                    <button
                      className="p-2 rounded-xl bg-slate-7"
                      onClick={() => toggle("Camera")}
                    >
                      {isCameraOn ? (
                        <Video />
                      ) : (
                        <VideoOff className="text-red-500" />
                      )}
                    </button>
                    <button
                      className="p-2 rounded-xl bg-slate-7"
                      onClick={() => toggle("Mic")}
                    >
                      {isMicOn ? <Mic /> : <MicOff className="text-red-500" />}{" "}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <Room
      isCameraOn={isCameraOn}
      isMicOn={isMicOn}
      setIsCameraOn={setIsCameraOn}
      setIsMicOn={setIsMicOn}
      name={name}
      localStream={streamRef.current}
      studioName={formattedStudioName}
      roomId={params.RoomId}
    />
  );
};

export default Page;
