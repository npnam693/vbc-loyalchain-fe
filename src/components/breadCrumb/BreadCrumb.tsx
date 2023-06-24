import clsx from "clsx";
import { t } from "i18next";
import React from "react";
import { Home } from "react-feather";
import { useTranslation } from "react-i18next";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

interface BreadCrumbProps {
  title: string;
  path: string;
}

const BreadCrumb = ({ list }: { list: Array<BreadCrumbProps> }) => {
  const { t } = useTranslation("common");
  return (
    <div className="mt-2">
      <Breadcrumb className="d-flex align-items-center" color="success">
        <BreadcrumbItem>
          <a href={"/overview"}>
            <Home size={16} />
          </a>
        </BreadcrumbItem>
        {list.map((item, idx) => (
          <BreadcrumbItem
            key={idx}
            active={idx === list.length - 1 ? true : false}
            className={clsx({ "text-success": idx === list.length - 1 })}
          >
            {idx === list.length - 1 ? (
              item.title
            ) : (
              <a href={item.path}>{item.title}</a>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
