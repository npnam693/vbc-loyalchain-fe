import { createSlice } from "@reduxjs/toolkit";

export const ThemeOptionsSlice = createSlice({
  name: "themeOptions",
  initialState: {
    // Sidebar
    sidebarFixed: true,
    sidebarFooter: true,
    sidebarShadow: false,
    sidebarStyle: "app-sidebar--dark",
    sidebarUserbox: true,
    sidebarToggleMobile: false,
    sidebarToggle: false,
    // Header
    headerFixed: true,
    headerShadow: true,
    headerBgTransparent: true,
    headerSearchHover: false,
    headerDrawerToggle: false,
    // Main contentthem
    contentBackground: "",
    themeConfiguratorToggle: false,
    // Footer
    footerFixed: false,
    footerShadow: false,
    footerBgTransparent: true,
    // Page title
    pageTitleStyle: "",
    pageTitleBackground: "",
    pageTitleShadow: false,
    pageTitleIconBox: true,
    pageTitleDescription: true,
  },
  reducers: {
    // Sidebar
    setSidebarShadow: (state, action) => {
      return {
        ...state,
        sidebarShadow: action.payload,
      };
    },
    setSidebarFixed: (state, action) => {
      return {
        ...state,
        sidebarFixed: action.payload,
      };
    },
    setSidebarStyle: (state, action) => {
      return {
        ...state,
        sidebarStyle: action.payload,
      };
    },
    setSidebarFooter: (state, action) => {
      return {
        ...state,
        sidebarFooter: action.payload,
      };
    },
    setSidebarToggleMobile: (state, action) => {
      return {
        ...state,
        sidebarToggleMobile: action.payload,
      };
    },
    setSidebarToggle: (state, action) => {
      return {
        ...state,
        sidebarToggle: action.payload,
      };
    },
    setSidebarUserBox: (state, action) => {
      return {
        ...state,
        sidebarUserbox: action.payload,
      };
    },

    // Header
    setHeaderFixed: (state, action) => {
      return {
        ...state,
        headerFixed: action.payload,
      };
    },
    setHeaderShadow: (state, action) => {
      return {
        ...state,
        headerShadow: action.payload,
      };
    },
    setHeaderBgTransparent: (state, action) => {
      return {
        ...state,
        headerBgTransparent: action.payload,
      };
    },
    setHeaderSearchHover: (state, action) => {
      return {
        ...state,
        headerSearchHover: action.payload,
      };
    },
    setHeaderDrawerToggle: (state, action) => {
      return {
        ...state,
        headerDrawerToggle: action.payload,
      };
    },

    // Main content
    setContentBackground: (state, action) => {
      return {
        ...state,
        contentBackground: action.payload,
      };
    },
    setThemeConfiguratorToggle: (state, action) => {
      return {
        ...state,
        themeConfiguratorToggle: action.payload,
      };
    },

    // Footer
    setFooterFixed: (state, action) => {
      return {
        ...state,
        footerFixed: action.payload,
      };
    },
    setFooterShadow: (state, action) => {
      return {
        ...state,
        footerShadow: action.payload,
      };
    },
    setFooterBgTransparent: (state, action) => {
      return {
        ...state,
        footerBgTransparent: action.payload,
      };
    },

    setPageTitleStyle: (state, action) => {
      return {
        ...state,
        pageTitleStyle: action.payload,
      };
    },
    setPageTitleBackground: (state, action) => {
      return {
        ...state,
        pageTitleBackground: action.payload,
      };
    },
    setPageTitleShadow: (state, action) => {
      return {
        ...state,
        pageTitleShadow: action.payload,
      };
    },
    setPageTitleIconBox: (state, action) => {
      return {
        ...state,
        pageTitleIconBox: action.payload,
      };
    },
    setPageTitleDescription: (state, action) => {
      return {
        ...state,
        pageTitleDescription: action.payload,
      };
    },
  },
});

const { actions, reducer } = ThemeOptionsSlice;

export const {
  setSidebarShadow,
  setSidebarFixed,
  setSidebarStyle,
  setSidebarFooter,
  setSidebarToggleMobile,
  setSidebarToggle,
  setSidebarUserBox,
  setHeaderFixed,
  setHeaderShadow,
  setHeaderBgTransparent,
  setHeaderSearchHover,
  setHeaderDrawerToggle,
  setContentBackground,
  setThemeConfiguratorToggle,
  setFooterFixed,
  setFooterShadow,
  setFooterBgTransparent,
  setPageTitleStyle,
  setPageTitleBackground,
  setPageTitleShadow,
  setPageTitleIconBox,
  setPageTitleDescription,
} = actions;

export default ThemeOptionsSlice.reducer;
