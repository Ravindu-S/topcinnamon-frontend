import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-home">
        <div className="hero-grid">
          <div className="hero-text">
            <h1>
              The Essence of Luxury Cinnamon
              <span className="accent-text">Crafted by Nature, Perfected by Us.</span>
            </h1>
            <p>
              Experience Ceylon cinnamon at its finest — single‑origin, hand‑graded, and
              curated for connoisseurs. From delicate quills to golden powder, every
              note whispers warmth and sophistication.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn-primary">Explore</Link>
              <Link to="/about" className="btn-ghost">Our Story</Link>
            </div>
          </div>
          <div className="hero-card">
            <img src="/images/bg.jpg" alt="CinnamonMiracle Signature Collection" className="hero-image" />
            <p className="image-caption">CinnamonMiracle Signature Collection</p>
          </div>
        </div>
      </section>

      {/* Menu Teaser */}
      <section className="selection-section">
        <div className="section-container">
          <h2>Our Selection</h2>
          <p className="section-subtitle">Refined forms of cinnamon to elevate every ritual.</p>
          <div className="products-grid-home">
            {[
              { title: "Ceylon Quills", image: "/images/sticks.jpg" },
              { title: "Ground Gold", image: "/images/powder.jpg" },
              { title: "Cinnamon Oil", image: "/images/oil.jpg" },
              { title: "Gift Hampers", image: "/images/tea.jpg" }
            ].map((item) => (
              <div key={item.title} className="product-card-home">
                <img src={item.image} alt={item.title} className="product-image" />
                <h3>{item.title}</h3>
                <p className="product-tagline">Pure • Ethical • Exquisite</p>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/products" className="btn-primary">View Catalog</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-grid">
            {[
              "A warm, opulent aroma in every cup.",
              "Elegance bottled — the gold standard of cinnamon.",
              "From farm to table, their integrity shows."
            ].map((quote, i) => (
              <div key={i} className="testimonial-item">
                <p className="testimonial-quote">"{quote}"</p>
                <p className="testimonial-author">— Patron</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Reserve Your Taste of Purity</h2>
          <p>Shop now and discover why discerning palates choose CinnamonMiracle.</p>
          <div className="cta-buttons">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/contact" className="btn-ghost">Contact</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;