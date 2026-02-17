import ProductDetails from "./ProductDetails";
import ProductDetailsClient from "./ProductDetailsClient";
import { PrismaClient } from "@prisma/client";
import Head from "next/head";

interface PageProps {
  params: Promise<{ id: string }>;
}

const prisma = new PrismaClient();

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params; // unwrap the promise
  const productId = parseInt(resolvedParams.id, 10);

  if (isNaN(productId)) {
    return <div>Invalid Product ID</div>;
  }

  // Fetch product details
  const product = await ProductDetails({ id: productId });

  // Fetch WhatsApp number directly from the database
  const waSetting = await prisma.setting.findUnique({
    where: { key: "whatsapp_number" },
  });
  const WHATSAPP_NUMBER = waSetting?.value || "";

  // Prepare dynamic metadata
  const productTitle = product?.name || "Product Details";
  const productDescription =
    product?.description.slice(0, 160) || "Check out this amazing product!";
  const productImage = product?.images?.[0] || "/og-image.png";
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const productURL = `${SITE_URL}/products/${productId}`;

  return (
    <>
      <Head>
        <title>{productTitle} | COBRA TRADERS</title>
        <meta name="description" content={productDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productURL} />
        <meta property="og:title" content={productTitle} />
        <meta property="og:description" content={productDescription} />
        <meta property="og:image" content={productImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={productURL} />
        <meta name="twitter:title" content={productTitle} />
        <meta name="twitter:description" content={productDescription} />
        <meta name="twitter:image" content={productImage} />
      </Head>

      <ProductDetailsClient
  product={
    product
      ? { ...product, specs: product.specs ?? undefined }
      : undefined
  }
  whatsappNumber={WHATSAPP_NUMBER}
/>
    </>
  );
}