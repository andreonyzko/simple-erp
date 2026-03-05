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
import type { RouteHandle } from "./types";
import { calendarListLoader } from "./calendar/calendarListLoader";
import CalendarDetailPage from "../pages/calendar/CalendarDetailPage";
import SaleDetailPage from "../pages/sales/SaleDetailPage";
import PurchaseDetailPage from "../pages/purchases/PurchaseDetailPage";
import ClientDetailPage from "../pages/clients/ClientDetailPage";
import SupplierDetailPage from "../pages/suppliers/SupplierDetailPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";
import ServiceDetailPage from "../pages/services/ServiceDetailPage";
import TransactionDetailPage from "../pages/transactions/TransactionDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        handle: { title: ["Dashboard"] } satisfies RouteHandle,
      },
      {
        path: "agenda",
        element: <CalendarListPage />,
        loader: calendarListLoader,
        handle: { title: ["Agenda"] } satisfies RouteHandle,
      },
      {
        path: "agenda/:id",
        element: <CalendarDetailPage />,
        handle: { title: ["Agenda", "Detalhes"] } satisfies RouteHandle,
      },
      {
        path: "agenda/cadastrar",
        element: <CalendarCreatePage />,
        handle: { title: ["Agenda", "Cadastro"] } satisfies RouteHandle,
      },
      {
        path: "agenda/:id/editar",
        element: <CalendarEditPage />,
        handle: { title: ["Agenda", "Edição"] } satisfies RouteHandle,
      },
      {
        path: "vendas",
        element: <SalesListPage />,
        handle: { title: ["Operações", "Vendas"] } satisfies RouteHandle,
      },
      {
        path: "vendas/:id",
        element: <SaleDetailPage />,
        handle: {
          title: ["Operações", "Vendas", "Detalhes"],
        } satisfies RouteHandle,
      },
      {
        path: "vendas/cadastrar",
        element: <SaleCreatePage />,
        handle: {
          title: ["Operações", "Vendas", "Cadastro"],
        } satisfies RouteHandle,
      },
      {
        path: "vendas/:id/editar",
        element: <SaleEditPage />,
        handle: {
          title: ["Operações", "Vendas", "Edição"],
        } satisfies RouteHandle,
      },
      {
        path: "compras",
        element: <PurchasesListPage />,
        handle: { title: ["Operações", "Compras"] } satisfies RouteHandle,
      },
      {
        path: "compras/:id",
        element: <PurchaseDetailPage />,
        handle: {
          title: ["Operações", "Compras", "Detalhes"],
        } satisfies RouteHandle,
      },
      {
        path: "compras/cadastrar",
        element: <PurchaseCreatePage />,
        handle: {
          title: ["Operações", "Compras", "Cadastro"],
        } satisfies RouteHandle,
      },
      {
        path: "compras/:id/editar",
        element: <PurchaseEditPage />,
        handle: {
          title: ["Operações", "Compras", "Edição"],
        } satisfies RouteHandle,
      },
      {
        path: "clientes",
        element: <ClientsListPage />,
        handle: { title: ["Pessoas", "Clientes"] } satisfies RouteHandle,
      },
      {
        path: "clientes/:id",
        element: <ClientDetailPage />,
        handle: {
          title: ["Pessoas", "Clientes", "Detalhes"],
        } satisfies RouteHandle,
      },
      {
        path: "clientes/cadastrar",
        element: <ClientCreatePage />,
        handle: {
          title: ["Pessoas", "Clientes", "Cadastro"],
        } satisfies RouteHandle,
      },
      {
        path: "clientes/:id/editar",
        element: <ClientEditPage />,
        handle: {
          title: ["Pessoas", "Clientes", "Edição"],
        } satisfies RouteHandle,
      },
      {
        path: "fornecedores",
        element: <SuppliersListPage />,
        handle: { title: ["Pessoas", "Fornecedores"] } satisfies RouteHandle,
      },
      {
        path: "fornecedores/:id",
        element: <SupplierDetailPage />,
        handle: {
          title: ["Pessoas", "Fornecedores", "Detalhes"],
        } satisfies RouteHandle,
      },
      {
        path: "fornecedores/cadastrar",
        element: <SupplierCreatePage />,
        handle: {
          title: ["Pessoas", "Fornecedores", "Cadastro"],
        } satisfies RouteHandle,
      },
      {
        path: "fornecedores/:id/editar",
        element: <SupplierEditPage />,
        handle: {
          title: ["Pessoas", "Fornecedores", "Edição"],
        } satisfies RouteHandle,
      },
      {
        path: "produtos",
        element: <ProductsListPage />,
        handle: { title: ["Domínios", "Produtos"] } satisfies RouteHandle,
      },
      {
        path: "produtos/:id",
        element: <ProductDetailPage />,
        handle: {
          title: ["Domínios", "Produtos", "Detalhes"],
        } satisfies RouteHandle,
      },
      {
        path: "produtos/cadastrar",
        element: <ProductCreatePage />,
        handle: {
          title: ["Domínios", "Produtos", "Cadastro"],
        } satisfies RouteHandle,
      },
      {
        path: "produtos/:id/editar",
        element: <ProductEditPage />,
        handle: {
          title: ["Domínios", "Produtos", "Edição"],
        } satisfies RouteHandle,
      },
      {
        path: "servicos",
        element: <ServicesListPage />,
        handle: { title: ["Domínios", "Serviços"] } satisfies RouteHandle,
      },
      {
        path: "servicos/:id",
        element: <ServiceDetailPage />,
        handle: {
          title: ["Domínios", "Serviços", "Detalhes"],
        } satisfies RouteHandle,
      },
      {
        path: "servicos/cadastrar",
        element: <ServiceCreatePage />,
        handle: {
          title: ["Domínios", "Serviços", "Cadastro"],
        } satisfies RouteHandle,
      },
      {
        path: "servicos/:id/editar",
        element: <ServiceEditPage />,
        handle: {
          title: ["Domínios", "Serviços", "Edição"],
        } satisfies RouteHandle,
      },
      {
        path: "financeiro/extrato",
        element: <TransactionsListPage />,
        handle: { title: ["Financeiro", "Extratos"] } satisfies RouteHandle,
      },
      {
        path: "financeiro/extrato/:id",
        element: <TransactionDetailPage />,
        handle: {
          title: ["Financeiro", "Extratos", "Detalhes"],
        } satisfies RouteHandle,
      },
      {
        path: "financeiro/cadastrar",
        element: <TransactionCreatePage />,
        handle: { title: ["Financeiro", "Cadastro"] } satisfies RouteHandle,
      },
    ],
  },
]);
