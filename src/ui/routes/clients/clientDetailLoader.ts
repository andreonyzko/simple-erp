import { clientService } from "@/domain/services/ClientService";
import type { LoaderFunctionArgs } from "react-router";

export async function clientDetailLoader({ params }: LoaderFunctionArgs){
    const id = Number(params.id);
    if(isNaN(id)) throw new Error("Invalid client id");

    return await clientService.getById(id);
}