import {
  Button, CustomInput,
  Input, InputGroup,
  InputGroupAddon
} from "reactstrap";

interface FilterObject {
  label: string;
  value: string;
}

interface CustomFilter {
  arrayFilter?: FilterObject[];
  nameFilter: string;
  valueFilter: string;
  type: string,
  placeholder?: string,
  onChangeValue: (value: string, label: string) => void;
}

const CustomFilter = ({
  nameFilter,
  valueFilter,
  arrayFilter,
  onChangeValue,
  placeholder,
  type
}: CustomFilter) => {
  // const { t } = useTranslation("common");

  // const inputRef = useRef<NodeJS.Timeout | null>(null);

  // const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
  //   let value = e.target.value;

  //   if (inputRef.current) {
  //     clearTimeout(inputRef.current);
  //   }
  //   inputRef.current = setTimeout(() => {
  //     onChangeValue(value, "valueFilter");
  //   }, 300);
  // };

  // const handleClear = () => {
  //   onChangeValue("", "valueFilter");

  //   if (document.getElementById("valueFilterInput")) {
  //     let inputElement: any = document.getElementById("valueFilterInput");
  //     inputElement.value = "";
  //   }
  // };

  return (
    <form>
      <div className="d-flex">
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <Button color="info" onClick={(e) => e.preventDefault()}>
              {nameFilter}
            </Button>
          </InputGroupAddon>
          {type === "select" ? <CustomInput id="select-status" type="select">
           {
            arrayFilter?.map((item, idx)=> (
              <option key={idx} value={item.value}>{item.label}</option>
            ))
           }
          </CustomInput> : <Input placeholder={placeholder}/>}
        </InputGroup>
      </div>
    </form>
  );
};

export default CustomFilter;
