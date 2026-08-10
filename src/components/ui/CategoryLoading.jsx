import React from "react";

const CategoryLoading = ({ 
  count = 8, // The image shows 8 items, so 8 is a good default
  className = "flex justify-between items-center gap-4 overflow-x-auto" // Adjust default wrapper classes as needed
}) => {
  const skeletonArray = Array.from({ length: count });

  return (
    <div className={className}>
      {skeletonArray.map((_, index) => (
        <div key={index} className="flex flex-col items-center justify-center">
          {/* Circular Image Skeleton */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/20 animate-pulse"></div>
          
          {/* Text Label Skeleton */}
          <div className="h-4 w-16 md:w-20 bg-primary/20 rounded-md mt-4 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

export default CategoryLoading;