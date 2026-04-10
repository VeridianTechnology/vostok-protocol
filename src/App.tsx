import MotionProvider from "@/components/MotionProvider";
import ChatbaseWidget from "@/components/ChatbaseWidget";
import RadioPlayer from "@/components/RadioPlayer";
import Index from "./pages/Index";

const App = () => (
  <MotionProvider>
    <Index />
    <RadioPlayer />
    <div aria-hidden="true" className="viewport-vignette" />
    <ChatbaseWidget />
  </MotionProvider>
);

export default App;
