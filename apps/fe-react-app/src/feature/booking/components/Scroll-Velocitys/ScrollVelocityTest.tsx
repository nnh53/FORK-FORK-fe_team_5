import { useState } from "react";
import ScrollVelocity from "../../../../../Reactbits/ScrollVelocity/ScrollVelocity";

const ScrollVelocityTest = () => {
  const [velocity, setVelocity] = useState(100);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">ScrollVelocity Test</h1>

        {/* Velocity Control */}
        <div className="mb-8 max-w-md mx-auto">
          <label className="block text-sm font-medium mb-2 text-center">Velocity: {velocity}</label>
          <input
            type="range"
            min="-200"
            max="200"
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* ScrollVelocity Component */}
        <div className="w-full overflow-hidden">
          <ScrollVelocity
            texts={["Welcome", "to Cinema"]}
            velocity={velocity}
            className="text-4xl font-bold text-white"
            numCopies={8}
            parallaxClassName="parallax w-full overflow-hidden whitespace-nowrap"
            scrollerClassName="scroller flex"
          />
        </div>

        {/* Spacer for scrolling test */}
        <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 mt-16 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Scroll to see the effect!</h3>
            <p className="text-gray-400">The text above will react to your scrolling speed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollVelocityTest;

