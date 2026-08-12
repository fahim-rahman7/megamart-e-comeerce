import React from "react";

const Loading = ({ 
  count = 10,
  className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 mt-5 md:mt-10"
}) => {
  const skeletonArray = Array.from({ length: count });

  return (
    <div className={className}>
      {skeletonArray.map((_, index) => (
        <div 
          key={index} 
          className="bg-primary/20 h-44 sm:h-72 md:h-98 animate-pulse rounded-xl"
        ></div>
      ))}
    </div>
  );
};

export default Loading;