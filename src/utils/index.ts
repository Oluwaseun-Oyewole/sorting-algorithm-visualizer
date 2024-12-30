export const generateRandomArray = (size?: number) => {
  return Array.from(
    { length: size ?? 5 },
    () => Math.floor(Math.random() * (500 - 40 + 1)) + 40
  );
};

interface Option {
  value: string;
  label: string;
}
export const options: Option[] = [
  { value: "Merge Sort", label: "Merge" },
  { value: "Quick Sort", label: "Quick" },
  { value: "Heap Sort", label: "Heap" },
  { value: "Bubble Sort", label: "Bubble" },
];
