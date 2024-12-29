import AlgoTheme from "./components/algoTheme";
import { useAlgoContext } from "./hooks/useAlgoContext";

function App() {
  const context = useAlgoContext();
  return (
    <main
      className={`relative w-screen flex-col flex items-center h-screen justify-center ${
        context?.algoTheme === "dark"
          ? " bg-gray-900 text-white"
          : " bg-white text-gray-900"
      }`}
    >
      <AlgoTheme />
      <h1>Sort Visualizer</h1>
    </main>
  );
}

export default App;
