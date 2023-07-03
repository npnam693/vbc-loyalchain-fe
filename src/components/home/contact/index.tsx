import { useTranslation } from "react-i18next";
import { Input, Button } from "antd";
import {
  HomeTwoTone,
  ClockCircleTwoTone,
  MailTwoTone,
  PhoneTwoTone,
} from "@ant-design/icons";

import ContactPattern from "../../../assets/svg/home/contact_patern.svg";
import "./Contact.scss";

const Contact = () => {
  const { t } = useTranslation("common");

  return (
    <div className="app-contact">
      <div className="info">
        <p className="title">Contact</p>
        <div className="info-content">
          <p>
            <HomeTwoTone rev={""} /> {t("contact.title.address")}:
          </p>
          {t("contact.content.address")}
        </div>
        <div className="info-content">
          <p>
            <ClockCircleTwoTone rev={""} /> {t("contact.title.timework")}:
          </p>
          {t("contact.content.timework")}
        </div>
        <div className="info-content">
          <p>
            <MailTwoTone rev={""} /> {t("contact.title.email")}:
          </p>
          {t("contact.content.email")}
        </div>
        <div className="info-content">
          <p>
            <PhoneTwoTone rev={""} /> {t("contact.title.phone")}
          </p>
          {t("contact.content.phone")}
        </div>
      </div>
      <div className="form">
        <div className="form-info">
          <Input placeholder="Full Name" size="large" />
          <Input placeholder="Company" size="large" />
        </div>
        <Input
          placeholder="Email / Phone"
          size="large"
          className="text-email"
        />

        <Input.TextArea className="form-desc" placeholder="Basic usage" />

        <Button type="default" className="btn-submit" size="large">
          Submit
        </Button>
      </div>
      <img src={ContactPattern} alt="Pattern" className="img-pattern" />
    </div>
  );
};

export default Contact;
