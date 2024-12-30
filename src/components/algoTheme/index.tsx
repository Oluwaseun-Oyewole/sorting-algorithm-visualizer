import { useAlgoContext } from "../../hooks/useAlgoContext";

const AlgoTheme = () => {
  const context = useAlgoContext();
  return (
    <button
      onClick={context?.toggle}
      className={context?.algoTheme === "dark" ? "text-white" : "text-gray-900"}
    >
      {context?.algoTheme === "dark" ? "Light" : "Dark"}
    </button>
  );
};

export default AlgoTheme;
