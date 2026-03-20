import MotionProvider from "@/components/MotionProvider";
import ChatbaseWidget from "@/components/ChatbaseWidget";
import RadioPlayer from "@/components/RadioPlayer";
import Index from "./pages/Index";

const App = () => (
  <MotionProvider>
    <Index />
    <RadioPlayer />
    <ChatbaseWidget />
  </MotionProvider>
);

export default App;
