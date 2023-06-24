import { useCallback } from "react";
import { useAppDispatch } from "../hooks";
import { toggle } from "./alertSlice";

export function useToggleAlert(): (
  status: boolean,
  title?: string,
  timeOut?: number
) => void {
  const dispatch = useAppDispatch();
  return useCallback((status: boolean, title?: string, timeOut?: number) => {
    dispatch(toggle({ status, title, timeOut }));
  }, []);
}
