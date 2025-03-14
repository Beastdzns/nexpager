import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ReceivedMessages from "./pages/ReceivedMessages";
import { Web3Provider } from "./context/Web3Context";

const App = () => {
  return (
    <Web3Provider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/received" element={<ReceivedMessages />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
};

export default App;
