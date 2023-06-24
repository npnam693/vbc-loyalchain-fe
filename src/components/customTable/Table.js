import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { usePagination, useTable } from "react-table";
import { Badge, Card, Table } from "reactstrap";
import Pagination from "./CustomPagination";
import React from "react";
const TableFull = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualPagination: false,
    },
    usePagination
  );

  const { t } = useTranslation("common");
  return (
    <Card className="card-box p-3">
      <div className="table-responsive-md auto-height-table">
        <Table hover className="text-nowrap mb-0" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        {page.length === 0 && (
          <div
            className="w-100 d-flex justify-content-center align-items-center"
            style={{ height: "380px" }}
          >
            <Badge className="bg-neutral-warning text-warning">
              {t("noData")}
            </Badge>
          </div>
        )}
      </div>
      <Pagination
        currentPage={pageIndex}
        totalPage={pageCount}
        onPageChange={gotoPage}
        size={pageSize}
        onSizeChange={setPageSize}
      />
    </Card>
  );
};

export default TableFull;
