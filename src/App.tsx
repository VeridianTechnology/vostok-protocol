import MotionProvider from "@/components/MotionProvider";
import ChatbaseWidget from "@/components/ChatbaseWidget";
import Index from "./pages/Index";

const App = () => (
  <MotionProvider>
    <Index />
    <ChatbaseWidget />
  </MotionProvider>
);

export default App;
