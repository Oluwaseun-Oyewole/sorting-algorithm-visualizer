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
  { value: 200, label: "6x" },
  { value: 50, label: "7x" },
  { value: 10, label: "8x" },
];

export function styleArrayElement<T>(array: T[]) {
  if (array.length < 10) return "w-20 ml-2";
  else if (array.length >= 10 && array.length < 20) return "w-14 text-xs ml-2";
  else if (array.length >= 20 && array.length < 40)
    return "w-5 text-[8px] ml-1";
  else if (array.length >= 40 && array.length < 80)
    return "w-2 text-[3px] ml-1";
  else if (array.length >= 80) return "w-1 text-[2px] ml-1";
  else return;
}
