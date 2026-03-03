import React from "react";
import Banner from "../components/home/Banner";
import BestDeal from "../components/home/BestDeal";
import Categories from "../components/home/Categories";
import TopElectronics from "../components/home/TopElectronics";
import DailyEssentials from "../components/home/DailyEssentials";

const Home = () => {
  return (
    <div>
      <Banner />
      <BestDeal />
      <Categories />
      <TopElectronics />
      <DailyEssentials />
    </div>
  );
};

export default Home;
