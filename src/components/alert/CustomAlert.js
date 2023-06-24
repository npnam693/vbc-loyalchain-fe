import { useEffect } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { useToggleAlert } from "../../state/alert/hooks";
import { useAppSelector } from "../../state/hooks";
import Loading from "./Loading";
import React from "react"

function CustomAlert() {
  const { t } = useTranslation("common");

  const toggleAlert = useToggleAlert();

  const { status, timeOut } = useAppSelector((state) => state.alertState);

  useEffect(() => {
    if (timeOut) {
      setTimeout(() => {
        toggleAlert(false);
      }, timeOut);
    }
  }, [timeOut]);

  return <>{status ? <Loading /> : null}</>;
}

export default withTranslation("common")(CustomAlert);
