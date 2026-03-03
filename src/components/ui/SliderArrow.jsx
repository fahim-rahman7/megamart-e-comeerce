import { CgChevronLeft, CgChevronRight } from "react-icons/cg";

function NextArrow({ className, onClick }) {
  return (
    <div
      className={`${className} hidden md:block w-20 h-20 rounded-full bg-theme  absolute top-1/2 -translate-y-1/2 -right-10 p-2.5`}
      onClick={onClick}
    >
      <div className=" flex justify-center items-center w-full h-full bg-[#F3F9FB] rounded-full">
        <CgChevronRight className="text-brand text-3xl" />
      </div>
    </div>
  );
}

function PrevArrow({ className, onClick }) {
  return (
    <div
      className={`${className} hidden md:block w-20 h-20 rounded-full bg-theme  absolute top-1/2 z-50 -translate-y-1/2 -left-10 p-2.5`}
      onClick={onClick}
    >
      <div className="flex justify-center items-center w-full h-full bg-[#F3F9FB] rounded-full">
        <CgChevronLeft className="text-brand text-3xl"/>
      </div>
    </div>
  );
}
export { NextArrow, PrevArrow };
