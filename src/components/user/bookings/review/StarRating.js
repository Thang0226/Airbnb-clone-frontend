import { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./stars-styles.css";

const StarRating = ({ onChange, value = 0, disable = false }) => {
  const [rating, setRating] = useState(value);

  const handleClick = (index) => {
    if (!disable) {
      setRating(index);
      onChange(index);
    }
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={24}
          className={star <= rating ? "star selected" : "star"}
          onClick={() => handleClick(star)}
        />
      ))}
      <span style={{color: 'orange'}}>{rating} {rating === 1 ? "star" : "stars"}</span>
    </div>
  );
};

export default StarRating;
