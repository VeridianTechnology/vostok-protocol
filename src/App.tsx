import MotionProvider from "@/components/MotionProvider";
import ChatbaseWidget from "@/components/ChatbaseWidget";
import RadioPlayer from "@/components/RadioPlayer";
import RadioArrow from "@/components/RadioArrow";
import Index from "./pages/Index";

const isFacebookLayout =
  new URLSearchParams(window.location.search).get("utm_source")?.toLowerCase() === "facebook" ||
  window.location.hostname === "localhost";

const App = () => (
  <MotionProvider>
    <Index />
    <RadioPlayer />
    {!isFacebookLayout && <RadioArrow />}
    <div aria-hidden="true" className="viewport-vignette" />
    <ChatbaseWidget />
  </MotionProvider>
);

export default App;
