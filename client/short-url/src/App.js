import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UrlShortener from "./Components/UrlShortener";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortener />} />
      </Routes>
    </Router>
  );
}

export default App;
