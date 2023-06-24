import React from "react"
//formik
import { FormikValues, useFormik } from "formik";
import { Key, User } from "react-feather";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CustomInput,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import * as Yup from "yup";
import { useToggleAlert } from "../../state/alert/hooks";
import { useAppDispatch } from "../../state/hooks";
import { useToggleNoti } from "../../state/popup/hooks";
//import css
import { VBC } from "../../constants/image";
import "./Login.css";

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
    <div className="position-relative vh-100 vw-100">
      <div className="vh-100 vw-100 overflow-hidden bg-second"></div>
      <div className="d-flex flex-row vh-100 vw-100 overflow-hidden position-absolute top-0 left-0 fixed-top">
        <div className="d-flex w-100 align-items-center vh-100">
          <div className="mx-auto col-12 col-md-3">
            <div className="w-100 bg-white rounded p-4">
              <div>
                <div className="text-center">
                  <img src={VBC} alt="logo_agd" className="logoAGD" />
                </div>
                <div className="d-flex text-left justify-content-center mt-3">
                  {t("login.motto")}
                </div>
                <div className="mt-3">
                  <form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                      <label className="font-weight-bold">
                        {t("login.username")}
                      </label>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <User />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder={t("login.username")}
                          valid={
                            formik.touched.email && formik.errors.email
                              ? false
                              : formik.values.email
                              ? true
                              : false
                          }
                          invalid={
                            formik.touched.email && formik.errors.email
                              ? true
                              : false
                          }
                          {...formik.getFieldProps("email")}
                        />
                      </InputGroup>
                      {formik.touched.email && formik.errors.email ? (
                        <p className="font-weight-regular font-size-sm text-danger">
                          {formik.errors.email.toString()}
                        </p>
                      ) : null}
                    </FormGroup>
                    <div className="form-group mb-4">
                      <div className="d-flex justify-content-between">
                        <label className="font-weight-bold">
                          {t("login.pass")}
                        </label>
                      </div>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <Key />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          valid={
                            formik.touched.password && formik.errors.password
                              ? false
                              : formik.values.password
                              ? true
                              : false
                          }
                          invalid={
                            formik.touched.password && formik.errors.password
                              ? true
                              : false
                          }
                          placeholder={t("login.pass")}
                          type={formik.values.showPass ? "text" : "password"}
                          // name="password"
                          // value={formik.values.password}
                          {...formik.getFieldProps("password")}
                        />
                      </InputGroup>
                      {formik.touched.password && formik.errors.password ? (
                        <p className="font-weight-regular font-size-sm text-danger">
                          {formik.errors.password.toString()}
                        </p>
                      ) : null}
                    </div>
                    <div className="d-flex mb-4 justify-content-between">
                      <CustomInput
                        type="checkbox"
                        id="exampleCustomCheckbox"
                        checked={formik.values.showPass}
                        {...formik.getFieldProps("showPass")}
                        label={t("profile.showPass")}
                      />
                    </div>
                    <div className="text-center">
                      <Button
                        size="lg"
                        type="submit"
                        className="font-weight-bold font-size-sm gtm-btn-login"
                        color="info"
                      >
                        {t("login.login")}
                      </Button>
                      <p className="font-weight-bold mt-3">
                        {t("login.noAccount")}{" "}
                        <a
                          className="text-info cursor-pointer gtm-btn-register"
                          onClick={() => navigate("/register")}
                        >
                          {t("login.register")}
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
