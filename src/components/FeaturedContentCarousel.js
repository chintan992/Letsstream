import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function FeaturedContentCarousel({ featuredContent, carouselSettings }) {
  return (
    <div className="mb-8 relative">
      <Slider {...carouselSettings}>
        {featuredContent.map((item) => (
          <div key={item.id} className="relative">
            <div className="relative h-[60vh] min-h-[400px] max-h-[600px]">
              <img
                src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                alt={item.title || item.name}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <Link 
                  to={`/watch/${item.media_type}/${item.id}`}
                  className="group"
                >
                  <h2 className="text-4xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                    {item.title || item.name}
                  </h2>
                  <p className="text-gray-200 text-lg line-clamp-2 mb-4 max-w-2xl">
                    {item.overview}
                  </p>
                  <div className="flex items-center text-sm text-gray-300">
                    <span className="mr-4">
                      {new Date(item.release_date || item.first_air_date).getFullYear()}
                    </span>
                    <span className="mr-4">
                      Rating: {Math.round(item.vote_average * 10) / 10}
                    </span>
                    <span className="capitalize">
                      {item.media_type}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

FeaturedContentCarousel.propTypes = {
  featuredContent: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      name: PropTypes.string,
      backdrop_path: PropTypes.string,
      overview: PropTypes.string,
      release_date: PropTypes.string,
      first_air_date: PropTypes.string,
      vote_average: PropTypes.number,
      media_type: PropTypes.string.isRequired
    })
  ).isRequired,
  carouselSettings: PropTypes.object.isRequired
};

export default FeaturedContentCarousel;
