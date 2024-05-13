import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import img1 from "../../assets/img-1.jpg";
import img2 from "../../assets/img-2.jpg";
import img3 from "../../assets/img-3.jpg";
import img4 from "../../assets/img-4.jpg";
import img5 from "../../assets/img-5.jpg";
import img6 from "../../assets/img-6.webp";
import img7 from "../../assets/img-7.jpg";
import img8 from "../../assets/img-8.avif";
import img9 from "../../assets/img-9.jpg";
import img10 from "../../assets/img-10.webp";
import img11 from "../../assets/img-11.jpg";
import img12 from "../../assets/img-12.avif";
import img13 from "../../assets/img-13.webp";
import img14 from "../../assets/img-14.png";
import img15 from "../../assets/img-15.jpg";
import img16 from "../../assets/img-15.avif";

const Home = () => {
  return (
    <>
      <section className="w-full px-8 pt-10 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
        <div>
          <span class="block text-xs md:text-xl text-blue-900 font-medium">
            Empower Yourself Through Learning
          </span>
          <h3 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Explore New Horizons
          </h3>
          <p class="text-base md:text-lg text-gray-800 my-4 md:my-6">
            Embark on a journey of knowledge and discovery with our extensive
            selection of courses meticulously crafted to inspire curiosity and
            drive personal development.
          </p>
          <button class="inline-block rounded-md border border-transparent bg-gray-800 px-8 py-3 text-center font-medium text-white hover:bg-gray-700">
            Start Learning
          </button>
        </div>

        <ShuffleGrid />
      </section>
    </>
  );
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: img1,
  },
  {
    id: 2,
    src: img2,
  },
  {
    id: 3,
    src: img3,
  },
  {
    id: 4,
    src: img4,
  },
  {
    id: 5,
    src: img5,
  },
  {
    id: 6,
    src: img6,
  },
  {
    id: 7,
    src: img7,
  },
  {
    id: 8,
    src: img8,
  },
  {
    id: 9,
    src: img9,
  },
  {
    id: 10,
    src: img10,
  },
  {
    id: 11,
    src: img11,
  },
  {
    id: 12,
    src: img12,
  },
  {
    id: 13,
    src: img13,
  },
  {
    id: 14,
    src: img14,
  },
  {
    id: 15,
    src: img15,
  },
  {
    id: 16,
    src: img16,
  },
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default Home;
