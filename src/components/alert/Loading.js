import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useTranslation, withTranslation } from "react-i18next";
import { IMG_LOADING } from "../../constants/image";
import { useAppSelector } from "../../state/hooks";

function Loading() {

  const { title } = useAppSelector(state => state.alertState);

  const { t } = useTranslation("common");


  return (
        <SweetAlert
          title=""
          showConfirm={false}
          showCancel={false}
          style={{ display: "block" }}
          type={"controlled"}
          onConfirm={()=> null}
        >
          <div className="text-center">
            <img src={IMG_LOADING} style={{ height: "150px" }} alt="loading" />
            <div className="font-weight-bold font-size-lg mt-4 text-black">
              {t("processing")}
            </div>
            <p className="mb-0 mt-2 text-muted text-black">
              {title ? title : "Vui lòng chờ trong giây lát ..."}
            </p>
          </div>
        </SweetAlert>
  );
}

export default withTranslation("common")(Loading);
