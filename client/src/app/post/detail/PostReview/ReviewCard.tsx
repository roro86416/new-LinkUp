import React from 'react';
import { PostReview } from './interfaces'; 
import { StarFilled, UserOutlined } from '@ant-design/icons'; 

interface ReviewCardProps {
  review: PostReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Helper function to render stars
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      // Use Tailwind for styling: text-amber-500 for gold-like color
      const starColorClass = i < review.rating ? 'text-amber-500' : 'text-gray-300';
      stars.push(
        <StarFilled
          key={i}
          className={`${starColorClass} text-lg mr-0.5`} // Increased size slightly
        />
      );
    }
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  return (
    // Clean card style with padding and subtle hover effect
    <div className="border-b border-gray-100 py-4 transition-all duration-300 hover:bg-gray-50/50">
      
      {/* Author Name and Icon */}
      <div className="flex items-center mb-1.5">
        <UserOutlined className="text-xl mr-3 text-gray-500 p-1 bg-gray-100 rounded-full" />
        <strong className="text-base font-semibold text-gray-800 tracking-wide">
          {review.author_display_name || 'Anonymous User'}
        </strong>
      </div>
      
      {/* Rating and Date */}
      <div className="flex items-center mb-2">
        {renderStars(review.rating)}
        <span className="text-gray-500 text-xs ml-3 border-l pl-3 border-gray-200">
          Reviewed on {review.created_at}
        </span>
      </div>

      {/* Review Content */}
      <p className="m-0 text-gray-700 leading-relaxed text-sm italic">
        {review.content}
      </p>
    </div>
  );
};

export default ReviewCard;