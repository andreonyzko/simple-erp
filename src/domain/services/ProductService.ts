import type { CreateProductDTO, UpdateProductDTO } from "../dtos/ProductDTO";
import type { Product } from "../entities/product";
import { productRepository } from "../repositories/ProductRepository";
import { supplierRepository } from "../repositories/SupplierRepository";

type ProductFilters = {
  search?: string;
  stock?: "no-control" | "in-stock" | "out-stock";
  cost?: {
    min: number;
    max?: number;
  };
  sellPrice?: {
    min: number;
    max?: number;
  };
  active?: boolean;
};

class ProductService {
  async create(data: CreateProductDTO): Promise<number> {
    // Build full entity to apply business rules before persist
    const product: Product = {
      ...data,
      id: 0,
      active: true,
    };
    this.validateRules(product);

    return await productRepository.create(data);
  }
  async update(id: number, data: UpdateProductDTO): Promise<number> {
    const current = await productRepository.findById(id);

    // Merge preserving immutable fields (id, active) and calculating stock
    const updated: Product = {
      ...current,
      ...data,
      id: current.id,
      active: current.active,
      stock: this.calculateStock(current, data),
    };

    this.validateRules(updated);

    return await productRepository.update(id, data);
  }

  async active(id: number, active: boolean): Promise<number> {
    const product = await productRepository.findById(id);

    // Validate state transition (avoid redundant toggles)
    if (active === product.active)
      throw new Error(`Este produto já está ${active ? "ativo" : "inativo"}`);

    return await productRepository.active(id, active);
  }

  async list(filters: ProductFilters): Promise<Product[]> {
    // 1. Apply indexed filters (text, active, or stock)
    let products = filters.search?.trim()
      ? await productRepository.searchByText(filters.search)
      : filters.active !== undefined
      ? await productRepository.listByActive(filters.active)
      : filters.stock === "out-stock"
      ? await productRepository.listWithoutStock()
      : filters.stock === "in-stock"
      ? await productRepository.listWithStock()
      : filters.stock === "no-control"
      ? await productRepository.listWithoutStockControl()
      : await productRepository.listAll();

    // 2. Filter by active (if search was applied)
    if (filters.active !== undefined)
      products = products.filter((p) => p.active === filters.active);

    // 3. Filter by stock state (if search was applied)
    if (filters.stock === "out-stock")
      products = products.filter(
        (p) => p.stockControl && p.stock !== undefined && p.stock === 0
      );
    else if (filters.stock === "in-stock")
      products = products.filter(
        (p) => p.stockControl && p.stock !== undefined && p.stock > 0
      );
    else if (filters.stock === "no-control")
      products = products.filter((p) => !p.stockControl);

    // 4. Filter by cost range
    if (filters.cost?.min !== undefined)
      products = products.filter(
        (p) => p.cost !== undefined && p.cost >= filters.cost!.min
      );
    if (filters.cost?.max !== undefined)
      products = products.filter(
        (p) => p.cost !== undefined && p.cost <= filters.cost!.max!
      );

    // 5. Filter by sell price range
    if (filters.sellPrice?.min !== undefined)
      products = products.filter(
        (p) =>
          p.sellPrice !== undefined && p.sellPrice >= filters.sellPrice!.min
      );
    if (filters.sellPrice?.max !== undefined)
      products = products.filter(
        (p) =>
          p.sellPrice !== undefined && p.sellPrice <= filters.sellPrice!.max!
      );

    return products;
  }

  async getById(id: number): Promise<Product> {
    return await productRepository.findById(id);
  }

  private async validateRules(product: Product): Promise<void> {
    if (!product.name.trim())
      throw new Error("O nome do produto não pode ser vazio");

    if (product.supplierId !== undefined)
      await supplierRepository.findById(product.supplierId);

    if (!product.stockControl && product.stock !== undefined)
      throw new Error("Não pode informar estoque sem controle ativo");

    if (product.stock !== undefined && product.stock < 0)
      throw new Error("O estoque não pode ser negativo");

    if (product.cost !== undefined && product.cost < 0)
      throw new Error("O custo não pode ser negativo");

    if (product.sellPrice !== undefined && product.sellPrice < 0)
      throw new Error("O preço de venda não pode ser negativo");
  }

  // Calculate stock based on stockControl toggle and provided value
  private calculateStock(
    current: Product,
    update: UpdateProductDTO
  ): number | undefined {
    if (update.stockControl === undefined) {
      if (current.stockControl)
        return update.stock !== undefined ? update.stock : current.stock;
      else return undefined;
    } else if (update.stockControl) {
      return update.stock !== undefined ? update.stock : 0;
    } else if (!update.stockControl) {
      return undefined;
    }

    return current.stock;
  }
}
export const productService = new ProductService();
