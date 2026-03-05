import { useEffect } from "react";

const DEFAULT_CHATBASE_HOST = "https://www.chatbase.co/";

const ChatbaseWidget = () => {
  useEffect(() => {
    const chatbotId =
      import.meta.env.VITE_CHATBOT_ID ??
      import.meta.env.NEXT_PUBLIC_CHATBOT_ID;
    const host =
      import.meta.env.VITE_CHATBASE_HOST ??
      import.meta.env.NEXT_PUBLIC_CHATBASE_HOST ??
      DEFAULT_CHATBASE_HOST;

    if (!chatbotId) {
      if (import.meta.env.DEV) {
        console.warn(
          "Chatbase widget not loaded: missing VITE_CHATBOT_ID or NEXT_PUBLIC_CHATBOT_ID."
        );
      }
      return;
    }

    if (
      window.chatbase &&
      window.chatbase("getState") !== "initialized"
    ) {
      // The widget will handle initialization; no need to rebind.
    } else if (!window.chatbase) {
      window.chatbase = (...args) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          return (...args) => target(prop, ...args);
        },
      });
    }

    const onLoad = () => {
      if (document.getElementById(chatbotId)) {
        return;
      }
      const script = document.createElement("script");
      script.src = new URL("embed.min.js", host).toString();
      script.id = chatbotId;
      script.setAttribute("domain", new URL(host).hostname);
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
};

export default ChatbaseWidget;
