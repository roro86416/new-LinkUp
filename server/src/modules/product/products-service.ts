// 1. 匯入你建立的「共用」prisma 實例
//    (路徑是從 /src/modules/products/ 回到 /src/utils/)
import prisma from "../../utils/prisma-only";

// 2. 匯入你用 Zod 建立的型別，以便 Service 知道資料長相
import { CreateProductBody, UpdateProductBody } from "./products.schema.js"; //

// --- 獲取所有產品的 Service ---
export const findAllProductsService = async () => {
  // 這是你原本在 routes 裡的 prisma 邏輯
  const products = await prisma.product.findMany({
    include: { variants: true },
  });
  return products;
};

// --- 建立新產品的 Service ---
export const createNewProductService = async (
  productData: CreateProductBody // 使用 Zod 的型別
) => {
  // 這是你原本在 routes 裡的 prisma 邏輯
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

// --- 更新產品的 Service ---
export const updateProductService = async (
  id: number,
  productData: UpdateProductBody
) => {
  // 這是你原本在 routes 裡的 $transaction 邏輯
  const { variants, ...data } = productData;

  const result = await prisma.$transaction(async (tx) => {
    // 1. 更新產品主體
    const updatedProduct = await tx.product.update({
      where: { id: id },
      data: data,
    });

    // 2. 如果有提供 variants，就刪除舊的並建立新的
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
  // 這是你原本在 routes 裡的 prisma 邏輯
  const deletedProduct = await prisma.product.delete({
    where: { id },
  });
  return deletedProduct;
};
