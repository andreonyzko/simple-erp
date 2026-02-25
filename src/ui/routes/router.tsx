import { createBrowserRouter } from "react-router";
import AppShell from "../layout/AppShell";
import CalendarListPage from "../pages/calendar/CalendarListPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CalendarCreatePage from "../pages/calendar/CalendarCreatePage";
import CalendarEditPage from "../pages/calendar/CalendarEditPage";
import SalesListPage from "../pages/sales/SalesListPage";
import SaleCreatePage from "../pages/sales/SaleCreatePage";
import SaleEditPage from "../pages/sales/SaleEditPage";
import PurchasesListPage from "../pages/purchases/PurchasesListPage";
import PurchaseCreatePage from "../pages/purchases/PurchaseCreatePage";
import PurchaseEditPage from "../pages/purchases/PurchaseEditPage";
import ClientsListPage from "../pages/clients/ClientsListPage";
import ClientCreatePage from "../pages/clients/ClientCreatePage";
import ClientEditPage from "../pages/clients/ClientEditPage";
import SuppliersListPage from "../pages/suppliers/SuppliersListPage";
import SupplierCreatePage from "../pages/suppliers/SupplierCreatePage";
import SupplierEditPage from "../pages/suppliers/SupplierEditPage";
import ProductsListPage from "../pages/products/ProductsListPage";
import ProductCreatePage from "../pages/products/ProductCreatePage";
import ProductEditPage from "../pages/products/ProductEditPage";
import ServicesListPage from "../pages/services/ServicesListPage";
import ServiceCreatePage from "../pages/services/ServiceCreatePage";
import ServiceEditPage from "../pages/services/ServiceEditPage";
import TransactionsListPage from "../pages/transactions/TransactionsListPage";
import TransactionCreatePage from "../pages/transactions/TransactionCreatePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        handle: { title: "Dashboard" },
      },
      {
        path: "agenda",
        element: <CalendarListPage />,
        handle: { title: "Agenda" },
      },
      {
        path: "agenda/cadastrar",
        element: <CalendarCreatePage />,
        handle: { title: "Cadastro de evento" },
      },
      {
        path: "agenda/:id/editar",
        element: <CalendarEditPage />,
        handle: { title: "Edição evento" },
      },
      {
        path: "vendas",
        element: <SalesListPage />,
        handle: { title: "Vendas" },
      },
      {
        path: "vendas/cadastrar",
        element: <SaleCreatePage />,
        handle: { title: "Cadastro de venda" },
      },
      {
        path: "vendas/:id/editar",
        element: <SaleEditPage />,
        handle: { title: "Edição de venda" },
      },
      {
        path: "compras",
        element: <PurchasesListPage />,
        handle: { title: "Compras" },
      },
      {
        path: "compras/cadastrar",
        element: <PurchaseCreatePage />,
        handle: { title: "Cadastro de compra" },
      },
      {
        path: "compras/:id/editar",
        element: <PurchaseEditPage />,
        handle: { title: "Edição de compra" },
      },
      {
        path: "clientes",
        element: <ClientsListPage />,
        handle: { title: "Clientes" },
      },
      {
        path: "clientes/cadastrar",
        element: <ClientCreatePage />,
        handle: { title: "Cadastro de cliente" },
      },
      {
        path: "clientes/:id/editar",
        element: <ClientEditPage />,
        handle: { title: "Edição de cliente" },
      },
      {
        path: "fornecedores",
        element: <SuppliersListPage />,
        handle: { title: "Fornecedores" },
      },
      {
        path: "fornecedores/cadastrar",
        element: <SupplierCreatePage />,
        handle: { title: "Cadastro de fornecedor" },
      },
      {
        path: "fornecedores/:id/editar",
        element: <SupplierEditPage />,
        handle: { title: "Edição de fornecedor" },
      },
      {
        path: "produtos",
        element: <ProductsListPage />,
        handle: { title: "Produtos" },
      },
      {
        path: "produtos/cadastrar",
        element: <ProductCreatePage />,
        handle: { title: "Cadastro de produto" },
      },
      {
        path: "produtos/:id/editar",
        element: <ProductEditPage />,
        handle: { title: "Edição de produto" },
      },
      {
        path: "servicos",
        element: <ServicesListPage />,
        handle: { title: "Serviços" },
      },
      {
        path: "servicos/cadastrar",
        element: <ServiceCreatePage />,
        handle: { title: "Cadastro de serviço" },
      },
      {
        path: "servicos/:id/editar",
        element: <ServiceEditPage />,
        handle: { title: "Edição de serviço" },
      },
      {
        path: "financeiro/extrato",
        element: <TransactionsListPage />,
        handle: { title: "Extrato financeiro" },
      },
      {
        path: "financeiro/cadastrar",
        element: <TransactionCreatePage />,
        handle: { title: "Cadastro de movimentação financeiro" },
      },
    ],
  },
]);
