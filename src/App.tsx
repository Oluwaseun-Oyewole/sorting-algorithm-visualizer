import {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Audio from "./assets/tick.mp3";
import AlgoTheme from "./components/algoTheme";
import BubbleSortChallenge from "./components/code";
import { useAlgoContext } from "./hooks/useAlgoContext";
import {
  generateRandomArray,
  options,
  speedOptions,
  styleArrayElement,
} from "./utils";

type SortAlgoType = "Merge" | "Bubble" | "Quick" | "Heap" | "Insertion";
function App() {
  const context = useAlgoContext();
  const [array, setArray] = useState(generateRandomArray() ?? []);
  const [range, setRange] = useState(array?.length);
  const [sortStates, setSortStates] = useState<{
    sortType?: SortAlgoType;
    speed?: number;
    isSorting?: boolean;
    isArraySorted?: boolean;
  }>({ speed: speedOptions[0]?.value });
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndices, setActiveIndices] = useState<[number, number] | null>(
    null
  );
  const [showCodeEditor, setShowEditor] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generateArray = () => {
    setSortStates((prev) => {
      return { ...prev, isArraySorted: false };
    });
    setArray(generateRandomArray(range));
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setRange(+e.target.value);
    generateArray();
  };

  const handleSpeedChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortStates((prev) => {
      return { ...prev, speed: +e.target.value };
    });
  };

  const handleSortStates = (sortType: SortAlgoType) => {
    setSortStates((prev) => {
      return { ...prev, sortType };
    });
  };
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset to the beginning
    }
  };
  const playSound = () => {
    if (audioRef?.current) {
      audioRef.current.play();
    }
  };

  async function BubbleSort<T extends number>(arr: T[], speed: T) {
    playSound();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    audioRef.current.loop = true;
    try {
      for (let index = 0; index < arr.length; index++) {
        for (let j = 0; j < arr.length - 1 - index; j++) {
          setActiveIndex(index);
          setActiveIndices([j, j + 1]);
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray([...arr]);
            // Delay for specified period
            await new Promise((resolve) => setTimeout(resolve, speed));
          }
        }
      }
    } catch (error) {
      return error;
    } finally {
      setSortStates((prev) => {
        return { ...prev, isArraySorted: true, isSorting: false };
      });
      stopSound();
    }
  }

  function handleSort(sort: SortAlgoType) {
    const arr = [...array];
    switch (sort) {
      case "Bubble":
        return BubbleSort(arr, sortStates.speed!);

      default:
        break;
    }
  }

  function handleSorting() {
    setSortStates((prev) => {
      return { ...prev, isSorting: true };
    });
  }

  useEffect(() => {
    handleSort(sortStates.sortType as SortAlgoType);
    if (sortStates.isSorting) {
      playSound();
    }
  }, [sortStates.isSorting]);

  const displayArrayGraph = () => (
    <ul className="z-[60] w-[90%] text-center overflow-hidden flex items-start justify-center">
      {array?.map((arr, index) => {
        return (
          <li
            key={index}
            className={`flex items-center justify-center text-white font-medium rounded-sm shadow-xl hover:scale-105 transition-all duration-500 ease-in-out ${styleArrayElement(
              array
            )} ${sortStates.isArraySorted ? "bg-green-800" : "bg-gray-500"} ${
              activeIndex === index && sortStates.isSorting && "bg-blue-800"
            }`}
            style={{
              height: `${arr + 50}px`,
              backgroundColor:
                activeIndices?.includes(index) && sortStates.isSorting
                  ? "#991b1b"
                  : "",
            }}
          >
            {index}
            {arr}
          </li>
        );
      })}
    </ul>
  );

  useLayoutEffect(() => {
    if (context?.algoTheme === "light")
      document.body.style.backgroundColor = "#d1d5db";
    else {
      document.body.style.backgroundColor = "#111827";
    }
  }, [context?.algoTheme]);

  return (
    <main
      className={`relative w-screen min-h-screen  ${
        context?.algoTheme === "dark"
          ? " bg-gray-900 text-white"
          : " bg-gray-300 text-gray-900"
      }`}
    >
      <audio ref={audioRef} src={Audio} />

      <BubbleSortChallenge
        showCodeEditor={showCodeEditor}
        setShowEditor={setShowEditor}
      />

      {sortStates.isSorting && (
        <div className="fixed top-0 left-0 bg-gray-900 h-screen w-screen z-[50] opacity-60 cursor-not-allowed" />
      )}

      <div
        className={`lg:h-[10vh] sticky top-0 left-0 z-[100] flex flex-col lg:flex-row items-center justify-around md:justify-between px-10 py-5 ${
          context?.algoTheme === "dark" ? "bg-gray-900" : "bg-gray-300"
        }`}
      >
        <button onClick={generateArray}>Generate array</button>
        <div className="flex items-center justify-center gap-5 py-4 lg:py-0">
          {options.map((option) => (
            <div>
              <button
                disabled={option?.disabled}
                key={option.value}
                value={option.value}
                className={`${
                  option.value === sortStates?.sortType && "text-green-600"
                } disabled:cursor-not-allowed hidden md:block`}
                onClick={() => handleSortStates(option.value as SortAlgoType)}
              >
                {option.label}
              </button>
              <button
                disabled={option?.disabled}
                key={option.value}
                value={option.value}
                className={`${
                  option.value === sortStates?.sortType && "text-green-600"
                } disabled:cursor-not-allowed block md:hidden`}
                onClick={() => handleSortStates(option.value as SortAlgoType)}
              >
                {option.label?.split(" ")[0]}
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <button onClick={() => setShowEditor(true)}>Practice</button>
          <AlgoTheme />
        </div>
      </div>

      <div className="text-center py-5">
        {sortStates.sortType && (
          <button
            onClick={handleSorting}
            className={`bg-green-700 text-white px-5 py-2 rounded-md text-sm hover:opacity-80 transition ease-in-out duration-500`}
          >
            Sort
          </button>
        )}
      </div>

      <div className="flex items-center justify-center md:h-[65vh] overflow-y-scroll">
        {displayArrayGraph()}
      </div>

      <div className="py-5 md:py-6 lg:py-0 gap-8 lg:absolute bottom-4 w-full text-center flex items-center justify-center">
        <input
          type="range"
          name="range"
          min="5"
          max="100"
          value={range}
          onChange={onChangeHandler}
        />

        <select
          id="select"
          value={sortStates.sortType}
          onChange={handleSpeedChange}
          className={`border-2 border-gray-600 rounded py-2 w-[130px] ${
            context?.algoTheme === "dark" ? "bg-gray-900" : "bg-gray-300"
          }`}
        >
          {speedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button onClick={stopSound} className="hidden md:block z-[10000]">
          Stop sound
        </button>
      </div>

      <div className="py-2 lg:py-0 w-full text-center flex md:hidden items-center justify-center">
        <button onClick={stopSound} className="block md:hidden z-[10000]">
          Stop sound
        </button>
      </div>
    </main>
  );
}

export default App;
