// O(n²)
export default function BubbleSort<TSort>(arr: TSort[]) {
  for (let index = 0; index < arr.length; index++) {
    for (let j = 0; j < arr.length - 1 - index; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
