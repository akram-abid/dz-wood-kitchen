import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { servicePostService } from "../services/services.service";

const addPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.string(),
  woodType: z.string(),
  estimatedTime: z.string(),
  adminId: z.string().uuid(),
  imageFilenames: z.array(z.string()).max(15),
});

const deletePostParamsSchema = z.object({
  id: z.string().uuid(),
});

const getByAdminParamsSchema = z.object({
  adminId: z.string().uuid(),
});

const getPostByIdSchema = z.object({
  postId: z.string().uuid(),
});

export const addPostHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const body = addPostSchema.parse(req.body);

    const post = await servicePostService.addPost(body);

    return reply.code(201).send({ success: true, post });
  } catch (error: any) {
    req.log.error("Add post error", error);
    return reply.code(400).send({ success: false, message: error.message });
  }
};

export const deletePostHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = deletePostParamsSchema.parse(req.params);

    const deleted = await servicePostService.removePost(
      id,
      "admin-id-placeholder",
    );

    return reply.send({ success: true, deleted });
  } catch (error: any) {
    req.log.error("Delete post error", error);
    return reply.code(400).send({ success: false, message: error.message });
  }
};

export const getPostsByAdminHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    //const { adminId } = getByAdminParamsSchema.parse(req.params);

    const posts = await servicePostService.getPostsByAdmin();

    return reply.send({ success: true, posts });
  } catch (error: any) {
    req.log.error("Get posts error", error);
    return reply.code(400).send({ success: false, message: error.message });
  }
};

export const getPostsById = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { postId } = getPostByIdSchema.parse(req.params);

    const post = await servicePostService.getPostById(postId);

    return reply.send({ success: true, post });
  } catch (error: any) {
    req.log.error("Get posts error", error);
    return reply.code(400).send({ success: false, message: error.message });
  }
};
