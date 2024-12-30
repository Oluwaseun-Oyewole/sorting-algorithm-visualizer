import { ChangeEvent, useState } from "react";
import AlgoTheme from "./components/algoTheme";
import { useAlgoContext } from "./hooks/useAlgoContext";
import { generateRandomArray, options } from "./utils";

function App() {
  const context = useAlgoContext();
  const [array, setArray] = useState(generateRandomArray());
  const [range, setRange] = useState(array.length);
  const generateArray = () => setArray(generateRandomArray(range));
  const [selectedValue, setSelectedValue] = useState("Merge");

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  };

  const displayArrayGraph = () => (
    <ul className="flex items-start gap-3 w-3/5 justify-center bg-green-900">
      {array?.map((arr, index) => (
        <li
          key={index}
          className={`w-20 bg-gray-500 flex items-center justify-center text-white font-medium rounded-sm shadow-xl hover:scale-105 transition-all duration-500 ease-in-out`}
          style={{ height: `${arr}px` }}
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

  return (
    <main
      className={`relative w-screen  h-screen ${
        context?.algoTheme === "dark"
          ? " bg-gray-900 text-white"
          : " bg-gray-300 text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between h-[15vh] px-10">
        <button onClick={generateArray}>Generate array</button>
        <div className="flex items-center gap-5">
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
            value={selectedValue}
            onChange={handleSelectChange}
            className={`border-2 border-gray-600 rounded py-2 w-[180px] ${
              context?.algoTheme === "dark" ? "bg-gray-900" : "bg-gray-300"
            }`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <AlgoTheme />
      </div>
      <div className="h-[85vh] flex items-center justify-center">
        {displayArrayGraph()}
      </div>
    </main>
  );
}

export default App;
