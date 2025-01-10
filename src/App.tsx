import {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import muteIcon from "./assets/mute.jpg";
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
  }>({ speed: speedOptions[0]?.value, isArraySorted: false });
  const [activeIndex, setActiveIndex] = useState<{
    first: number;
    second: number;
    pivot?: number;
  } | null>(null);
  const [selectState, setSelectState] = useState<number | null>();
  const [sortMessage, setSortMessage] = useState("");
  const [showCodeEditor, setShowEditor] = useState(false);
  const [sortedArray, setSortedArray] = useState<number[]>([]);
  const removedDuplicateFromSortedArray = [...new Set<number>(sortedArray)];
  const [arrayGroupings, setArraysGroupings] = useState<{
    left?: number[];
    right?: number[];
  } | null>(null);
  const [sortedMerge, setSortedMerge] = useState<[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generateArray = () => {
    setSortStates((prev) => {
      return { ...prev, isArraySorted: false };
    });
    setSortMessage("");
    setArray(generateRandomArray(range));
    setSortedArray([]);
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setRange(+e.target.value);
    generateArray();
  };

  const handleSpeedChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortStates((prev) => {
      return { ...prev, speed: +e.target.value, isArraySorted: false };
    });
    setSelectState(+e.target.value);
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset to the beginning
    }
  };
  const playSound = () => {
    if (audioRef?.current) {
      // audioRef.current.play();
      // audioRef.current.loop = true;
    }
  };

  async function bubbleSort<T extends number>(arr: T[], speed: T) {
    setSortedArray([]);
    setArray([...arr]);
    playSound();
    try {
      setSortStates((prev) => {
        return { ...prev, isArraySorted: false, isSorting: true };
      });
      for (let index = 0; index < arr.length; index++) {
        for (let j = 0; j < arr.length - 1 - index; j++) {
          if (sortStates.isArraySorted) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray([...arr]);
          }
          if (index > 0)
            setSortedArray((prev) => [...prev, arr.length - index]);
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setActiveIndex((prev) => {
              return { ...prev, first: arr[j], second: arr[j + 1] };
            });
            await new Promise((resolve) => setTimeout(resolve, speed));
            setArray([...arr]);
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

  async function quickSortAlgo<T extends number>(arr: T[], speed: T) {
    setArray([...arr]);
    setSortStates((prev) => {
      return { ...prev, isSorting: true };
    });
    playSound();
    try {
      const partition = async (arrays: T[], low: number, high: number) => {
        const pivot = arrays[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
          if (arrays[j] <= pivot) {
            i++;
            setSortedArray((prev) => [...prev, arr[i]]);
            [arrays[i], arrays[j]] = [arrays[j], arrays[i]];
            setArray([...arrays]);
            setActiveIndex({ first: arr[i], second: arr[j], pivot });
            await new Promise((resolve) => setTimeout(resolve, speed));
          }
        }
        [arrays[i + 1], arrays[high]] = [arrays[high], arrays[i + 1]];
        setArray([...arrays]);
        await new Promise((resolve) => setTimeout(resolve, speed));
        return i + 1;
      };
      const sort = async (arrays: T[], low: number, high: number) => {
        if (low < high) {
          const pi = await partition(arrays, low, high);
          await sort(arrays, low, pi - 1);
          await sort(arrays, pi + 1, high);
        }
      };
      await sort(arr, 0, arr.length - 1);

      return arr;
    } catch (error) {
      return error;
    } finally {
      setSortStates((prev) => {
        return { ...prev, isArraySorted: true, isSorting: false };
      });
      stopSound();
    }
  }

  async function mergeSortAlgo<T extends number>(arr: T[], speed: T) {
    setSortStates((prev) => {
      return { ...prev, isSorting: true };
    });
    playSound();
    try {
      const merge = async (leftArr: T[], rightArray: T[]) => {
        const sortedArray = [];
        while (leftArr.length && rightArray.length) {
          if (leftArr[0] <= rightArray[0]) {
            sortedArray.push(leftArr.shift()!);
            setSortedMerge([...sortedArray] as []);
            await new Promise((resolve) => setTimeout(resolve, speed));
          } else {
            sortedArray.push(rightArray.shift());
            setSortedMerge([...sortedArray] as []);
            await new Promise((resolve) => setTimeout(resolve, speed));
          }
        }
        await new Promise((resolve) => setTimeout(resolve, speed));
        return [...sortedArray, ...leftArr, ...rightArray];
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mergeSort = async (arr: T[]): Promise<any> => {
        if (arr.length < 2) return arr;
        const mid = Math.floor(arr.length / 2);
        const leftArr = arr.slice(0, mid);
        const rightArr = arr.slice(mid);

        const sortedLeft = await mergeSort(leftArr);
        const sortedRight = await mergeSort(rightArr);
        setArraysGroupings((prev) => {
          return { ...prev, left: leftArr, right: rightArr };
        });
        await new Promise((resolve) => setTimeout(resolve, speed));
        return await merge(sortedLeft, sortedRight);
      };
      const sorted_array = await mergeSort(arr);
      setArray([...sorted_array]);
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
        return bubbleSort(arr, sortStates.speed!);
      case "Quick":
        return quickSortAlgo(arr, sortStates.speed!);
      case "Merge":
        return mergeSortAlgo(arr, sortStates.speed!);
      default:
        break;
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSortMessage("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [sortMessage]);

  const displayArrayGraph = () => (
    <ul className="w-[90%] text-center overflow-hidden flex justify-center relative z-[200] max-w-[60%]">
      {array?.map((arr, index) => {
        return (
          <li
            key={index}
            className={`flex items-center justify-center text-white font-medium rounded-sm shadow-xl hover:scale-105 transition-all duration-500 ease-in-out ${styleArrayElement(
              array
            )} ${
              sortStates.isArraySorted && context?.algoTheme === "dark"
                ? "bg-gray-500"
                : sortStates.isArraySorted && context?.algoTheme === "light"
                ? "bg-green-800"
                : `${
                    context?.algoTheme === "dark"
                      ? "bg-gray-500"
                      : "bg-gray-600"
                  } `
            } 
             ${
               removedDuplicateFromSortedArray.includes(index) &&
               sortStates.isSorting &&
               "bg-pink-500"
             }
             ${
               arrayGroupings?.left![index] &&
               sortStates?.isSorting &&
               "bg-purple-700"
             }
               ${
                 arrayGroupings?.right![index] &&
                 sortStates?.isSorting &&
                 "bg-purple-700"
               }
            ${sortedMerge[index] && sortStates?.isSorting && "bg-pink-800"}
            ${
              activeIndex?.first === array[index] &&
              sortStates.isSorting &&
              "bg-blue-500"
            }
              ${
                activeIndex?.second === array[index] &&
                sortStates.isSorting &&
                "bg-blue-500"
              }
              ${
                activeIndex?.pivot === arr &&
                sortStates.isSorting &&
                "bg-yellow-700"
              }
              ${
                sortedArray[index] === arr &&
                sortStates.isSorting &&
                "bg-blue-700"
              }
            `}
            style={{
              height: `${arr + 50}px`,
            }}
          >
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
        <div className="fixed top-0 left-0 bg-gray-900 h-screen w-screen z-[120] opacity-60 cursor-not-allowed" />
      )}

      <div
        className={`lg:h-[14vh] sticky top-0 left-0 z-[100] flex flex-col lg:flex-row items-center justify-around md:justify-between px-10 py-5 ${
          context?.algoTheme === "dark" ? "bg-gray-900" : "bg-gray-300"
        }`}
      >
        <button onClick={generateArray}>Generate array</button>
        <div className="flex items-center justify-center gap-5 py-4 lg:py-0">
          {options.map((option) => (
            <div key={option.value}>
              <button
                disabled={option?.disabled}
                value={option.value}
                className={`${
                  option.value === sortStates?.sortType && "text-green-600"
                } disabled:cursor-not-allowed hidden md:block disabled:opacity-50`}
                onClick={() => handleSort(option.value as SortAlgoType)}
              >
                {option.label}
              </button>
              <button
                disabled={option?.disabled}
                value={option.value}
                className={`${
                  option.value === sortStates?.sortType && "text-green-600"
                } disabled:cursor-not-allowed block md:hidden`}
                onClick={() => handleSort(option.value as SortAlgoType)}
              >
                {option.label?.split(" ")[0]}ss
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <button onClick={() => setShowEditor(true)}>Practice</button>
          <AlgoTheme />
        </div>
      </div>

      <div className="flex items-center justify-center pt-6">
        {displayArrayGraph()}
      </div>

      <div className="py-5 md:py-6 lg:py-0 gap-8 lg:absolute bottom-8 w-full text-center flex items-center justify-center">
        <input
          type="range"
          name="range"
          min="6"
          max="100"
          value={range}
          onChange={onChangeHandler}
        />

        <select
          id="select"
          value={selectState!}
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
        <button
          onClick={stopSound}
          className="hidden md:block z-[150] w-8 rounded-full"
        >
          <img src={muteIcon} alt="mute icon" className="rounded-full" />
        </button>
      </div>

      <div className="py-2 lg:py-0 w-full text-center flex md:hidden items-center justify-center">
        <button onClick={stopSound} className="block md:hidden z-[150]">
          Stop sound
        </button>
      </div>
    </main>
  );
}

export default App;
