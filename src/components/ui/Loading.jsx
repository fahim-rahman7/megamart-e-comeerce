import React from "react";

const Loading = ({ 
  count = 10, // Default to 10 items if not specified
  className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10" // Default grid layout
}) => {
  // Create an array with a length of 'count' so we can map over it
  const skeletonArray = Array.from({ length: count });

  return (
    <div className={className}>
      {skeletonArray.map((_, index) => (
        <div key={index} className="bg-primary/20 h-98 animate-pulse rounded-xl"></div>
      ))}
    </div>
  );
};

export default Loading;