import { serviceService } from "@/domain/services/ServiceService";
import type { LoaderFunctionArgs } from "react-router";

export async function serviceDetailLoader({params}: LoaderFunctionArgs) {
    const id = Number(params.id);
    if(isNaN(id)) throw new Error("Invalid service id.");

    return await serviceService.getById(id);
}