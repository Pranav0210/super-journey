import { BrowserRouter, Route, Routes } from "react-router-dom";
import SideBar from "../components/SideBar";
import MyLoads from "../pages/MyLoads";
import AddLoad from "../pages/AddLoads";
import AllLoads from "@/pages/AllLoads";
import Login from "@/pages/Login";
import AddBulk from "@/pages/AddBulk";
import AddBulkTruck from "@/pages/Supply/AddBulk"
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "../pages/NotFound";
import { demandSidebar, supplySidebar } from "@/components/SideBar/menu";
import Directory from "@/pages/Supply/Directory";
import MyTrucks from "@/pages/Supply/MyTrucks";
import AllTrucks from "@/pages/Supply/AllTrucks";
import { APP_TYPE } from "@/config";
import AddTruck from "@/pages/Supply/AddTruck";
import Services from "@/pages/Supply/Services";
import AddDirectory from "@/pages/Supply/AddDirectory";

const Routing = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        {APP_TYPE == 'demand' && <Route
          path="/"
          element={
            <ProtectedRoute>
              <SideBar menu={demandSidebar} footer="LT-Demand Version" variant="demand" />
            </ProtectedRoute>
          }
        >
          <Route
            path="my-loads"
            element={
              <ProtectedRoute>
                <MyLoads />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-load"
            element={
              <ProtectedRoute>
                <AddLoad />
              </ProtectedRoute>
            }
          />
          <Route
            path="all-loads"
            element={
              <ProtectedRoute>
                <AllLoads />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-bulk"
            element={
              <ProtectedRoute>
                <AddBulk />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            }
          />
        </Route>}
        <Route path="/login" element={<Login />} />
        {APP_TYPE == 'supply' && <Route
          path="/"
          element={
            <ProtectedRoute>
              <SideBar menu={supplySidebar} footer="LT-Supply Version" variant="supply" />
            </ProtectedRoute>
          }>
          <Route
            path="all-trucks"
            element={
              <ProtectedRoute>
                <AllTrucks />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-truck"
            element={
              <ProtectedRoute>
                <AddTruck />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-trucks"
            element={
              <ProtectedRoute>
                <MyTrucks />
              </ProtectedRoute>
            }
          />
          <Route
            path="directory"
            element={
              <ProtectedRoute>
                <Directory />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-transporter"
            element={
              <ProtectedRoute>
                <AddDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-bulk"
            element={
              <ProtectedRoute>
                <AddBulkTruck />
              </ProtectedRoute>
            }
          />
          <Route
            path="services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <NotFound />
            }
          />
        </Route>}
        <Route
          path="*"
          element={
            <NotFound />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
