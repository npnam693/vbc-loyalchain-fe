import React, { useState, useTransition } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { AlertCircle } from "react-feather";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "reactstrap";
import { toggle } from "../../state/alert/alertSlice";
import { useAppDispatch, useAppSelector } from "../../state/hooks";

function ConfirmAlert({
  title,
  onConfirm,
  onCancel,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const distpatch = useAppDispatch();

  const { t } = useTranslation("common");

  const handleConfirm = () => {};

  const [modal, setModal] = useState(true);

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <Modal zIndex={2000} centered isOpen={modal} toggle={toggle}>
      <div className="text-center p-5">
        <div className="avatar-icon-wrapper rounded-circle m-0">
          <div className="d-inline-flex justify-content-center p-0 rounded-circle avatar-icon-wrapper bg-warning text-white m-0 d-130">
            <AlertCircle
              size={50}
              className="d-flex align-self-center display-3"
            />
          </div>
        </div>
        <div className="font-weight-bold font-size-lg mt-4">{title}</div>
        <div className="pt-4">
          <Button
            onClick={onCancel}
            color="neutral-danger"
            className="btn-pill mx-1"
          >
            <span className="btn-wrapper--label">{t("cancel")}</span>
          </Button>
          <Button
            onClick={onConfirm}
            outline
            color="success"
            className="btn-pill mx-1"
          >
            <span className="btn-wrapper--label">{t("confirm")}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmAlert;
