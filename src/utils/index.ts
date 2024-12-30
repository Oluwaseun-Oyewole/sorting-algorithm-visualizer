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
  { value: "Merge", label: "Merge Sort" },
  { value: "Quick", label: "Quick Sort" },
  { value: "Heap", label: "Heap Sort" },
  { value: "Bubble", label: "Bubble Sort" },
  { value: "Insertion", label: "Insertion Sort" },
];

export const speedOptions = [
  { value: "", label: "Speed" },
  { value: 50, label: "1x" },
  { value: 40, label: "2x" },
  { value: 30, label: "3x" },
  { value: 10, label: "4x" },
  { value: 5, label: "5x" },
];
