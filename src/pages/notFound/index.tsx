import React from "react";
import { Button } from "reactstrap";
import { AGD } from "../../constants/image";

const NotFound = () => {
  return (
    <div className="vh-100 vw-100 position-relative d-flex justify-content-center align-items-center flex-column bg-404">
      <img src={AGD} alt="" style={{ height: 80 }} />
      <h1 className="text-success font-weight-bold mt-5">
        Oh no, something's went wrong!
      </h1>
      <h4 className="text-404">
        So sorry, but our site is under maintainance right now.
      </h4>
      <h4 className="text-404">
        We are doing our best and we will be back soon!
      </h4>
      <div className="mt-5">
        <Button color="success" size="lg" className="font-weight-bold">
          BACK TO HOME
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
