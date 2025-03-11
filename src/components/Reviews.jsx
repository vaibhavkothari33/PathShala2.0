import { Star } from 'lucide-react';

const Reviews = ({ reviews }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={review.userImage}
                alt={review.userName}
                className="h-10 w-10 rounded-full"
              />
              <div className="ml-3">
                <p className="font-medium">{review.userName}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="mt-3 text-gray-600">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default Reviews; 