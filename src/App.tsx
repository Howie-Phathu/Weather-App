import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { TemperatureProvider } from "./contexts/TemperatureContext";
import TemperatureToggle from "./components/TemperatureToggle";
import Home from "./pages/Home";
import Saved from "./pages/Saved";
import "./App.css";

export default function App() {
  return (
    <TemperatureProvider>
      <BrowserRouter>
        <header className="app-header">
          <nav className="nav-bar">
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/saved">Saved Locations</Link>
            </div>
            <TemperatureToggle />
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/saved" element={<Saved />} />
          </Routes>
        </main>
      </BrowserRouter>
    </TemperatureProvider>
  );
}
