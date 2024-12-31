import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useRef, useState } from "react";

const BubbleSortChallenge = ({
  showCodeEditor,
  setShowEditor,
}: {
  showCodeEditor: boolean;
  setShowEditor: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [userCode, setUserCode] = useState<string>(`function Sort(arr) {
   // Practice sorting algorithms
   return arr
}`);
  const [results, setResults] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Test cases
  const testCases = [
    { input: [5, 2, 9, 1, 5, 6], expected: [1, 2, 5, 5, 6, 9] },
    { input: [3, 0, -1, 8, 7], expected: [-1, 0, 3, 7, 8] },

    { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
  ];

  // Your algorithm for comparison
  const bubbleSort = (arr: number[]): number[] => {
    const result = [...arr];
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result.length - 1 - i; j++) {
        if (result[j] > result[j + 1]) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
        }
      }
    }
    return result;
  };

  // Run the user's code and compare results
  const runUserCode = async () => {
    setRunning(true);
    const outputs: string[] = [];
    try {
      // eslint-disable-next-line no-new-func
      const userFunction = new Function(`${userCode}; return Sort;`)();
      for (const testCase of testCases) {
        const userOutput = userFunction([...testCase.input]);
        const expectedOutput = bubbleSort([...testCase.input]);

        if (JSON.stringify(userOutput) === JSON.stringify(expectedOutput)) {
          outputs.push(`✅ Passed for input: [${testCase.input.join(", ")}]`);
        } else {
          outputs.push(
            `❌ Failed for input: [${testCase.input.join(
              ", "
            )}] | Expected: [${expectedOutput.join(
              ", "
            )}], Got: [${userOutput.join(", ")}]`
          );
        }
      }
    } catch (error) {
      outputs.push(`❌ Error in user code: ${error}`);
    }
    setResults(outputs);
    setRunning(false);
  };

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        return setShowEditor(false);
      }
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [showCodeEditor]);

  return (
    <div>
      <div
        className={`fixed top-0 left-0 bg-gray-800 h-screen w-screen z-[70] opacity-70 transition-all ease-out duration-500 ${
          showCodeEditor ? "translate-x-0" : "-translate-x-full"
        }`}
        ref={ref}
      />
      <div
        className={`text-white absolute top-0 left-0 bg-gray-700 w-[90%] md:w-[35%] h-full transition-all ease-in-out duration-500 z-[500] ${
          showCodeEditor ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <p className="p-5 text-sm">
          Write your sort algorithm below and run the test cases!
        </p>
        <CodeMirror
          value={userCode}
          height="300px"
          extensions={[javascript()]}
          theme="dark"
          onChange={(value) => setUserCode(value)}
        />
        <div className="px-5">
          <button
            onClick={runUserCode}
            disabled={running}
            className={`bg-green-600 text-sm border-none px-7 rounded-md py-3 my-3 hover:opacity:90 transition-all ease-in-out duration-300 ${
              running ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {running ? "Running..." : "Run Test Cases"}
          </button>
          <div className="text-white">
            <h3>Results:</h3>
            <ul>
              {results.map((result, index) => (
                <li key={index} style={{ margin: "5px 0" }}>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BubbleSortChallenge;
