import { purchaseService } from "@/domain/services/PurchaseService";
import type { LoaderFunctionArgs } from "react-router";

export async function purchaseDetailLoader({params}: LoaderFunctionArgs){
    const id = Number(params.id);
    if(isNaN(id)) throw new Error("Invalid purchase id.");

    return await purchaseService.getById(id);
}