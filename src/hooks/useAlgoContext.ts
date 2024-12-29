import { useContext } from "react";
import { AlgoContext } from "../context";

export const useAlgoContext = () => {
  const algoContext = useContext(AlgoContext);
  if (!algoContext) return;
  return algoContext;
};
