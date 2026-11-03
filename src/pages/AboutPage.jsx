import { Link } from 'react-router-dom';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-about">
        <div className="hero-grid">
          <div className="hero-text">
            <h1>
              Our Story
              <span className="accent-text">A Legacy of Purity and Excellence</span>
            </h1>
            <p>
              Top Cinnamon is a family-owned business dedicated to bringing you the finest Ceylon cinnamon 
              directly from the heart of Sri Lanka. With decades of expertise in cinnamon cultivation and 
              processing, we ensure that every product meets the highest standards of quality and purity.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn-primary">Explore</Link>
              <Link to="/contact" className="btn-ghost">Contact</Link>
            </div>
          </div>
          <div className="hero-card">
            <img src="/images/bg1.png" alt="Cinnamon Heritage" className="hero-image" />
            <p className="image-caption">Traditional Cinnamon Processing</p>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="story-section">
        <div className="section-container">
          <h2>Our Journey</h2>
          <p className="section-subtitle">From the mountains of Sri Lanka to your table</p>
          
          <div className="story-content">
            <div className="story-image">
              <img src="/images/bg2.jpg" alt="Cinnamon Fields" />
            </div>
            <div className="story-text">
              <h3>Rooted in Tradition</h3>
              <p>
                Our journey began in the lush mountains of Sri Lanka, where cinnamon cultivation 
                has been a cherished tradition for generations. We honor the legacy of Ceylon 
                cinnamon, known worldwide for its superior quality, delicate flavor, and 
                remarkable health benefits.
              </p>
              <p>
                Every cinnamon product we offer is carefully selected and processed using 
                time-honored methods passed down through generations. We take pride in maintaining 
                the highest standards while preserving the authentic character that makes 
                Ceylon cinnamon truly special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="values-section">
        <div className="section-container">
          <h2>Our Values</h2>
          <p className="section-subtitle">What sets us apart</p>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌿</div>
              <h3>100% Pure</h3>
              <p>We guarantee pure, unadulterated Ceylon cinnamon with no additives or fillers.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Sustainable</h3>
              <p>Our farming practices respect the environment and support local communities.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⭐</div>
              <h3>Premium Quality</h3>
              <p>Rigorous quality control ensures only the finest cinnamon reaches you.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🏆</div>
              <h3>Authentic</h3>
              <p>Direct from source, maintaining the traditional Ceylon cinnamon character.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="section-container">
          <h2>Our Process</h2>
          <p className="section-subtitle">From harvest to your doorstep</p>
          
          <div className="process-grid">
            {[
              {
                step: "01",
                title: "Harvesting",
                description: "Hand-selected cinnamon bark from mature trees at the peak of quality"
              },
              {
                step: "02",
                title: "Processing",
                description: "Traditional methods ensure the delicate flavor and aroma are preserved"
              },
              {
                step: "03",
                title: "Grading",
                description: "Careful sorting and grading to meet the highest international standards"
              },
              {
                step: "04",
                title: "Packaging",
                description: "Secure packaging maintains freshness and protects quality"
              }
            ].map((item, index) => (
              <div key={index} className="process-card">
                <div className="process-number">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Experience the Difference</h2>
          <p>Discover why Top Cinnamon is trusted by discerning customers worldwide.</p>
          <div className="cta-buttons">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/contact" className="btn-ghost">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;

