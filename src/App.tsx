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
  }>({ speed: speedOptions[0]?.value });
  const [activeIndices, setActiveIndices] = useState<[number, number] | null>(
    null
  );
  const [selectState, setSelectState] = useState<number | null>();
  const [sortMessage, setSortMessage] = useState("");
  const [showCodeEditor, setShowEditor] = useState(false);
  const [sortedArray, setSortedArray] = useState<number[]>([]);
  const removedDuplicateFromSortedArray = [...new Set<number>(sortedArray)];
  const [midIndex, setMidIndex] = useState<number | null>();
  const [arrayGroupings, setArraysGroupings] = useState<{
    left?: number[];
    right?: number[];
  } | null>({});
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
      return { ...prev, speed: +e.target.value };
    });
    setSelectState(+e.target.value);
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
      audioRef.current.loop = true;
    }
  };

  async function bubbleSort<T extends number>(arr: T[], speed: T) {
    if (sortStates.isArraySorted) {
      setSortMessage("Array already sorted!!");
    } else {
      setSortStates((prev) => {
        return { ...prev, isArraySorted: false, isSorting: true };
      });
      playSound();
      try {
        for (let index = 0; index < arr.length; index++) {
          for (let j = 0; j < arr.length - 1 - index; j++) {
            setActiveIndices([j, j + 1]);
            if (index > 0)
              setSortedArray((prev) => [...prev, arr.length - index]);
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
  }

  console.log("remove duplicate", removedDuplicateFromSortedArray);
  async function quickSortAlgo<T extends number>(arr: T[], speed: T) {
    if (sortStates.isArraySorted) {
      setSortMessage("Array already sorted!!");
    } else {
      setSortStates((prev) => {
        return { ...prev, isSorting: true };
      });
      playSound();
      try {
        const partition = async (arrays: T[], low: number, high: number) => {
          const pivot = arrays[high];
          let i = low - 1;
          for (let j = low; j < high; j++) {
            setSortedArray((prev) => [...prev, pivot]);
            if (arrays[j] <= pivot) {
              i++;
              setActiveIndices([i, j]);
              [arrays[i], arrays[j]] = [arrays[j], arrays[i]];
              setArray([...arrays]);
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
  }

  async function mergeSortAlgo<T extends number>(arr: T[], speed: T) {
    if (sortStates.isArraySorted) {
      setSortMessage("Array already sorted!!");
    } else {
      setSortStates((prev) => {
        return { ...prev, isSorting: true };
      });
      playSound();
      try {
        const merge = async (leftArr: T[], rightArray: T[]) => {
          const sortedArray = [];
          while (leftArr.length && rightArray.length) {
            if (leftArr[0] <= rightArray[0]) {
              sortedArray.push(leftArr.shift());
              await new Promise((resolve) => setTimeout(resolve, speed));
            } else {
              sortedArray.push(rightArray.shift());
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

          console.log("first", sortedArray);
          // const leftGrouping: number[] = [];
          const rightGrouping: number[] = [];
          setMidIndex(mid);

          // setArraysGroupings((prev) => {
          //   return { ...prev, left: leftArr, right: rightArr };
          // });
          // leftArr?.map((_, index) => {
          //   leftGrouping.push(index);
          //   return setArraysGroupings((prev) => {
          //     return { ...prev, left: leftArr };
          //   });
          // });

          rightArr?.map((_, index) => {
            rightGrouping.push(index);
            return setArraysGroupings((prev) => {
              return { ...prev, right: rightGrouping };
            });
          });
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
                ? "bg-green-500"
                : sortStates.isArraySorted && context?.algoTheme === "light"
                ? "bg-green-800"
                : `${
                    context?.algoTheme === "dark"
                      ? "bg-gray-500"
                      : "bg-gray-600"
                  } `
            } 
            ${
              !removedDuplicateFromSortedArray.includes(index) &&
              sortStates.isSorting &&
              "bg-yellow-500"
            }
             ${
               removedDuplicateFromSortedArray.includes(index) &&
               sortStates.isSorting &&
               "bg-green-500"
             }
             ${
               activeIndices?.includes(index) &&
               sortStates?.isSorting &&
               "bg-red-600"
             }
             ${
               arrayGroupings?.right?.includes(index) &&
               sortStates?.isSorting &&
               "bg-black"
             }
             ${
               array[midIndex!] === array[index] &&
               sortStates?.isSorting &&
               "bg-blue-800"
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
        className={`lg:h-[12vh] sticky top-0 left-0 z-[100] flex flex-col lg:flex-row items-center justify-around md:justify-between px-10 py-5 ${
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
                onClick={() => handleSortStates(option.value as SortAlgoType)}
              >
                {option.label}
              </button>
              <button
                disabled={option?.disabled}
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
            onClick={() => handleSort(sortStates.sortType as SortAlgoType)}
            className={`bg-green-700 text-white px-5 py-2 rounded-md text-sm hover:opacity-80 transition ease-in-out duration-500`}
          >
            Sort
          </button>
        )}
      </div>

      <div>
        {sortMessage && <p className="text-center pb-3">{sortMessage}</p>}
      </div>

      <div className="flex items-center justify-center md:min-h-[65vh] overflow-y-scroll">
        {displayArrayGraph()}
      </div>

      <div className="py-5 md:py-6 lg:py-0 gap-8 lg:absolute bottom-4 w-full text-center flex items-center justify-center">
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
