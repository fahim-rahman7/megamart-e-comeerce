import React from "react";

const DailyEssentialsLoading = ({ 
  count = 8, // Defaulting to 8 to match the image
  className = "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4" 
}) => {
  const skeletonArray = Array.from({ length: count });

  return (
    <div className={className}>
      {skeletonArray.map((_, index) => (
        <div key={index} className="flex flex-col items-center justify-center gap-3">
          {/* Rounded Square Image Skeleton */}
          {/* Using aspect-square ensures it stays perfectly proportional no matter the screen size */}
          <div className="w-full max-w-[130px] aspect-square rounded-2xl bg-primary/20 animate-pulse"></div>
          
          <div className="flex flex-col items-center gap-2 w-full mt-1">
            {/* Title Line Skeleton (Longer) */}
            <div className="h-4 w-3/4 bg-primary/20 rounded-md animate-pulse"></div>
            
            {/* Price Line Skeleton (Shorter) */}
            <div className="h-3 w-1/2 bg-primary/20 rounded-md animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyEssentialsLoading;