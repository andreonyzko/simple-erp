import { supplierService } from "@/domain/services/SupplierService";
import type { LoaderFunctionArgs } from "react-router";

export async function supplierDetailLoader({ params }: LoaderFunctionArgs) {
    const id = Number(params.id);
    if(isNaN(id)) throw new Error("Invalid supplier id.");

    return await supplierService.getById(id);
}