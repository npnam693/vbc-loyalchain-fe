import React from "react"
//formik
import { FormikValues, useFormik } from "formik";
import { Key, User } from "react-feather";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";
import { useToggleAlert } from "../../state/alert/hooks";
import { useAppDispatch } from "../../state/hooks";
import { useToggleNoti } from "../../state/popup/hooks";
//import css
import { VBC } from "../../constants/image";
import "./Login.css";
import { Header } from "../../layouts/components";

// const EthereumTx = require("ethereumjs-tx");

const Login = () => {
  const { t } = useTranslation("common");

  const navigate = useNavigate();

  const toggleAlert = useToggleAlert();

  const toggleNoti = useToggleNoti();

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      showPass: false,
    },
    validationSchema: Yup.object({
      password: Yup.string().min(5, t("atLeast")).required(t("require")),
      email: Yup.string().required(t("require")),
    }),
    onSubmit: async (values: FormikValues) => {
      handleSignIn(values);
    },
  });

  const handleSignIn = (values: FormikValues) => {};

  return (
    <div className="position-relative vh-100 vw-100 .app-sidebar" 
      style={{height: '100vh'}}
    >
    </div>
  );
};

export default Login;
