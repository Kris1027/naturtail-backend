export interface Product {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  description: string;
  imageUrl: string;
  gallery: string[];
  categoryId: string;
  brand: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  slug: string;
  priceCents: number;
  description: string;
  imageUrl: string;
  gallery?: string[];
  categoryId: string;
  brand: string;
  isActive?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  slug?: string;
  priceCents?: number;
  description?: string;
  imageUrl?: string;
  gallery?: string[];
  categoryId?: string;
  brand?: string;
  isActive?: boolean;
}