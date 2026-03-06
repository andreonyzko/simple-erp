import { productService } from "@/domain/services/ProductService";
import type { LoaderFunctionArgs } from "react-router";

export async function productDetailLoader({params}: LoaderFunctionArgs) {
    const id = Number(params.id);
    if(isNaN(id)) throw new Error("Invalid product id.");

    return await productService.getById(id);
}