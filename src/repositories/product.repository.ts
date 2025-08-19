import { Product, CreateProductDTO, UpdateProductDTO } from '../types/product.types';
import { generateIdSync } from '../utils/idGenerator';

class ProductRepository {
  private products: Product[] = [];

  findAll(): Product[] {
    return [...this.products];
  }

  findById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  findBySlug(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  findActive(): Product[] {
    return this.products.filter(p => p.isActive);
  }

  create(data: CreateProductDTO): Product {
    const newProduct: Product = {
      id: generateIdSync('product'),
      ...data,
      gallery: data.gallery || [],
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: string, data: UpdateProductDTO): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return null;
    }

    const updatedProduct = {
      ...this.products[index],
      ...data,
      updatedAt: new Date(),
    };

    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  delete(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return false;
    }

    this.products.splice(index, 1);
    return true;
  }

  clear(): void {
    this.products = [];
  }
}

export const productRepository = new ProductRepository();