import el from "date-fns/locale/vi";
import DownCircle from "mdi-react/ArrowDownDropCircleIcon";
import CalenderIcon from "mdi-react/CalendarIcon";
import moment from "moment";
import React, { forwardRef, useRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { Button, CustomInput } from "reactstrap";

interface CustomDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

registerLocale("el", el);

function range(min: number, max: number) {
  var len = max - min + 1;
  var arr = new Array(len);
  for (var i = 0; i < len; i++) {
    arr[i] = min + i;
  }
  return arr;
}

const months = [
  { label: "Tháng một", value: 1 },
  { label: "Tháng hai", value: 2 },
  { label: "Tháng ba", value: 3 },
  { label: "Tháng tư", value: 4 },
  { label: "Tháng năm", value: 5 },
  { label: "Tháng sáu", value: 6 },
  { label: "Tháng bảy", value: 7 },
  { label: "Tháng tám", value: 8 },
  { label: "Tháng chín", value: 9 },
  { label: "Tháng mười", value: 10 },
  { label: "Tháng mười một", value: 11 },
  { label: "Tháng mười hai", value: 12 },
];

const years = range(new Date().getFullYear() - 2, new Date().getFullYear());

// const ExampleCustomInput = forwardRef(({
//   value,
//   onClick,
// }: {
//   value?: string;
//   onClick?: () => void;
// }), ref) => (
//   <Button block color="success" size="sm" onClick={onClick} outline>
//     <span className="btn-wrapper--icon">
//       <CalenderIcon size={20} />
//     </span>
//     <span className="btn-wrapper--label">
//       {moment(value).format("DD/MM/YYYY")}
//     </span>
//   </Button>
// );

const ExampleCustomInput = forwardRef((props: any, ref) => {
  return <Button block color="success" size="sm" onClick={props.onClick} outline>
      <span className="btn-wrapper--icon">
         <CalenderIcon size={20} />
       </span>
       <span className="btn-wrapper--label">
         {moment(props.value).format("DD/MM/YYYY")}
       </span>
     </Button>
});

const CustomDatePicker = ({ value, onChange }: CustomDatePickerProps) => {
  const inputRef = useRef(null);
  return (
    <div>
      <DatePicker
        renderCustomHeader={({ date, changeYear, changeMonth }) => (
          <div className="d-flex justify-content-center px-2 align-items-center">
            <CustomInput
              id="yearSelect"
              type="select"
              className="bg-no-arrow custom-select-year"
              value={moment(date, "DD-MM-YYYY").year()}
              onChange={({ target: { value } }) => changeYear(parseInt(value))}
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </CustomInput>
            <div className="icon-date-picker">
              <DownCircle className="text-white font-weight-bold" size={16} />
            </div>
            <CustomInput
              id="monthSelect"
              type="select"
              className="bg-no-arrow"
              value={moment(date, "DD-MM-YYYY").month() + 1}
              onChange={({ target: { value } }) => {
                changeMonth(parseInt(value) - 1);
              }}
            >
              {months.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </CustomInput>
            <div className="icon-date-picker">
              <DownCircle className="text-white font-weight-bold" size={16} />
            </div>
          </div>
        )}
        className="form-control"
        selected={value}
        onChange={(date) => onChange(date)}
        customInput={<ExampleCustomInput inputRef={inputRef} />}
        locale="el"
      />
    </div>
  );
};

export default CustomDatePicker;
