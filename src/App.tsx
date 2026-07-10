import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatbaseWidget from "@/components/ChatbaseWidget";
import Landing from "./pages/Landing";
import Radio from "./pages/radio/Radio";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/radio" element={<Radio />} />
      <Route path="*" element={<Landing />} />
    </Routes>
    <ChatbaseWidget />
  </BrowserRouter>
);

export default App;
