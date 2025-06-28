import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { FastifyReply } from "fastify";

export const orderImagesPath = path.join(process.cwd(), "pictures/orders");
if (!fs.existsSync(orderImagesPath)) {
  fs.mkdirSync(orderImagesPath, { recursive: true });
}

export const serviceImagesPath = path.join(process.cwd(), "pictures/services");
if (!fs.existsSync(serviceImagesPath)) {
  fs.mkdirSync(serviceImagesPath, { recursive: true });
}

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "video/mp4",
];
export const MAX_FILES_LIMIT = 15;

export interface ProcessedUpload {
  fields: Record<string, any>;
  mediaFilenames: string[];
}

export async function processFileUploads(
  parts: AsyncIterable<any>,
  reply: FastifyReply,
  filePath: string,
): Promise<ProcessedUpload | null> {
  const fields: Record<string, any> = {};
  const mediaFilenames: string[] = [];

  try {
    for await (const part of parts) {
      if (part.type === "file") {
        if (!ALLOWED_MIME_TYPES.includes(part.mimetype || "")) {
          reply.code(400).send({
            success: false,
            message: "Unsupported file type",
          });
          return null;
        }

        const filename = `${Date.now()}-${part.filename}`;
        const filepath = path.join(filePath, filename);

        await pipeline(part.file, fs.createWriteStream(filepath));
        mediaFilenames.push(filename);
      } else if (part.type === "field") {
        fields[part.fieldname] = part.value;
      }
    }

    if (mediaFilenames.length > MAX_FILES_LIMIT) {
      reply.code(400).send({
        success: false,
        message: `Max ${MAX_FILES_LIMIT} files allowed`,
      });
      return null;
    }

    return { fields, mediaFilenames };
  } catch (error) {
    reply.code(500).send({
      success: false,
      message: "Error processing file upload",
    });
    return null;
  }
}
