import "./NotFound.scss";

const NotFound = () => {
  return (
    <div className="app-notfound">
      <h1 className="notfound-log">Oh no, something's went wrong!</h1>
      <h4 className="text-404">
        So sorry, but our site is under maintainance right now.
      </h4>
      <h4 className="text-404">
        We are doing our best and we will be back soon!
      </h4>
      <div className="mt-5"></div>
    </div>
  );
};

export default NotFound;
