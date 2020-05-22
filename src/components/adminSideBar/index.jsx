import React from "react";

import SubMenu from "components/subMenu";
import Link from "components/Link";

import "./styles.scss";

export default function sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="">
          <img alt="logo" src={require("assets/image/logo.png")} />
        </Link>
      </div>
      <div className="menu">
        <SubMenu
          title="Users"
          icon="inventory"
          items={[{ title: "View Users", link: "/admin/users" }]}
        />
        <SubMenu
          title="Employee"
          icon="person"
          items={[
            { title: "Add Employee", link: "/admin/employee/create" },
            { title: "View Employees", link: "/admin/employees" },
          ]}
        />
        <SubMenu
          title="Employee Leaves"
          icon="tag"
          items={[
            { title: "Apply Leave", link: "/admin/leaves/add" },
            { title: "Applied Leaves", link: "/admin/leaves" },
          ]}
        />
        <SubMenu
          title="Employee Salary"
          icon="money"
          items={[{ title: "Salary Payment", link: "/admin/salary" }]}
        />
        <SubMenu
          title="Suppliers"
          icon="lorry"
          items={[
            { title: "Add New Supplier", link: "/admin/supplier/create" },
            { title: "View Suppliers", link: "/admin/suppliers" },
          ]}
        />
      </div>
    </div>
  );
}
