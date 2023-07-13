import React from "react";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/lib/integration/react";
import RouterList from "./router";
import store, { persistor } from "./state/index";
import i18next from "./translation/index";
import AppLayout from "./layouts";
import 'react-toastify/dist/ReactToastify.css';
import LoadingPage from "./components/app/LoadingPage";
import ModalPage from "./components/app/ModalPage";
const queryClient = new QueryClient();


function App() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <I18nextProvider i18n={i18next}>
            <QueryClientProvider client={queryClient}>
              <LoadingPage />
              <ModalPage />
              <AppLayout>
                <RouterList />
              </AppLayout>
            </QueryClientProvider>
          </I18nextProvider>
        </BrowserRouter>
      </PersistGate>
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />


    </Provider>
  );
}

export default App;
