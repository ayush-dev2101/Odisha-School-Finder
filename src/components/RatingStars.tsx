import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  label?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  label
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating: number) => {
    if (interactive) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = interactive ? (hoverRating || rating) : rating;

  return (
    <div className="flex items-center space-x-1">
      {label && (
        <span className="text-sm font-medium text-foreground mr-2">{label}:</span>
      )}
      <div className="flex items-center space-x-0.5">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          const isPartiallyFilled = !isFilled && starValue - 0.5 <= displayRating;

          return (
            <button
              key={index}
              type="button"
              className={`${sizeClasses[size]} transition-all duration-200 ${
                interactive
                  ? 'cursor-pointer hover:scale-110 active:scale-95'
                  : 'cursor-default'
              }`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
            >
              <Star
                className={`w-full h-full transition-colors duration-200 ${
                  isFilled
                    ? 'text-warning fill-warning'
                    : isPartiallyFilled
                    ? 'text-warning fill-warning/50'
                    : 'text-muted-foreground/40'
                }`}
              />
            </button>
          );
        })}
      </div>
      <span className="text-sm text-muted-foreground ml-1">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
};

export default RatingStars;