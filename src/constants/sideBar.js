export default [
  {
    title: "inventory",
    subMenu: [
      {
        category: "products",
        content: [
          { title: "Add Products", link: "/products/create" },
          { title: "View Products", link: "/products" },
          { title: "Markup Price Update", link: "/products/priceUpdate" }
        ]
      },
      {
        category: "transactions",
        content: [
          { title: "Stock Adjustment", link: "/transactions/stockAdjustments" },
          {
            title: "Warehouse Transfers",
            link: "/transactions/warehouseTransfers"
          },
          { title: "Stock Counts", link: "/transactions/stockCounts" }
        ]
      }
    ]
  }
];
