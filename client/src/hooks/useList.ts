import { useMemo } from "react";

interface ListInfo {
  isFirst: boolean;
  isLast: boolean;
  isEven: boolean;
}

export function useList<T>(elements: T[]): Array<[T, ListInfo]> {
  return useMemo(() => {
    const size = elements.length;
    return elements.map((element, index) => {
      return [
        element,
        {
          isFirst: index === 0,
          isLast: index === size - 1,
          isEven: index % 2 === 0,
        },
      ];
    });
  }, [elements]);
}
