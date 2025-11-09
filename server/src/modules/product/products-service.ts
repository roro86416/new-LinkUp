import prisma from "../../utils/prisma-only.js";
import { CreateProductBody, UpdateProductBody } from "./products.schema"; //

export const findAllProductsService = async () => {
  const products = await prisma.product.findMany({
    include: { variants: true },
  });
  return products;
};

export const findProductByIdService = async (id: number) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: { variants: true },
  });
  return product;
};

export const createNewProductService = async (
  productData: CreateProductBody
) => {
  const { variants, ...data } = productData;
  const newProduct = await prisma.product.create({
    data: {
      ...data,
      variants: {
        create: variants,
      },
    },
    include: {
      variants: true,
    },
  });
  return newProduct;
};

export const updateProductService = async (
  id: number,
  productData: UpdateProductBody
) => {
  const { variants, ...data } = productData;
  const result = await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: { id: id },
      data: data,
    });

    //如果有提供 variants，就刪除舊的並建立新的
    if (variants) {
      const variantsData = (variants || []).map((variant) => ({
        ...variant,
        product_id: id,
      }));
      // 刪除所有舊的 variants
      await tx.productVariant.deleteMany({
        where: {
          product_id: id,
        },
      });
      // 建立所有新的 variants
      await tx.productVariant.createMany({
        data: variantsData,
      });
    }
    return updatedProduct;
  });

  return result;
};

// --- 刪除產品的 Service ---
export const deleteProductService = async (id: number) => {
  const deletedProduct = await prisma.product.delete({
    where: { id },
  });
  return deletedProduct;
};
