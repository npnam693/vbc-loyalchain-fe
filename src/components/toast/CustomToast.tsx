import React, { useEffect } from "react";
import { toast, Zoom } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { clearPopup } from "../../state/popup/popupSlice";

const CustomToast = () => {
  const { status, content, type } = useAppSelector((state) => state.popupState);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status) {
      if (type === "success") {
        toast.success(content, { transition: Zoom });
      } else {
        toast.error(content, { transition: Zoom });
        //Need to handle error here
      }
      dispatch(clearPopup());
    }
  }, [status, content]);
  return <></>;
};

export default CustomToast;
