import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Post from './pages/Post';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter basename="/blog">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/post/:slug" element={<Post />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

