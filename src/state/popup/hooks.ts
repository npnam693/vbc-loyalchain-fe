import { useCallback } from "react";
import { toggle } from "../alert/alertSlice";
import { useAppDispatch } from "../hooks";
import { togglePopup } from "./popupSlice";

export function useToggleNoti() : (
  status: boolean,
  type: string,
  content: string
) => void {
  const dispatch = useAppDispatch();
  return useCallback((status: boolean, type: string, content: string) => {
    dispatch(togglePopup({ status, type, content }));
    dispatch(
      toggle({
        status: false,
      })
    );
  }, []);
}
