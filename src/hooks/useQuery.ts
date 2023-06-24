import { useCallback } from "react";
import { useQuery } from "react-query";

export function useQueryPage(): (
  queryKey: string,
  getData: () => void,
  renderData: (data: any) => void,
  page: number,
  size: number,
  nameFilter?: string,
  valueFilter?: string
) => void {
  return useCallback(
    (
      queryKey: string,
      getData: ({ page, size }: { page: number; size: number }) => any,
      renderData: (data: any) => void,
      page: number,
      size: number,
      nameFilter?: string,
      valueFilter?: string
    ) => {
      return useQuery(
        [queryKey, page, size, nameFilter, valueFilter],
        async () => {
          let response = await getData({
            page: page + 1,
            size: size,
          });
          return response;
        },
        {
          onSuccess: (response) => {
            return renderData(response.data);
          },
          keepPreviousData: false,
        }
      );
    },
    []
  );
}
