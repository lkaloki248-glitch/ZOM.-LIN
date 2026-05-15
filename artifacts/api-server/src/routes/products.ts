import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const ProductBodySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  price: z.number().positive(),
  image: z.string().min(1),
  images: z.array(z.string()).optional(),
  category: z.string().min(1),
  description: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

router.get("/products", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .orderBy(productsTable.sortOrder, productsTable.createdAt);
    res.json(rows.map(toClient));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/products", async (req, res) => {
  const parsed = ProductBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  const id = data.id ?? Date.now().toString() + Math.random().toString(36).slice(2);
  try {
    const [row] = await db
      .insert(productsTable)
      .values({
        id,
        name: data.name,
        price: String(data.price),
        image: data.image,
        images: data.images ?? null,
        category: data.category,
        description: data.description ?? null,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();
    res.status(201).json(toClient(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/products/:id", async (req, res) => {
  const parsed = ProductBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  try {
    const [row] = await db
      .update(productsTable)
      .set({
        name: data.name,
        price: String(data.price),
        image: data.image,
        images: data.images ?? null,
        category: data.category,
        description: data.description ?? null,
        sortOrder: data.sortOrder ?? 0,
      })
      .where(eq(productsTable.id, req.params.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(toClient(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await db.delete(productsTable).where(eq(productsTable.id, req.params.id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

router.post("/products/bulk", async (req, res) => {
  const parsed = z.array(ProductBodySchema).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const rows = await db
      .insert(productsTable)
      .values(
        parsed.data.map((data) => ({
          id: data.id ?? Date.now().toString() + Math.random().toString(36).slice(2),
          name: data.name,
          price: String(data.price),
          image: data.image,
          images: data.images ?? null,
          category: data.category,
          description: data.description ?? null,
          sortOrder: data.sortOrder ?? 0,
        }))
      )
      .returning();
    res.status(201).json(rows.map(toClient));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to bulk insert products" });
  }
});

function toClient(row: typeof productsTable.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    price: parseFloat(String(row.price)),
    image: row.image,
    images: (row.images as string[] | null) ?? undefined,
    category: row.category,
    description: row.description ?? undefined,
  };
}

export default router;
