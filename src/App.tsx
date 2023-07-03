import React from "react";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/lib/integration/react";
// import AlertContainer from "./components/alert";
// import ErrorBoundary from "./components/errorHandle/ErrorHandle";
import RouterList from "./router";
import store, { persistor } from "./state/index";
import i18next from "./translation/index";
import AppLayout from "./layouts";

const queryClient = new QueryClient();


function App() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <I18nextProvider i18n={i18next}>
            {/* <ErrorBoundary> */}
            <QueryClientProvider client={queryClient}>
              <AppLayout>
                <RouterList />
              </AppLayout>
            </QueryClientProvider>
            {/* </ErrorBoundary> */}
          </I18nextProvider>
        </BrowserRouter>
      </PersistGate>
      {/* <AlertContainer /> */}
      <ToastContainer position={toast.POSITION.TOP_RIGHT} />
    </Provider>
  );
}

export default App;
