export const generateRandomArray = (size?: number) => {
  return Array.from(
    { length: size ?? 5 },
    () => Math.floor(Math.random() * (500 - 40 + 1)) + 40
  );
};

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}
export const options: Option[] = [
  { value: "Merge", label: "Merge Sort", disabled: true },
  { value: "Quick", label: "Quick Sort", disabled: true },
  { value: "Heap", label: "Heap Sort", disabled: true },
  { value: "Bubble", label: "Bubble Sort" },
  { value: "Insertion", label: "Insertion Sort", disabled: true },
];

export const speedOptions = [
  { value: 4000, label: "Speed" },
  { value: 3500, label: "1x" },
  { value: 2500, label: "2x" },
  { value: 1500, label: "3x" },
  { value: 1000, label: "4x" },
  { value: 500, label: "5x" },
];
