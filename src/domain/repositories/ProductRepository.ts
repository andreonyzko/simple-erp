import { db } from "../../infra/database";
import type { CreateProductDTO, UpdateProductDTO } from "../dtos/ProductDTO";
import type { Product } from "../entities/product";

class ProductRepository {
  async create(data: CreateProductDTO): Promise<number> {
    const productData = {
      ...data,
      active: true,
    };
    return await db.products.add(productData as Product);
  }

  async update(id: number, data: UpdateProductDTO): Promise<number> {
    const updated = await db.products.update(id, data);
    if (updated === 0) throw new Error("Nenhum produto foi atualizado");

    return updated;
  }

  // Toggle active/inactive status (soft-delete)
  async active(id: number, active: boolean): Promise<number> {
    const updated = await db.products.update(id, { active });
    if (updated === 0) throw new Error("Nenhum produto foi atualizado");

    return updated;
  }

  async findById(id: number): Promise<Product> {
    const product = await db.products.get(id);
    if (!product) throw new Error("Produto não encontrado");

    return product;
  }

  // Search by name (uses indexed field)
  async searchByText(text: string): Promise<Product[]> {
    if (!text.trim()) throw new Error("O texto de busca não pode ser vazio");

    return await db.products.where("name").startsWithIgnoreCase(text).toArray();
  }

  async listByActive(active: boolean): Promise<Product[]> {
    return await db.products.where("active").equals(Number(active)).toArray();
  }

  async listBySupplierId(supplierId: number): Promise<Product[]> {
    return await db.products.where("supplierId").equals(supplierId).toArray();
  }

  async listWithStock(): Promise<Product[]> {
    return await db.products.where("stock").above(0).toArray();
  }

  async listWithoutStock(): Promise<Product[]> {
    return await db.products.where("stock").equals(0).toArray();
  }

  async listWithoutStockControl(): Promise<Product[]> {
    return await db.products.where("stockControl").equals(0).toArray();
  }

  async listAll(): Promise<Product[]> {
    return await db.products.toArray();
  }
}

export const productRepository = new ProductRepository();
