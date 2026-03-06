import { transactionService } from "@/domain/services/TransactionService";
import type { LoaderFunctionArgs } from "react-router";

export async function transactionDetailLoader({params}: LoaderFunctionArgs){
    const id = Number(params.id);
    if(isNaN(id)) throw new Error("Invalid transaction id.");

    return await transactionService.getById(id);
}