import { createContext, PropsWithChildren, useState } from "react";

type AlgoTheme = "light" | "dark";

export type AlgoType = {
  algoTheme: AlgoTheme;
  toggle: () => void;
};

export const AlgoContext = createContext<AlgoType | undefined>(undefined);

export const AlgoProvider = ({ children }: PropsWithChildren) => {
  const [algoTheme, setAlgoTheme] = useState<AlgoTheme>("dark");

  const toggle = () => {
    setAlgoTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AlgoContext.Provider value={{ algoTheme, toggle }}>
      {children}
    </AlgoContext.Provider>
  );
};
