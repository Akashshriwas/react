import "./App.css";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Navbar from "./component/Navbar";
import StaticToolpage from './component/StaticToolpage';


function App() {
  return (
    <Router> 
    <section className="section11">
      <header>
        <Navbar />
      </header>
      <main className="main">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/static" element={<StaticToolpage />} />
            {/* Add routes for other tools */}
          </Routes>
        </main>
      <footer>
        <div class="footer">
          <div class="sb_footer section_padding">
            <div class="sb_footer-links">
              <div class="sb_footer-links-div">
                <h4>Quick Links</h4>
                <ul>
                  <li>
                    <a href="/products">Products</a>
                  </li>
                  <li>
                    <a href="/services">Services</a>
                  </li>
                  <li>
                    <a href="/about">About Us</a>
                  </li>
                  <li>
                    <a href="/contact">Contact Us</a>
                  </li>
                </ul>
              </div>
              <div class="sb_footer-links_div">
                <h4>Follow Us</h4>
                <ul class="social-icons">
                  <li>
                    <a href="#" class="fa fa-facebook"></a>
                  </li>
                  <li>
                    <a href="#" class="fa fa-twitter"></a>
                  </li>
                  <li>
                    <a href="#" class="fa fa-instagram"></a>
                  </li>
                  <li>
                    <a href="#" class="fa fa-linkedin"></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </section>

    </Router> 
  );
}


const Home = () => (
  <section className="hero">
    {/* <div className="hero-content">
      <h1>Welcome to Our Website</h1>
      <p>Discover the latest advancements in technology and innovation.</p>
      <a href="/about" className="btn btn-primary">
        Learn More
      </a>
    </div>
    <div className="hero-image">
      <img src="hero-image.jpg" alt="Hero Image" />
    </div> */}
  </section>
);

export default App;
