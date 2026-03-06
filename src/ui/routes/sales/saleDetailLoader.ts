import { saleService } from "@/domain/services/SaleService";
import type { LoaderFunctionArgs } from "react-router";

export async function saleDetailLoader({params}: LoaderFunctionArgs){
    const id = Number(params.id);
    if(isNaN(id)) throw new Error("Invalid sale id.");

    return await saleService.getById(id);
}