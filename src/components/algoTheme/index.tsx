import { useAlgoContext } from "../../hooks/useAlgoContext";

const AlgoTheme = () => {
  const context = useAlgoContext();
  return (
    <div className="">
      <button
        onClick={context?.toggle}
        className={
          context?.algoTheme === "dark" ? "text-white" : "text-gray-900"
        }
      >
        {context?.algoTheme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};

export default AlgoTheme;
