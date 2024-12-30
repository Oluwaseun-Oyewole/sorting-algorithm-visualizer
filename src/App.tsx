import { ChangeEvent, useState } from "react";
import AlgoTheme from "./components/algoTheme";
import { useAlgoContext } from "./hooks/useAlgoContext";
import { generateRandomArray, options, speedOptions } from "./utils";

type SortAlgoType = "Merge" | "Bubble" | "Quick" | "Heap" | "Insertion";
function App() {
  const context = useAlgoContext();
  const [array, setArray] = useState(generateRandomArray() ?? []);
  const [range, setRange] = useState(array?.length);
  const generateArray = () => setArray(generateRandomArray(range));
  const [sortStates, setSortStates] = useState<{
    sortType?: SortAlgoType;
    speed?: number;
  }>({});

  function styleArrayElement<T>(array: T[]) {
    if (array.length < 10) return "w-20 ml-2";
    else if (array.length > 10 && array.length < 20) return "w-14 text-xs ml-2";
    else if (array.length >= 20 && array.length < 40)
      return "w-5 text-[8px] ml-1";
    else if (array.length >= 40 && array.length < 80)
      return "w-2 text-[3px] ml-1";
    else if (array.length >= 80) return "w-1 text-[2px] ml-1";
    else return;
  }

  const displayArrayGraph = () => (
    <ul className="w-[90%] text-center overflow-hidden flex items-start justify-center">
      {array?.map((arr, index) => (
        <li
          key={index}
          className={`bg-gray-500 flex items-center justify-center text-white font-medium rounded-sm shadow-xl hover:scale-105 transition-all duration-500 ease-in-out ${styleArrayElement(
            array
          )}`}
          style={{ height: `${arr + 50}px` }}
        >
          {arr}
        </li>
      ))}
    </ul>
  );

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setRange(+e.target.value);
    generateArray();
  };

  function sortAlgorithms(sort: SortAlgoType) {
    switch (sort) {
      case "Bubble":
        return setTimeout(() => {
          console.log("running set timeout");
          // BubbleSort(array);
        }, sortStates.speed);

      default:
        break;
    }
  }

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

  return (
    <main
      className={`relative w-screen h-screen ${
        context?.algoTheme === "dark"
          ? " bg-gray-900 text-white"
          : " bg-gray-300 text-gray-900"
      }`}
    >
      <div className="flex flex-col lg:flex-row items-center justify-around md:justify-between h-[25vh] md:h-[15vh] px-10">
        <button onClick={generateArray}>Generate array</button>
        <div className="flex items-center justify-center gap-5">
          {options.map((option) => (
            <button
              key={option.value}
              value={option.value}
              className={`${
                option.value === sortStates?.sortType && "text-green-500"
              }`}
              onClick={() => handleSortStates(option.value as SortAlgoType)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <AlgoTheme />
      </div>
      <div className="h-[70vh] md:h-[75vh] flex items-center justify-center">
        {displayArrayGraph()}
      </div>
      <div className="relative text-center h-[10vh] flex items-center justify-center">
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
