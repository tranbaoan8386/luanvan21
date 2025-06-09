import React, { useContext } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { AppContext } from "../contexts/App";
import MainLayout from "../layouts/MainLayout";
import Account from "../pages/Account";
import Cart from "../pages/Cart";
import Home from "../pages/Home";
import Contact from "../pages/Contact/Contact";
import Introduce from "../pages/Introduce/Introduce";
import Login from "../pages/Login";
import ProductDetail from "../pages/ProductDetail";
import ForgotPassword from "../pages/forgotPassword";
import ResetPassword from "../pages/resetPassword";
import Register from "../pages/Register";
import UserLayout from "../pages/User/layouts/UserLayout";
import Profile from "../pages/User/pages/Profile";
import ChangePassword from "../pages/User/pages/ChangePassword";
import MyOrder from "../pages/User/pages/MyOrder";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/pages/Dashboard";
import ManagerProduct from "../pages/Admin/pages/ManagerProduct";
import CreateProduct from "../pages/Admin/pages/ManagerProduct/modules/CreateProduct";
import UpdateProduct from "../pages/Admin/pages/ManagerProduct/modules/UpdateProduct/UpdateProduct";
import ManagerCategory from "../pages/Admin/pages/ManagerCategory";
import CreateCategory from "../pages/Admin/pages/ManagerCategory/modules/CreateCategory/CreateCategory";
import UpdateCategory from "../pages/Admin/pages/ManagerCategory/modules/UpdateCategory";
import ManagerProductColor from "../pages/Admin/pages/ManagerProductColor";
import CreateProductColor from "../pages/Admin/pages/ManagerProductColor/modules/CreateProductColor";
import UpdateProductColor from "../pages/Admin/pages/ManagerProductColor/modules/UpdateProductColor";
import ManagerProductSize from "../pages/Admin/pages/ManagerProductSize";
import CreateProductSize from "../pages/Admin/pages/ManagerProductSize/modules/CreateProductSize";
import UpdateProductSize from "../pages/Admin/pages/ManagerProductSize/modules/UpdateProductSize";
import ManagerOrder from "../pages/Admin/pages/ManagerOrder";
import ManagerUser from "../pages/Admin/pages/ManagerUser";
import ManagerBrand from "../pages/Admin/pages/ManagerBrand";
import CreateBrand from "../pages/Admin/pages/ManagerBrand/modules/CreateBrand/CreateBrand";
import UpdateBrand from "../pages/Admin/pages/ManagerBrand/modules/UpdateBrand";

function ProtectedRouter() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function RejectedRouter() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

function OwnerRouter() {
  const { isAuthenticated, profile } = useContext(AppContext);
  const roleName = profile?.role?.name?.toLowerCase();
  return isAuthenticated && roleName === "admin" ? <Outlet /> : <Navigate to="/" />;
}

export default function routerElements() {
  const routerElements = useRoutes([
    {
      path: "/",
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: "/contact",
      element: (
        <MainLayout>
          <Contact />
        </MainLayout>
      )
    },
    {
      path: "/introduce",
      element: (
        <MainLayout>
          <Introduce />
        </MainLayout>
      )
    },
    {
      path: "/:nameId",
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: "",
      element: <RejectedRouter />,
      children: [
        {
          path: "login",
          element: <Login />
        },
        {
          path: "register",
          element: <Register />
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />
        },
        {
          path: "reset-password",
          element: <ResetPassword />
        }
      ]
    },
    {
      path: "",
      element: <ProtectedRouter />,
      children: [
        {
          path: "cart",
          element: (
            <MainLayout>
              <Cart />
            </MainLayout>
          )
        },
        {
          path: "/account",
          element: (
            <MainLayout>
              <Account />
            </MainLayout>
          )
        },
        {
          path: "/user",
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: "profile",
              element: <Profile />
            },
            {
              path: "password",
              element: <ChangePassword />
            },
            {
              path: "order",
              element: <MyOrder />
            }
          ]
        }
      ]
    },
    {
      path: "",
      element: <OwnerRouter />,
      children: [
        {
          path: "admin",
          element: (
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          )
        },
        {
          path: "admin/product",
          element: (
            <AdminLayout>
              <ManagerProduct />
            </AdminLayout>
          )
        },
        {
          path: "admin/product/create",
          element: (
            <AdminLayout>
              <CreateProduct />
            </AdminLayout>
          )
        },
        {
          path: "admin/product/update/:id",
          element: (
            <AdminLayout>
              <UpdateProduct />
            </AdminLayout>
          )
        },
        {
          path: "admin/category",
          element: (
            <AdminLayout>
              <ManagerCategory />
            </AdminLayout>
          )
        },
        {
          path: "admin/category/create",
          element: (
            <AdminLayout>
              <CreateCategory />
            </AdminLayout>
          )
        },
        {
          path: "admin/category/update/:id",
          element: (
            <AdminLayout>
              <UpdateCategory />
            </AdminLayout>
          )
        },
        {
          path: "admin/brand",
          element: (
            <AdminLayout>
              <ManagerBrand />
            </AdminLayout>
          )
        },
        {
          path: "admin/brand/create",
          element: (
            <AdminLayout>
              <CreateBrand />
            </AdminLayout>
          )
        },
        {
          path: "admin/brand/update/:id",
          element: (
            <AdminLayout>
              <UpdateBrand />
            </AdminLayout>
          )
        },
        {
          path: "admin/color",
          element: (
            <AdminLayout>
              <ManagerProductColor />
            </AdminLayout>
          )
        },
        {
          path: "admin/color/create",
          element: (
            <AdminLayout>
              <CreateProductColor />
            </AdminLayout>
          )
        },
        {
          path: "admin/color/update/:id",
          element: (
            <AdminLayout>
              <UpdateProductColor />
            </AdminLayout>
          )
        },
        {
          path: "admin/size",
          element: (
            <AdminLayout>
              <ManagerProductSize />
            </AdminLayout>
          )
        },
        {
          path: "admin/size/create",
          element: (
            <AdminLayout>
              <CreateProductSize />
            </AdminLayout>
          )
        },
        {
          path: "admin/size/update/:id",
          element: (
            <AdminLayout>
              <UpdateProductSize />
            </AdminLayout>
          )
        },
        {
          path: "admin/order",
          element: (
            <AdminLayout>
              <ManagerOrder />
            </AdminLayout>
          )
        },
        {
          path: "admin/users",
          element: (
            <AdminLayout>
              <ManagerUser />
            </AdminLayout>
          )
        }
      ]
    }
  ]);
  return routerElements;
}
