import React, { useEffect } from "react";
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
import { closeTaskModel, doneOneTask, updateTask } from "./state/task/taskSlice";
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    store.dispatch(closeTaskModel())
    const myTasks = store.getState().taskState.taskList
    
    for (let i = 0; i < myTasks.length; i++) {
      if (![3, -1,-2].includes(myTasks[myTasks.length - i -1].status)) {
        store.dispatch(updateTask({
          id: myTasks.length - i -1,  
          task: {...myTasks[myTasks.length - i -1], status: myTasks[myTasks.length - i -1].status === 1 ? -1 : -2 }}))
        store.dispatch(doneOneTask())
        }
      else {
        break
      }
    }





  }, [])

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
      <ToastContainer 
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
/>


    </Provider>
  );
}

export default App;
