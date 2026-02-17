import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ProductDetailsProps {
  id: number;
}

export default async function ProductDetails({ id }: ProductDetailsProps) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    return product;
  } catch (error) {
    console.error("Product fetch error:", error);
    return null;
  }
}