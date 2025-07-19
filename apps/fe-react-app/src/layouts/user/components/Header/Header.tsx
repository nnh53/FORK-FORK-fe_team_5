export function Header() {
  return (
    <div className="relative w-full overflow-y-auto">
      <header className="sticky top-0 z-20 mx-auto flex w-full items-center justify-between p-5 sm:px-10">
        <div className="pointer-events-none absolute inset-0 z-[1] h-[20vh] backdrop-blur-[0.0625px] [mask-image:linear-gradient(0deg,transparent_0%,#000_12.5%,#000_25%,transparent_37.5%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[2] h-[20vh] backdrop-blur-[0.125px] [mask-image:linear-gradient(0deg,transparent_12.5%,#000_25%,#000_37.5%,transparent_50%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[3] h-[20vh] backdrop-blur-[0.25px] [mask-image:linear-gradient(0deg,transparent_25%,#000_37.5%,#000_50%,transparent_62.5%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[4] h-[20vh] backdrop-blur-[0.5px] [mask-image:linear-gradient(0deg,transparent_37.5%,#000_50%,#000_62.5%,transparent_75%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[5] h-[20vh] backdrop-blur-[1px] [mask-image:linear-gradient(0deg,transparent_50%,#000_62.5%,#000_75%,transparent_87.5%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[6] h-[20vh] backdrop-blur-[2px] [mask-image:linear-gradient(0deg,transparent_62.5%,#000_75%,#000_87.5%,transparent_100%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[7] h-[20vh] backdrop-blur-[4px] [mask-image:linear-gradient(0deg,transparent_75%,#000_87.5%,#000_100%,transparent_112.5%)]"></div>
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <a className="z-[10]" href="/">
            Magicui
          </a>
          <div className="z-[10]">
            <a href="#" className="">
              Get Started
            </a>
          </div>
        </div>
      </header>
      {/* <div className="w-full">
        <div className="mx-auto flex h-[100vh] w-full max-w-3xl flex-col items-center justify-center gap-y-5">
          <img className="h-20 w-20" src="/android-chrome-512x512.png" alt="MagicUI Logo" />
          <h1 className="text-balance text-center text-4xl font-bold">UI library for Design Engineers</h1>
          <p className="text-balance text-center">
            50+ open-source animated components built with React, Typescript, Tailwind CSS, and Framer Motion. Save thousands of hours, create a
            beautiful landing page, and convert your visitors into customers.
          </p>
        </div>
      </div> */}
    </div>
  );
}
