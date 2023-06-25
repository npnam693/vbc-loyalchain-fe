import { MdiReactIconComponentType } from "mdi-react";

export interface ItemRouteProps {
  path: string;
  element: () => JSX.Element;
  title: string;
  className?: string;
}

export interface RouteProps {
  path: string;
  element: () => JSX.Element;
  icon?: MdiReactIconComponentType;
  title: string;
  className?: string;
  isCollapsed?: boolean;
  list?: ItemRouteProps[];
}

export interface LayoutProps {
  children: JSX.Element;
}