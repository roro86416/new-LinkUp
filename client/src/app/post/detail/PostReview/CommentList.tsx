'use client'; 

import React, { useState, useCallback } from 'react';
import { StarFilled } from '@ant-design/icons';
import ReviewCard from './ReviewCard';
import { PostReview } from './interfaces'; 

// Sample review data (matching the new structure)
const initialReviews: PostReview[] = [
  { 
    id: 1, 
    post_id: 101,
    user_id: 'user_a123',
    author_display_name: 'Max H.', 
    rating: 5, 
    content: 'The content was highly insightful and well-structured. I highly recommend this read for anyone interested in Next.js development!', 
    created_at: 'November 18, 2024'
  },
  { 
    id: 2, 
    post_id: 101,
    user_id: 'user_b456',
    author_display_name: 'Chloe L.',
    rating: 4, 
    content: 'Great article, though I wish there was more detail on performance optimization. Overall, very informative.', 
    created_at: 'November 16, 2024'
  },
];

interface ReviewComponentProps {
    // ID of the post currently being reviewed
    currentPostId: number; 
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({ currentPostId }) => {
  const [reviews, setReviews] = useState<PostReview[]>(initialReviews);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const [userIdInput, setUserIdInput] = useState<string>('guest_reviewer'); // Mock User ID Input

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 || !content || !userIdInput) {
      // In a real app, use a custom modal for user notification instead of alert()
      console.error('Validation Error: Please provide a rating, content, and a user ID.');
      return;
    }

    const newReview: PostReview = {
      id: Date.now(), 
      post_id: currentPostId, 
      user_id: userIdInput,
      author_display_name: userIdInput, // In a real app, this would be the logged-in user's name
      rating: rating,
      content: content,
      created_at: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    // Simulate POST request success: prepend new review to the list
    setReviews([newReview, ...reviews]);

    // Reset form states
    setRating(0);
    setContent('');
    // Keep user_id input populated for simulation
    
  }, [rating, content, userIdInput, reviews, currentPostId]);

  // Render the star rating input mechanism
  const renderStarInput = () => {
    return Array.from({ length: 5 }, (_, index) => {
        // Use amber (gold) color for rating stars
        const starColorClass = (hoverRating || rating) > index ? 'text-amber-500' : 'text-gray-300';
        return (
            <StarFilled
                key={index}
                onClick={() => setRating(index + 1)}
                onMouseEnter={() => setHoverRating(index + 1)}
                onMouseLeave={() => setHoverRating(0)}
                // Increased size and smoother transition
                className={`cursor-pointer text-3xl transition-colors duration-200 ${starColorClass}`}
            />
        );
    });
  };

  return (
    // Aesthetic improvement: Wider container, deep shadow, clean background, rounded corners
    <div className="max-w-3xl mx-auto my-12 p-8 border border-gray-100 rounded-xl shadow-2xl bg-white/95 backdrop-blur-sm">
      
      {/* Review Form Section */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">Leave a Review</h2>
      
      {/* Form Container with distinct background */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-inner">
        
        {/* 1. Rating */}
        <div className="mb-6">
          <label className="block font-bold text-lg text-gray-800 mb-2">Your Rating:</label>
          <div className="flex space-x-1">{renderStarInput()}</div>
          {rating > 0 && (
            <p className="mt-2 text-sm font-medium text-gray-600">
              You rated: <span className="text-amber-600 font-semibold">{rating} out of 5 stars.</span>
            </p>
          )}
        </div>

        {/* 2. User ID Input (Mock for backend association) */}
        <div className="mb-6">
          <label htmlFor="userId" className="block font-bold text-gray-800 mb-2">User ID (For Demo):</label>
          <input
            id="userId"
            type="text"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            placeholder="e.g., guest_reviewer_01"
            // Aesthetic form field: clean focus state, subtle padding
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700"
          />
        </div>
        
        {/* 3. Content */}
        <div className="mb-8">
          <label htmlFor="content" className="block font-bold text-gray-800 mb-2">Detailed Review:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Share your detailed experience and thoughts here..."
            // Aesthetic form field
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-y text-gray-700"
          />
        </div>

        {/* 4. Submit Button */}
        <button
          type="submit"
          // Aesthetic Button: Primary color, strong hover effect, slight shadow
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-extrabold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 tracking-wider disabled:bg-gray-400"
          disabled={rating === 0 || !content || !userIdInput}
        >
          Submit Review
        </button>
      </form>

      {/* Review List Section */}
      <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">All Reviews ({reviews.length})</h2>
      <div className="divide-y divide-gray-100 border-t border-gray-200">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {reviews.length === 0 && <p className="text-gray-500 italic p-4">There are currently no reviews for this post.</p>}
      </div>
    </div>
  );
};

export default ReviewComponent;