import React from "react";
import { Dot } from "lucide-react";
const HeroSection = () => {
  return (
    <div className="w-full mt-24 items-center flex flex-col">
      <div className="relative flex border-2 border-red-500 pl-8 pr-4 py-2 rounded-full text-xs items-center text-red-500  font-medium" >
        <Dot className="absolute w-14 h-14 -left-2" />
        <span className="mx-auto">Recording</span>
      </div>
      <h3 className="text-6xl font-bold leading-normal text-textM-900 text-center">
        Podcasting made <span className="text-primaryM">easy</span> <br />&{" "}
        <span
          className="text-primaryM
          "
        >
          efficient
        </span>
        .
      </h3>
      <h5 className="text-lg font-medium text-slate-9">
        Record and publish at the speed of light
      </h5>
    </div>
  );
};

export default HeroSection;
