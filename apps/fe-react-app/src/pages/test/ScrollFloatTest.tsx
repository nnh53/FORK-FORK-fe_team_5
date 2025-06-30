import ScrollFloat from "@/components/Reactbits/reactbit-animations/ScrollFloat/ScrollFloat";
import TestNavigation from "@/components/shared/TestNavigation";
import UserLayout from "@/layouts/user/UserLayout";

const ScrollFloatTest = () => {
  return (
    <UserLayout>
      <TestNavigation />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Header Section */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">ScrollFloat Component Test</h1>
            <p className="text-lg text-gray-300">Scroll down để xem hiệu ứng ScrollFloat</p>
          </div>
        </div>

        {/* Test Section 1 - Usage mẫu */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-8 text-gray-300">Test 1: Usage mẫu</h2>
            <ScrollFloat animationDuration={1} ease="back.inOut(2)" scrollStart="center bottom+=50%" scrollEnd="bottom bottom-=40%" stagger={0.03}>
              reactbits
            </ScrollFloat>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-96"></div>

        {/* Test Section 2 - Custom text */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-8 text-gray-300">Test 2: Custom Text</h2>
            <ScrollFloat
              animationDuration={1.5}
              ease="elastic.out(1, 0.3)"
              scrollStart="top bottom-=10%"
              scrollEnd="bottom top+=10%"
              stagger={0.05}
              containerClassName="text-6xl font-bold"
              textClassName="text-orange-400"
            >
              FCinema Experience
            </ScrollFloat>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-96"></div>

        {/* Test Section 3 - Multiple lines */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-2xl font-semibold mb-8 text-gray-300">Test 3: Multiple ScrollFloat</h2>

            <ScrollFloat
              animationDuration={0.8}
              ease="power2.out"
              scrollStart="center bottom"
              scrollEnd="center top"
              stagger={0.02}
              containerClassName="text-4xl font-bold"
              textClassName="text-blue-400"
            >
              Welcome to
            </ScrollFloat>

            <ScrollFloat
              animationDuration={1.2}
              ease="bounce.out"
              scrollStart="center bottom+=20%"
              scrollEnd="center top-=20%"
              stagger={0.04}
              containerClassName="text-5xl font-bold"
              textClassName="text-yellow-400"
            >
              Our Cinema
            </ScrollFloat>

            <ScrollFloat
              animationDuration={1}
              ease="back.out(1.7)"
              scrollStart="center bottom+=40%"
              scrollEnd="center top-=40%"
              stagger={0.03}
              containerClassName="text-3xl"
              textClassName="text-green-400"
            >
              Enjoy the Experience
            </ScrollFloat>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-96"></div>

        {/* Test Section 4 - Long text */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-8 text-gray-300">Test 4: Long Text</h2>
            <ScrollFloat
              animationDuration={2}
              ease="power3.inOut"
              scrollStart="top bottom-=20%"
              scrollEnd="bottom top+=20%"
              stagger={0.01}
              containerClassName="text-3xl font-semibold"
              textClassName="text-purple-400"
            >
              The Ultimate Movie Experience Awaits You
            </ScrollFloat>
          </div>
        </section>

        {/* Footer */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-300">End of ScrollFloat Tests</h2>
            <p className="text-lg text-gray-500 mt-4">Scroll back up để xem lại các hiệu ứng</p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ScrollFloatTest;
