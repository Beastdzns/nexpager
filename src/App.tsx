import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ReceivedMessages from "./pages/ReceivedMessages";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/received" element={<ReceivedMessages />} />
      </Routes>
    </Router>
  );
};

export default App;
