import FCinemaLogo from "@/assets/FCinema_Logo.webp";
import OppenheimerBackdrop from "@/assets/oppenheimer-backdrops.webp";
import { Calendar, Clock, Grid3x3, Search, Star } from "lucide-react";

function BlurHeader() {
  return (
    <header className="sticky top-0 z-20 w-full">
      <div className="pointer-events-none absolute inset-0 z-[1] h-[20vh] [mask-image:linear-gradient(0deg,transparent_0%,#000_12.5%,#000_25%,transparent_37.5%)] backdrop-blur-[0.0625px]" />
      <div className="pointer-events-none absolute inset-0 z-[2] h-[20vh] [mask-image:linear-gradient(0deg,transparent_12.5%,#000_25%,#000_37.5%,transparent_50%)] backdrop-blur-[0.125px]" />
      <div className="pointer-events-none absolute inset-0 z-[3] h-[20vh] [mask-image:linear-gradient(0deg,transparent_25%,#000_37.5%,#000_50%,transparent_62.5%)] backdrop-blur-[0.25px]" />
      <div className="pointer-events-none absolute inset-0 z-[4] h-[20vh] [mask-image:linear-gradient(0deg,transparent_37.5%,#000_50%,#000_62.5%,transparent_75%)] backdrop-blur-[0.5px]" />
      <div className="pointer-events-none absolute inset-0 z-[5] h-[20vh] [mask-image:linear-gradient(0deg,transparent_50%,#000_62.5%,#000_75%,transparent_87.5%)] backdrop-blur-[1px]" />
      <div className="pointer-events-none absolute inset-0 z-[6] h-[20vh] [mask-image:linear-gradient(0deg,transparent_62.5%,#000_75%,#000_87.5%,transparent_100%)] backdrop-blur-[2px]" />
      <div className="pointer-events-none absolute inset-0 z-[7] h-[20vh] [mask-image:linear-gradient(0deg,transparent_75%,#000_87.5%,#000_100%,transparent_112.5%)] backdrop-blur-[4px]" />
      <div className="relative grid h-16 grid-cols-12 items-center text-white">
        <div className="col-span-2 flex items-center gap-2 pl-8">
          <img src={FCinemaLogo} alt="Cinemagic" className="size-6" />
          <span className="font-semibold">Cinemagic</span>
        </div>
        <Search aria-label="Search" className="col-start-7 mx-auto h-6 w-6 cursor-pointer" />
        <nav className="col-span-3 col-start-8 flex items-center justify-center gap-10 text-sm font-medium uppercase">
          <a href="#">HOME</a>
          <a href="#">MOVIE</a>
          <a href="#">TV SHOW</a>
        </nav>
        <Grid3x3 className="col-start-12 h-6 w-6 cursor-pointer justify-self-end pr-8" />
      </div>
    </header>
  );
}

export function Test() {
  return (
    <div className="relative h-screen w-full overflow-hidden text-white">
      <BlurHeader />
      <div className="relative h-[calc(100vh-64px)] w-full">
        <img src={OppenheimerBackdrop} alt="Oppenheimer backdrop" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45),transparent)]" />
        <div className="relative z-10 grid h-full grid-cols-12 px-8">
          <div className="col-span-5 col-start-2 self-start pt-[35vh]">
            <h1 className="text-[clamp(3rem,6vw,6rem)] leading-none font-semibold">Oppenheimer</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 text-[15px] text-[#E0E0E0]">
              <span>Biography, Drama, History</span>
              <span className="mx-2">•</span>
              <Calendar className="h-4 w-4" />
              <span>2023</span>
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4" />
              <span>3h 1m</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5" fill={i < 4 ? "#FFD400" : "none"} color={i < 4 ? "#FFD400" : "#4C4C4C"} />
              ))}
              <span className="ml-4 rounded-full border border-[#E0E0E0] px-2 py-0.5 text-[12px] text-[#E0E0E0]">PG-13</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="h-11 w-38 rounded bg-[#FFD400] px-4 text-sm font-medium text-[#0C0B0E]">Book Tickets</button>
              <button className="h-11 w-38 rounded border border-[#FFD400] px-4 text-sm font-medium text-[#FFD400]">Review</button>
              <button className="h-11 w-38 rounded border border-[#A0A0A0] px-4 text-sm font-medium text-[#A0A0A0]">More</button>
            </div>
          </div>
          <div className="col-span-2 col-start-7 flex items-center justify-center pt-[35vh]">
            <div className="flex gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i === 0 ? "size-2.5 rounded-full bg-white" : "size-2.5 rounded-full bg-white/35"} />
              ))}
            </div>
          </div>
          <div className="col-span-3 col-start-9 pt-[35vh]">
            <p className="leading-6 text-[#E0E0E0]">
              Christopher Nolan : <span className="text-[#FFD400]">Director</span>
              <br />
              Cillian Murphy, Emily Blunt, Matt Damon : <span className="text-[#FFD400]">Stars</span>
            </p>
            <p className="mt-4 max-w-[32ch] text-sm text-[#E0E0E0]">
              The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;
