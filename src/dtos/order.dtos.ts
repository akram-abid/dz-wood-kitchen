import { z } from "zod";

export const createOrderDto = z.object({
  title: z.string().optional(),
  email: z.string().email(),
  fullName: z.string(),
  description: z.string(),
  woodType: z.string().optional(),
  daira: z.string(),
  street: z.string(),
  baladia: z.string(),
  wilaya: z.string(),
  phoneNumber: z.string(),
  mediaFilenames: z.array(z.string()).max(10).optional(),
  postId: z.string().uuid().optional(),
  userId: z.string().uuid(),
});

export const updateOrderDto = createOrderDto.partial();

export const addInstallmentDto = z.object({
  newInstallment: z.object({
    date: z.string(),
    amount: z.number(),
  }),
});

export const updateStatusDto = z.object({
  status: z.string(),
});

export const updateOfferDto = z.object({
  offer: z.number(),
});

export const toggleValidationDto = z.object({
  validate: z.boolean(),
});

export const setArticlesDto = z.object({
  articles: z.array(z.any()),
});

export const orderIdParamDto = z.object({
  id: z.string().uuid(),
});
