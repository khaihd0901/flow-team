import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainBoard from "./pages/MainBoard";

import { Toaster } from "sonner";
function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PRIVATE */}
          <Route path="/" element={<MainBoard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
