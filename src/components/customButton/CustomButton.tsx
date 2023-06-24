import React from "react";
import { Button, UncontrolledTooltip } from "reactstrap";
interface ButtonProps {
  color: string;
  id: string;
  onClick?: () => void;
  icon: JSX.Element;
  tooltip: string;
  disabled?: boolean
}
const CustomButton = ({ color, id, onClick, icon, tooltip, disabled }: ButtonProps) => {
  return (
    <>
      <Button
        color={color}
        id={id}
        onClick={onClick}
        disabled={disabled}
        className="mr-1 rounded-sm shadow-none hover-scale-sm d-40 border-0 p-0 d-inline-flex align-items-center justify-content-center"
      >
        <span className="btn-wrapper--icon d-flex">{icon}</span>
      </Button>
      {document.getElementById(id) ? (
        <UncontrolledTooltip
          trigger="hover"
          popperClassName="tooltip-black"
          placement="top"
          container="body"
          target={id}
        >
          {tooltip}
        </UncontrolledTooltip>
      ) : null}
    </>
  );
};

export default CustomButton;
