import { RouterProvider } from "react-router-dom";
import router from "./Routes/Routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <div className="">
        <Toaster />
        <RouterProvider router={router}></RouterProvider>
      </div>
    </>
  );
}

export default App;
