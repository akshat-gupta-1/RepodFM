"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  ButtonHTMLAttributes,
} from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/components/socket-provider";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Button from "./Button";
import Header from "./Header";
import Chat from "./Chat";
import {
  Video,
  Mic,
  MonitorUp,
  PhoneOff,
  Copy,
  VideoOff,
  MicOff,
  MessageCircle,
  Dot,
} from "lucide-react";
import { cn } from "@/lib/utils";
const Room = ({
  localStream,
  studioName,
  roomId,
  name,
  isCameraOn,
  isMicOn,
  setIsCameraOn,
  setIsMicOn,
}: {
  localStream: MediaStream | null;
  studioName: string;
  roomId: string;
  name: string;
  isCameraOn: boolean;
  isMicOn: boolean;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMicOn: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const path = usePathname();
  const router = useRouter();
  const { socket } = useSocket();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const otherUser = useRef<{ name: string; id: string } | null>(null);
  const leaveButtonRef = useRef<HTMLButtonElement>(null);
  const cameraRef = useRef<HTMLButtonElement>(null);
  const micRef = useRef<HTMLButtonElement>(null);
  const [remoteTrack, setRemoteTrack] = useState<MediaStream | null>(null);
  const [remoteCamera, setRemoteCamera] = useState<boolean>(true);
  const [remoteMic, setRemoteMic] = useState<boolean>(true);
  const [chatState, setChatState] = useState<boolean>(false);
  const [newMessages, setNewMessages] = useState<boolean>(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const sharedScreen = useRef<MediaStream | null>(null);

  //Functions
  const createPeer = useCallback(() => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
    return peer;
  }, []);
  

  const handleShare = useCallback(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    sharedScreen.current = stream;
    socket.emit("room:screen-share", {
      id: sharedScreen.current.id,
      target: otherUser.current?.id,
    });
  }, [socket]);

  useEffect(() => {
    socket.on(
      "room:joined",
      async ({ name, id }: { name: string; id: string }) => {
        otherUser.current = { name, id };
        console.log("sending offer");
        peerRef.current = createPeer();
        localStream
          ?.getTracks()
          .forEach((track) => peerRef.current?.addTrack(track, localStream));
        peerRef.current.onicecandidate = async (e) => {
          console.log("sending ice candidate");
          if (e.candidate) {
            const payload = {
              target: id,
              candidate: e.candidate,
            };
            socket.emit("room:add-ice-candidate", payload);
          }
        };
        peerRef.current.ontrack = (e) => {
          // remoteVideoRef.current!.srcObject = e.streams[0];
          console.log(e.streams);
          setRemoteTrack(e.streams[0]);
        };
        peerRef.current.onnegotiationneeded = async () => {
          console.log("on negotiation needed,sending offer");
          const sdp = await peerRef.current?.createOffer();
          peerRef.current?.setLocalDescription(sdp);
          const payload = {
            caller: socket.id,
            target: id,
            offer: sdp,
            cameraState: localStream?.getVideoTracks()[0].enabled,
            micState: localStream?.getAudioTracks()[0].enabled,
          };
          socket.emit("room:offer", payload);
        };
      },
    );
    socket.on(
      "room:new-user",
      ({ name, id }: { name: string; id: string }) =>
        (otherUser.current = { name, id }),
    );
    socket.on(
      "room:offer",
      async ({
        offer,
        target,
        caller,
        cameraState,
        micState,
      }: {
        offer: RTCSessionDescriptionInit;
        target: string;
        caller: string;
        cameraState: boolean;
        micState: boolean;
      }) => {
        peerRef.current = createPeer();
        localStream
          ?.getTracks()
          .forEach((track) => peerRef.current?.addTrack(track, localStream));
        setRemoteCamera(cameraState);
        setRemoteMic(micState);
        peerRef.current.ontrack = (e) => {
          // remoteVideoRef.current!.srcObject = e.streams[0];
          console.log(e.streams);
          setRemoteTrack(e.streams[0]);
        };
        const desc = new RTCSessionDescription(offer);
        peerRef.current?.setRemoteDescription(desc);
        const sdp = await peerRef.current.createAnswer();
        peerRef.current.setLocalDescription(sdp);
        console.log("sending answer");
        peerRef.current.onicecandidate = async (e) => {
          console.log("sending ice candidate");
          if (e.candidate) {
            const payload = {
              target: caller,
              candidate: e.candidate,
            };
            socket.emit("room:add-ice-candidate", payload);
          }
        };
        const payload = {
          target: caller,
          caller: socket.id,
          answer: sdp,
          cameraState: localStream?.getVideoTracks()[0].enabled,
          micState: localStream?.getAudioTracks()[0].enabled,
        };
        socket.emit("room:answer", payload);
      },
    );
    socket.on(
      "room:answer",
      ({
        answer,
        caller,
        target,
        cameraState,
        micState,
      }: {
        answer: RTCSessionDescription;
        caller: string;
        target: string;
        cameraState: boolean;
        micState: boolean;
      }) => {
        const desc = new RTCSessionDescription(answer);
        peerRef.current?.setRemoteDescription(desc);
        setRemoteCamera(cameraState);
        setRemoteMic(micState);
      },
    );
    socket.on("room:add-ice-candidate", (candidate: RTCIceCandidate) => {
      const c = new RTCIceCandidate(candidate);
      peerRef.current?.addIceCandidate(c);
    });
    socket.on("room:leave", () => {
      otherUser.current = null;
      setRemoteTrack(null);
    });
    socket.on("room:other-user-camera", (state: boolean) => {
      setRemoteCamera(state);
    });
    socket.on("room:other-user-mic", (state: boolean) => {
      console.log(state);
      setRemoteMic(state);
    });
    const shareButton = shareButtonRef.current;
    if (shareButton) {
      shareButton.addEventListener("click", handleShare);
    }

    socket.on("room:screen-share", (id: string) => console.log(id));
    return () => {
      socket.off("room:joined");
      socket.off("room:new-user");
      socket.off("room:offer");
      socket.off("room:answer");
      socket.off("room:add-ice-candidate");
      socket.off("room:leave");
      socket.off("room:other-user-camera");
      socket.off("room:other-user-mic");
      socket.off("room:screen-share");
      shareButton?.removeEventListener("click", handleShare);
    };
  }, [socket, localStream, createPeer, remoteTrack, remoteCamera, handleShare]);
  const handleLeave = useCallback(() => {
    socket.emit("room:leave", { roomId, id: otherUser.current?.id });
    peerRef.current?.close();
    setRemoteTrack(null);
    router.replace(`/dashboard`);
  }, [socket, roomId, otherUser, router]);
  const handleCamera = useCallback(() => {
    if (localStream) {
      const track = localStream.getVideoTracks()[0];
      track.enabled = !track.enabled;
      setIsCameraOn((prev) => !prev);
      const payload = {
        target: otherUser.current?.id,
        state: track.enabled,
      };
      socket.emit("room:other-user-camera", payload);
    }
  }, [localStream, socket, otherUser, setIsCameraOn]);
  const handleMic = useCallback(() => {
    if (localStream) {
      const track = localStream.getAudioTracks()[0];
      track.enabled = !track.enabled;
      setIsMicOn((prev) => !prev);
      const payload = {
        target: otherUser.current?.id,
        state: track.enabled,
      };
      socket.emit("room:other-user-mic", payload);
    }
  }, [localStream, socket, otherUser, setIsMicOn]);
  useEffect(() => {
    const localVideo = localVideoRef.current;
    if (localVideo) {
      localVideo.srcObject = localStream;
    }
    const leaveButton = leaveButtonRef.current;
    if (leaveButton) {
      leaveButton.addEventListener("click", handleLeave);
    }
    const cameraButton = cameraRef.current;
    if (cameraButton) {
      cameraButton.addEventListener("click", handleCamera);
    }
    const micButton = micRef.current;
    if (micButton) {
      micButton.addEventListener("click", handleMic);
    }
    return () => {
      leaveButton?.removeEventListener("click", handleLeave);
      cameraButton?.removeEventListener("click", handleCamera);
      micButton?.removeEventListener("click", handleMic);
    };
  }, [
    localStream,
    socket,
    roomId,
    studioName,
    router,
    handleCamera,
    handleMic,
    handleLeave,
  ]);
  useEffect(() => {
    if (remoteTrack && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteTrack;
    }
  }, [remoteTrack]);
  return (
    <div className="h-screen flex items-center">
      <div className="h-full w-full">
        <Header formattedStudioName={studioName} />
        <div className="grid grid-cols-2 gap-x-3  mt-6 h-5/6 w-full  px-4 ">
          <div className="rounded-lg overflow-hidden relative w-full">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className={cn("w-full h-full object-cover ", {
                hidden: !isCameraOn,
              })}
            ></video>
            {!isCameraOn && (
              <div className="h-full w-full absolute top-0 bg-slate-6 z-30  rounded-lg left-0 flex justify-center items-center ">
                <div className="bg-slate-8 p-8 h-40 w-40 flex justify-center items-center text-3xl font-semibold rounded-xl text-textM-900">
                  {name.slice(0, 1).toUpperCase()}
                </div>
              </div>
            )}
            {!isMicOn && (
              <div
                className={cn(
                  "absolute z-30 bottom-0 right-0 font-bold p-4 text-white",
                  {
                    "text-textM-900": !isCameraOn,
                  },
                )}
              >
                <MicOff
                  className="
                w-5 h-5"
                />
              </div>
            )}
            <h5
              className={cn(
                "absolute z-30 p-4 bottom-0 font-medium text-white",
                {
                  "text-textM-900": !isCameraOn,
                },
              )}
            >
              {name}
            </h5>
          </div>
          {remoteTrack ? (
            <div className="rounded-md overflow-hidden relative">
              <video
                autoPlay
                ref={remoteVideoRef}
                width={400}
                height={300}
                className={cn("w-full h-full object-cover", {
                  hidden: !remoteCamera,
                })}
              ></video>
              {!remoteCamera && (
                <div className="h-full w-full absolute top-0 bg-slate-6 z-30  rounded-lg left-0 flex justify-center items-center ">
                  <div className="bg-slate-8 p-8 h-40 w-40 flex justify-center items-center text-3xl font-semibold rounded-xl text-textM-900">
                    {otherUser.current?.name.slice(0, 1).toUpperCase()}
                  </div>
                </div>
              )}
              {!remoteMic && (
                <div
                  className={cn(
                    "absolute z-30 bottom-0 right-0 font-bold p-4 text-white",
                    {
                      "text-textM-900": !remoteCamera,
                    },
                  )}
                >
                  <MicOff
                    className="
                w-5 h-5"
                  />
                </div>
              )}
              <h5
                className={cn(
                  "absolute z-30 p-4 bottom-0 font-medium text-white",
                  {
                    "text-textM-900": !remoteCamera,
                  },
                )}
              >
                {otherUser.current?.name}
              </h5>
            </div>
          ) : (
            <div className="w-full h-full bg-slate-6 rounded-lg flex items-center justify-center flex-col text-textM-900 ">
              <h2 className="font-semibold text-lg">Invite People</h2>
              <h5 className="text-sm">
                Share this link invite people to your studio
              </h5>
              <div className="p-2 bg-slate-8 rounded-lg text-sm flex gap-x-2 mt-2">
                <div className="flex w-[400px]">
                  <div className="text-nowrap overflow-hidden">{`${process.env.NEXT_PUBLIC_BASE_URL}${path}`}</div>
                  <span>...</span>
                </div>
                <button
                  className="text-slate-11 hover:text-slate-12"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(`${process.env.NEXT_PUBLIC_BASE_URL}${path}`)
                      .then(() => {
                        toast.success("Copied to clipboard");
                      })
                      .catch((_) => toast.error("Failed to copy to clipbaord"));
                  }}
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 w-full flex justify-center gap-x-4 relative">
          <Button typeButton="normal" typeName="Cam" ref={cameraRef}>
            {isCameraOn ? <Video /> : <VideoOff className="text-red-500" />}
          </Button>
          <Button typeButton="normal" typeName="Mic" ref={micRef}>
            {isMicOn ? <Mic /> : <MicOff className="text-red-500" />}
          </Button>
          <Button typeButton="normal" typeName="Share" ref={shareButtonRef}>
            <MonitorUp />
          </Button>
          <Button typeButton="hangup" typeName="Leave" ref={leaveButtonRef}>
            <PhoneOff />
          </Button>
          <Button
            typeButton="normal"
            typeName="Chat"
            className="absolute right-0 px-4"
            onClick={() => {
              setNewMessages(false);
              setChatState((prev) => !prev);
            }}
          >
            {newMessages && (
              <Dot className="absolute w-16 h-16 -top-7 -left-4" />
            )}
            <MessageCircle />
          </Button>
        </div>
      </div>
      <Chat
        chatState={chatState}
        setChatState={setChatState}
        otherUser={otherUser.current}
        name={name}
        setNewMessages={setNewMessages}
      />
    </div>
  );
};

export default Room;
