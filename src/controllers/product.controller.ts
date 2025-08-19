import { Request, Response } from 'express';
import { CreateProductDTO, UpdateProductDTO } from '../types/product.types';
import { productRepository } from '../repositories/product.repository';
import { logger } from '../utils/logger';

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

    const existingProduct = productRepository.findBySlug(slug);
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        error: 'Product with this slug already exists',
      });
    }

    const newProduct = productRepository.create({
      name,
      slug,
      priceCents,
      description,
      imageUrl,
      gallery,
      categoryId,
      brand,
      isActive,
    });

    return res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = productRepository.findAll();
    return res.status(200).json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    logger.error('Error fetching products', error);
    return res.status(500).json({
      success: false,
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

    const updatedProduct = productRepository.update(id, updates);

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    logger.error('Error updating product', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const deleteProduct = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const product = productRepository.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    productRepository.delete(id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    logger.error('Error deleting product', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

