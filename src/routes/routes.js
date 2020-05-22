// @flow
import { lazy } from "react";
import { USER_ROLES } from "constants/user";
import authRoutes from "modules/auth/routes";

export default [
  {
    path: "/",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/dashboard/home")),
  },
  {
    path: "/product/create",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/stockManagement/inventory/addNewProduct")
    ),
  },
  {
    path: "/product/products",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/stockManagement/inventory/viewProducts")
    ),
  },
  {
    path: "/product/update/:productCode",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/stockManagement/inventory/updateProducts")
    ),
  },
  {
    path: "/product/margin",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/stockManagement/inventory/setProductMargin")
    ),
  },
  {
    path: "/return/create",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/stockManagement/stockReturn/createStockReturn")
    ),
  },
  {
    path: "/return/update/:returnId",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/stockManagement/stockReturn/updateStockReturn")
    ),
  },
  {
    path: "/returns",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/stockManagement/stockReturn/viewStockReturns")
    ),
  },
  {
    path: "/orders/create",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/stockManagement/orders/addNewOrder")),
  },
  {
    path: "/orders/update/:orderId",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/stockManagement/orders/updateOrder")),
  },
  {
    path: "/orders",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/stockManagement/orders/viewOrders")),
  },
  {
    path: "/admin/users",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/adminManagement/users/viewUsers")),
  },
  {
    path: "/admin/users/update/:userId",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/adminManagement/users/updateUser")),
  },
  {
    path: "/admin/employee/create",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/adminManagement/employee/addEmployee")
    ),
  },
  {
    path: "/admin/employees/update/:employeeId",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/adminManagement/employee/updateEmployee")
    ),
  },
  {
    path: "/admin/employees",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/adminManagement/employee/viewEmployees")
    ),
  },
  {
    path: "/admin/leaves/add",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/adminManagement/leaves/addLeaves")),
  },
  {
    path: "/admin/leaves",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/adminManagement/leaves/viewLeaves")),
  },
  {
    path: "/admin/supplier/create",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/adminManagement/suppliers/addSupplier")
    ),
  },
  {
    path: "/admin/supplier/update/:supplierCode",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/adminManagement/suppliers/updateSupplier")
    ),
  },
  {
    path: "/admin/suppliers",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/adminManagement/suppliers/viewSuppliers")
    ),
  },
  {
    path: "/admin/salary",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() =>
      import("modules/adminManagement/salary/salaryPayment")
    ),
  },
  {
    path: "/cashier",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/cashierManagement/cashier")),
  },
  ...authRoutes,
];
