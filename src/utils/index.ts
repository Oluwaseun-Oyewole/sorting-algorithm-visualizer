export const generateRandomArray = (size?: number) => {
  return Array.from(
    { length: size ?? 50 },
    () => Math.floor(Math.random() * (500 - 40 + 1)) + 40
  );
};

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}
export const options: Option[] = [
  { value: "Merge", label: "Merge Sort" },
  { value: "Quick", label: "Quick Sort" },
  { value: "Heap", label: "Heap Sort", disabled: true },
  { value: "Bubble", label: "Bubble Sort" },
  // { value: "Insertion", label: "Insertion Sort", disabled: true },
];

export const speedOptions = [
  { value: 500, label: "Speed" },
  { value: 1200, label: "1x" },
  { value: 800, label: "2x" },
  { value: 400, label: "3x" },
  { value: 250, label: "4x" },
  { value: 150, label: "5x" },
  { value: 80, label: "6x" },
  { value: 30, label: "7x" },
  { value: 2, label: "8x" },
];

export function styleArrayElement<T>(array: T[]) {
  if (array.length < 10) return "w-14 ml-2";
  else if (array.length >= 10 && array.length < 20) return "w-8 text-xs ml-2";
  else if (array.length >= 20 && array.length < 40)
    return "w-5 text-[5px] ml-1";
  else if (array.length >= 40 && array.length < 80)
    return "w-2 text-[3px] ml-1";
  else if (array.length >= 80) return "w-1 text-[2px] ml-1";
  else return;
}
