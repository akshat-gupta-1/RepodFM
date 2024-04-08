import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "@/components/socket-provider";
import { X, ArrowRight, MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";
interface ChatProps {
  chatState: boolean;
  setChatState: React.Dispatch<React.SetStateAction<boolean>>;
  otherUser: { name: string; id: string } | null;
  name: string;
  setNewMessages: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Message {
  message: string;
  sender: string;
  reciever: string;
  type: "send" | "recieve";
  time: Date;
}
const Chat = ({
  chatState,
  setChatState,
  otherUser,
  name,
  setNewMessages,
}: ChatProps) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const { socket } = useSocket();
  const handleSubmit = useCallback(
    (e: SubmitEvent) => {
      e.preventDefault();
      if (message.length === 0) return;
      const payload = {
        message: message,
        sender: socket.id as string,
        reciever: otherUser?.id!,
        type: "send" as "send",
      };
      socket.emit("room:send-message", payload);
      setMessage("");
      setMessages((prev) => [...prev, { ...payload, time: new Date() }]);
    },
    [socket, message, otherUser],
  );
  useEffect(() => {
    const formElement = formRef.current;
    if (formElement) {
      formElement.addEventListener("submit", handleSubmit);
    }
    socket.on("room:recieve-message", (payload: Message) => {
      console.log(typeof payload.time);
      if (!chatState) {
        setNewMessages(true);
      }
      setMessages((prev) => [...prev, payload]);
    });
    return () => {
      socket.off("room:send-message");
      socket.off("room:recieve-message");
      formElement?.removeEventListener("submit", handleSubmit);
    };
  }, [socket, message, handleSubmit, setNewMessages, chatState]);
  if (chatState) {
    return (
      <div className="min-w-[400px] max-w-[400px] h-[96.5%] mr-4 bg-slate-6 rounded-xl relative p-2 overflow-hidden ">
        <button
          className="absolute p-1 bg-slate-8 rounded-full right-2 text-textM-900 hover:bg-slate-9"
          onClick={() => setChatState((prev) => !prev)}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-2xl">Chat</h2>
        <div className="h-full flex flex-col  ">
          <div className="flex-1">
            {messages.length > 0 ? (
              <div className="my-6">
                {messages.map((message, index) => {
                  return (
                    <div
                      key={index}
                      className={cn("w-full flex flex-wrap overflow-hidden", {
                        "justify-start": message.type === "send",
                        "justify-end": message.type === "recieve",
                      })}
                    >
                      <div>
                        <div
                          className={cn(
                            " my-2 p-2 w-fit rounded-t-lg whitespace-normal break-words mr-10 ",
                            {
                              "rounded-br-lg mr-10 ml-2 bg-slate-8":
                                message.type === "send",
                              "rounded-bl-lg ml-10 mr-2 bg-primaryM text-white":
                                message.type === "recieve",
                            },
                          )}
                        >
                          {message.message}
                        </div>
                        <div
                          className={cn("text-xs text-slate-10", {
                            "text-left ml-2": message.type === "send",
                            "text-right mr-2": message.type === "recieve",
                          })}
                        >
                          {message.type === "send"
                            ? `${message.time.getHours()}:${message.time.getMinutes()}`
                            : `${new Date(message.time).getHours()}:${new Date(
                                message.time,
                              ).getMinutes()}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-sm text-slate-11">
                <MessagesSquare className="h-16 w-16 my-4" />
                <h3 className="text-lg font-semibold">Whisper Backstage</h3>
                <h4>Nothing said just yet.</h4>
                <h5 className="text-center">
                  Messages are cleared after <br /> each session.
                </h5>
              </div>
            )}
          </div>
          <form
            className="mb-8 mt-4 w-full h-11 flex bg-slate-8 rounded-lg p-1 "
            ref={formRef}
          >
            <input
              value={message}
              type="text"
              placeholder="Message Everyone"
              className="w-full h-full  px-2 py-4 bg-inherit rounded-lg outline-none placeholder:text-slate-11 text-base"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="p-2 bg-primaryM rounded-lg text-white disabled:bg-textM-400 hover:bg-textM-600"
              disabled={message.length === 0}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default Chat;
