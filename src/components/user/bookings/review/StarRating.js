import { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./stars-styles.css";

const StarRating = ({ onChange, value = 0, disable = false, reviewInline = false }) => {
  const [rating, setRating] = useState(value);

  const handleClick = (index) => {
    if (!disable) {
      setRating(index);
      onChange(index);
    }
  };

  if (reviewInline) {
    return (
      <div className="star-rating d-flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={24}
            className={star <= rating ? 'star selected' : 'star'}
            onClick={() => handleClick(star)}
          />
        ))}
        <span style={{ color: 'orange' }}>{rating} {rating === 1 ? 'star' : 'stars'}</span>
      </div>
    )
  }

  return (
    <div className="star-rating">
      <div style={{ color: 'orange' }} className="w-100">{rating} {rating === 1 ? 'star' : 'stars'}</div>
      <div className="d-flex">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <FaStar
            key={starIndex}
            size={24}
            className={starIndex <= rating ? "star selected" : "star"}
            onClick={() => handleClick(starIndex)}
          />
        ))}
      </div>
    </div>
  )
}

export default StarRating;
