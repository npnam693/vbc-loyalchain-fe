import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useTranslation } from "react-i18next";
import { Button, CustomInput } from "reactstrap";

const PageButtonComponent = (props) => (
  <Button {...props}>{props.children}</Button>
);

const Pagination = (props) => {
  const {t} = useTranslation('common');
  const { currentPage, totalPage, onPageChange, onSizeChange } = props;

  const [visiblePages, setList] = useState([]);

  const filterPages = (visiblePages, totalPages) => {
    return visiblePages.filter((pageIdx) => pageIdx <= totalPages);
  };

  const getVisiblePages = (page, total) => {
    if (total < 7) {
      return filterPages([1, 2, 3, 4, 5, 6], total);
    } else {
      if (page % 5 >= 0 && page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    }
  };

  const changePage = (page) => {
    const activePage = currentPage + 1;

    if (page === activePage) {
      return;
    }

    const list_visiblePages = getVisiblePages(page, totalPage);

    setList(filterPages(list_visiblePages, totalPage));

    onPageChange(page - 1);
  };

  useEffect(() => {
    const list_visiblePages = getVisiblePages(null, totalPage);
    setList(list_visiblePages);
  }, [totalPage]);

  return (
    <div className="row justify-content-between py-3 px-3 align-items-center">
      <div className="d-flex flex-row col-md-6">
        <div className="">
          <PageButtonComponent
            color="neutral-info"
            className="btn btn-icon d-40 p-0 m-1  d-flex align-items-center justify-content-center"
            onClick={() => {
              if (currentPage + 1 === 1) return;
              changePage(currentPage);
            }}
            disabled={currentPage + 1 === 1}
          >
            <ChevronLeft size={18} />
          </PageButtonComponent>
        </div>
        <div className="row mx-2">
          {visiblePages.map((page, index, array) => {
            return (
              <PageButtonComponent
                key={page}
                className={
                  currentPage + 1 === page
                    ? "d-40 p-0 m-1 btn btn-info  d-flex align-items-center justify-content-center text-ecom font-weight-bold"
                    : "d-40 p-0 m-1 btn btn-neutral-info  d-flex align-items-center justify-content-center font-weight-bold text-ecom"
                }
                onClick={() => changePage(page)}
              >
                {array[index - 1] + 2 < page ? `...${page}` : page}
              </PageButtonComponent>
            );
          })}
        </div>
        <div className="">
          <PageButtonComponent
            color="neutral-info"
            className="btn btn-icon d-40 p-0 m-1  d-flex align-items-center justify-content-center"
            onClick={() => {
              if (currentPage + 1 === totalPage) return;
              changePage(currentPage + 1 + 1);
            }}
            disabled={currentPage + 1 === totalPage}
          >
            <ChevronRight size={18} />
          </PageButtonComponent>
        </div>
      </div>
      <div className="d-flex flex-row align-items-center col-md-6 justify-content-center justify-content-md-end mt-3 mt-md-0">
        <span className="mr-2">{t('show')}: </span>{" "}
        <CustomInput
          id="selectSize"
          type="select"
          style={{ width: "80px", height: "40px" }}
          onChange={(e) => onSizeChange(e.target.value)}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}> 20</option>
        </CustomInput>{" "}
        <span className="ml-2 text-lowercase">{t('row')}</span>
      </div>
    </div>
  );
};

export default Pagination;
