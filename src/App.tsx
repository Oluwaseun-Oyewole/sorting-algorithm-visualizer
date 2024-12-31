import { ChangeEvent, useEffect, useState } from "react";
import AlgoTheme from "./components/algoTheme";
import { useAlgoContext } from "./hooks/useAlgoContext";
import { generateRandomArray, options, speedOptions } from "./utils";

type SortAlgoType = "Merge" | "Bubble" | "Quick" | "Heap" | "Insertion";
function App() {
  const colors = ["red", "bg-green-700", "blue", "yellow", "purple"];
  const context = useAlgoContext();
  const [array, setArray] = useState(generateRandomArray() ?? []);
  const [range, setRange] = useState(array?.length);
  const [sortStates, setSortStates] = useState<{
    sortType?: SortAlgoType;
    speed?: number;
    isSorting?: boolean;
    isArraySorted?: boolean;
  }>({ speed: speedOptions[0]?.value });

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

  function BubbleSort<T extends number>(arr: T[], speed: T) {
    const step = async () => {
      try {
        for (let index = 0; index < arr.length; index++) {
          for (let j = 0; j < arr.length - 1 - index; j++) {
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
      }
    };
    step();
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
  }, [sortStates.isSorting]);

  console.log("is sorting", sortStates);
  // styling
  function styleArrayElement<T>(array: T[]) {
    if (array.length < 10) return "w-20 ml-2";
    else if (array.length >= 10 && array.length < 20)
      return "w-14 text-xs ml-2";
    else if (array.length >= 20 && array.length < 40)
      return "w-5 text-[8px] ml-1";
    else if (array.length >= 40 && array.length < 80)
      return "w-2 text-[3px] ml-1";
    else if (array.length >= 80) return "w-1 text-[2px] ml-1";
    else return;
  }

  const displayArrayGraph = () => (
    <ul className="w-[90%] text-center overflow-hidden flex items-start justify-center">
      {array?.map((arr, index) => {
        return (
          <li
            key={index}
            className={`flex items-center justify-center text-white font-medium rounded-sm shadow-xl hover:scale-105 transition-all duration-500 ease-in-out ${styleArrayElement(
              array
            )} ${sortStates.isArraySorted ? `${colors[1]}` : "bg-gray-500"}`}
            style={{
              height: `${arr + 50}px`,
            }}
          >
            {index}
            {arr}
          </li>
        );
      })}
    </ul>
  );

  return (
    <main
      className={`relative w-screen h-screen ${
        context?.algoTheme === "dark"
          ? " bg-gray-900 text-white"
          : " bg-gray-300 text-gray-900"
      }`}
    >
      {sortStates.isSorting && (
        <div className="fixed top-0 left-0 bg-gray-900 h-screen w-screen z-[50] opacity-20" />
      )}
      <div className="flex flex-col lg:flex-row items-center justify-around md:justify-between h-[25vh] md:h-[12vh] px-10">
        <button onClick={generateArray}>Generate array</button>
        <div className="flex items-center justify-center gap-5">
          {options.map((option) => (
            <button
              disabled={option?.disabled}
              key={option.value}
              value={option.value}
              className={`${
                option.value === sortStates?.sortType && "text-green-600"
              } disabled:cursor-not-allowed`}
              onClick={() => handleSortStates(option.value as SortAlgoType)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <AlgoTheme />
      </div>
      {sortStates.sortType && (
        <div className="text-center">
          <button
            onClick={handleSorting}
            className={`bg-green-700 text-white px-5 py-2 rounded-md text-sm hover:opacity-80 transition ease-in-out duration-500`}
          >
            Sort
          </button>
        </div>
      )}
      <div className="h-[70vh] md:h-[75vh] flex items-center justify-center">
        {displayArrayGraph()}
      </div>
      <div className="relative text-center flex items-center justify-center">
        <input
          type="range"
          name="range"
          min="5"
          max="100"
          value={range}
          onChange={onChangeHandler}
        />

        <div className="absolute top-16 right-0 md:top-0 md:right-10">
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
        </div>
      </div>
    </main>
  );
}

export default App;
