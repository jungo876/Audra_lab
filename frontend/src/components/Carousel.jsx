import React from 'react';
import './Carousel.css';

export default function Carousel() {
  const items = [
    {
      id: 1,
      image: 'https://picsum.photos/seed/audra_vec_1/600/400',
      title: 'Neural Mesh Scan',
      desc: 'Facial geometry analysis and temporal consistency scoring.'
    },
    {
      id: 2,
      image: 'https://picsum.photos/seed/audra_vec_2/600/400',
      title: 'Metadata Integrity',
      desc: 'EXIF extraction and cryptographic hash verification.'
    },
    {
      id: 3,
      image: 'https://picsum.photos/seed/audra_vec_3/600/400',
      title: 'Compression ELA',
      desc: 'Pixel-level manipulation heatmaps and artifacts.'
    },
    {
      id: 4,
      image: 'https://picsum.photos/seed/audra_vec_4/600/400',
      title: 'LPU Acceleration',
      desc: 'High-throughput verification for modern newsrooms.'
    },
    {
      id: 5,
      image: 'https://picsum.photos/seed/audra_vec_5/600/400',
      title: 'Threat Intel',
      desc: 'Real-time social media threat monitoring and alerts.'
    },
    {
      id: 6,
      image: 'https://picsum.photos/seed/audra_vec_6/600/400',
      title: 'Vector Mapping',
      desc: '3D shadow and lighting vector consistency checks.'
    }
  ];

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const totalItems = items.length;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % totalItems);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalItems]);

  const nextSlide = () => setCurrentIdx(prev => (prev + 1) % totalItems);
  const prevSlide = () => setCurrentIdx(prev => (prev - 1 + totalItems) % totalItems);

  return (
    <div className="carousel-wrapper-controlled">
      <div className="carousel-controls">
        <button className="ctrl-btn prev" onClick={prevSlide}>←</button>
        <button className="ctrl-btn next" onClick={nextSlide}>→</button>
      </div>

      <div className="carousel-viewport">
        <div 
          className="carousel-track-controlled" 
          style={{ transform: `translateX(-${currentIdx * (500 + 48)}px)` }}
        >
          {items.map((item, idx) => (
            <div key={item.id} className={`carousel-card-premium ${currentIdx === idx ? 'active' : ''}`}>
              <div className="carousel-img-wrapper">
                <img src={item.image} alt={item.title} />
                <div className="img-scan-overlay"></div>
              </div>
              <div className="carousel-content">
                <div className="tactical-label-small">VECTOR {String(item.id).padStart(2, '0')}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-indicators">
        {items.map((_, i) => (
          <div 
            key={i} 
            className={`indicator-dot ${currentIdx === i ? 'active' : ''}`}
            onClick={() => setCurrentIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}
