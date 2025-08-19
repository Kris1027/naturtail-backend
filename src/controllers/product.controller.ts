import { Request, Response } from 'express';
import { CreateProductDTO, Product, UpdateProductDTO } from '../types/product.types';
import { generateId } from '../utils/idGenerator';

const products: Product[] = [];

export const createProduct = async (req: Request<{}, {}, CreateProductDTO>, res: Response) => {
  try {
    const { name, slug, priceCents, description, imageUrl, gallery, categoryId, brand, isActive } =
      req.body;

    if (!name || !slug || !priceCents || !description || !imageUrl || !categoryId || !brand) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        requiredFields: [
          'name',
          'slug',
          'priceCents',
          'description',
          'imageUrl',
          'categoryId',
          'brand',
        ],
      });
    }

    if (priceCents < 0 || !Number.isInteger(priceCents)) {
      return res.status(400).json({
        success: false,
        error: 'Price must be a positive integer in cents',
      });
    }

    const existingProduct = products.find((p) => p.slug === slug);
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        error: 'Product with this slug already exists',
      });
    }

    const newProduct: Product = {
      id: generateId('product'),
      name,
      slug,
      priceCents,
      description,
      imageUrl,
      gallery: gallery || [],
      categoryId,
      brand,
      isActive: isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    products.push(newProduct);

    return res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const updateProduct = async (
  req: Request<{ id: string }, {}, UpdateProductDTO>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    const updatedProduct: Product = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date(),
    };

    products[productIndex] = updatedProduct;

    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const deleteProduct = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export { products };
