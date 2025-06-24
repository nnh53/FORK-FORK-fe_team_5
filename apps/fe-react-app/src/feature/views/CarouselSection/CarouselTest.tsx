import CarouselSection, { type MovieData } from "./CarouselSection";

// Mock data for testing
const mockMovies: MovieData[] = [
  {
    id: 1,
    title: "Avengers: Endgame",
    description: "The epic conclusion to the Infinity Saga that became a global phenomenon.",
    icon: "/public/images/movie1.jpg",
  },
  {
    id: 2,
    title: "Spider-Man: No Way Home",
    description: "Peter Parker's identity is revealed and he must face villains from across the multiverse.",
    icon: "/public/images/movie2.jpg",
  },
  {
    id: 3,
    title: "The Batman",
    description: "A new take on the Caped Crusader in his early years as Gotham's protector.",
    icon: "/public/images/movie3.jpg",
  },
  {
    id: 4,
    title: "Doctor Strange: Multiverse of Madness",
    description: "The Master of the Mystic Arts explores the multiverse and faces new threats.",
    icon: "/public/images/movie4.jpg",
  },
  {
    id: 5,
    title: "Top Gun: Maverick",
    description: "Pete 'Maverick' Mitchell returns to the Top Gun academy as an instructor.",
    icon: "/public/images/movie5.jpg",
  },
  {
    id: 6,
    title: "Black Panther: Wakanda Forever",
    description: "The nation of Wakanda fights to protect their home from intervening world powers.",
    icon: "/public/images/movie6.jpg",
  },
];

const CarouselTest = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Carousel Section Test</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Testing CarouselSection Component</h2>
          <p className="text-gray-600 mb-4">This page is for testing the CarouselSection component with mock movie data.</p>
        </div>

        {/* Carousel Section Test */}
        <CarouselSection movies={mockMovies} />

        <div className="mt-16 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Test Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Component:</h4>
              <p className="text-gray-600">CarouselSection</p>
            </div>
            <div>
              <h4 className="font-medium">Total Movies:</h4>
              <p className="text-gray-600">{mockMovies.length}</p>
            </div>
            <div>
              <h4 className="font-medium">Features Tested:</h4>
              <ul className="text-gray-600 list-disc list-inside">
                <li>Carousel navigation</li>
                <li>Responsive design</li>
                <li>GSAP animations</li>
                <li>Card layout</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Mock Data:</h4>
              <p className="text-gray-600">6 sample movies with titles and descriptions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselTest;
