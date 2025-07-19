import OppenheimerBackdrop from "@/assets/oppenheimer-backdrops.webp";
import { cn } from "@/utils/utils";
import { Calendar, Clock, Grid3x3, Search, Star } from "lucide-react";

function BlurHeader() {
  return (
    <header className="sticky top-0 z-20 h-16 w-full">
      <div className="pointer-events-none absolute inset-0 z-[1] h-[20vh] backdrop-blur-[0.0625px] [mask-image:linear-gradient(0deg,transparent_0%,#000_12.5%,#000_25%,transparent_37.5%)]"></div>
      <div className="pointer-events-none absolute inset-0 z-[2] h-[20vh] backdrop-blur-[0.125px] [mask-image:linear-gradient(0deg,transparent_12.5%,#000_25%,#000_37.5%,transparent_50%)]"></div>
      <div className="pointer-events-none absolute inset-0 z-[3] h-[20vh] backdrop-blur-[0.25px] [mask-image:linear-gradient(0deg,transparent_25%,#000_37.5%,#000_50%,transparent_62.5%)]"></div>
      <div className="pointer-events-none absolute inset-0 z-[4] h-[20vh] backdrop-blur-[0.5px] [mask-image:linear-gradient(0deg,transparent_37.5%,#000_50%,#000_62.5%,transparent_75%)]"></div>
      <div className="pointer-events-none absolute inset-0 z-[5] h-[20vh] backdrop-blur-[1px] [mask-image:linear-gradient(0deg,transparent_50%,#000_62.5%,#000_75%,transparent_87.5%)]"></div>
      <div className="pointer-events-none absolute inset-0 z-[6] h-[20vh] backdrop-blur-[2px] [mask-image:linear-gradient(0deg,transparent_62.5%,#000_75%,#000_87.5%,transparent_100%)]"></div>
      <div className="pointer-events-none absolute inset-0 z-[7] h-[20vh] backdrop-blur-[4px] [mask-image:linear-gradient(0deg,transparent_75%,#000_87.5%,#000_100%,transparent_112.5%)]"></div>
      <div className="relative z-10 mx-auto grid h-full w-full max-w-screen-xl grid-cols-12 items-center px-8 text-white">
        <div className="col-span-2 flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="logo">
            🎟️
          </span>
          <span className="font-bold">Cinemagic</span>
        </div>
        <div className="col-start-7 flex justify-center">
          <Search aria-label="Search" className="h-6 w-6 cursor-pointer" />
        </div>
        <nav className="col-span-3 col-start-8 hidden gap-10 text-sm font-medium md:flex">
          <a href="#" className="hover:text-[#FFD400]">
            HOME
          </a>
          <a href="#" className="hover:text-[#FFD400]">
            MOVIE
          </a>
          <a href="#" className="hover:text-[#FFD400]">
            TV SHOW
          </a>
        </nav>
        <div className="col-start-12 flex justify-end">
          <Grid3x3 className="h-6 w-6 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}

export function Test() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <BlurHeader />
      <section className="relative h-[calc(100vh-64px)] w-full bg-cover bg-center" style={{ backgroundImage: `url(${OppenheimerBackdrop})` }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0)_70%)]"></div>
        <div className="relative grid h-full grid-cols-12 text-white">
          <div className="absolute left-0 top-[35%] grid w-full grid-cols-12 px-8">
            <div className="col-span-5 col-start-2">
              <h1 className="font-semibold leading-none" style={{ fontSize: "clamp(48px,6vw,96px)" }}>
                Oppenheimer
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-2 text-[15px] text-[#E0E0E0]">
                <span>Biography, Drama, History</span>
                <span className="mx-1">•</span>
                <Calendar className="mr-1 inline-block h-4 w-4" />
                <span>2023</span>
                <span className="mx-1">•</span>
                <Clock className="mr-1 inline-block h-4 w-4" />
                <span>3h 1m</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5" fill="#FFD400" color="#FFD400" />
                ))}
                <Star className="h-5 w-5" color="#4C4C4C" />
                <span className="ml-3 inline-flex h-[22px] w-[40px] items-center justify-center border border-[#E0E0E0] text-[12px] text-[#E0E0E0]">
                  PG-13
                </span>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="h-[44px] w-[152px] bg-[#FFD400] font-medium text-[#0C0B0E]">Book Tickets</button>
                <button className="h-[44px] w-[152px] border border-[#FFD400] font-medium text-[#FFD400]">Review</button>
                <button className="h-[44px] w-[152px] border border-[#A0A0A0] font-medium text-[#A0A0A0]">More</button>
              </div>
            </div>
            <div className="col-span-2 col-start-7 flex items-center justify-center gap-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <span key={idx} className={cn("h-[10px] w-[10px] rounded-full", idx === 0 ? "bg-white" : "bg-white/35")} />
              ))}
            </div>
            <div className="col-span-3 col-start-9 text-[14px] text-[#E0E0E0]">
              <p>
                Christopher Nolan <span className="text-[#FFD400]">: Director</span>
              </p>
              <p>
                Cillian Murphy, Emily Blunt, Matt Damon <span className="text-[#FFD400]">: Stars</span>
              </p>
              <p className="mt-4 max-w-[32ch]">
                The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Test;
