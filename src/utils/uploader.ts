import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { FastifyReply } from "fastify";
import { SERVICE_ERRORS } from "./errors-handler";

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
  "file",
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
  const savedFiles: string[] = [];

  try {
    for await (const part of parts) {
      /*console.log("Processing part:", {
        type: part.type,
        fieldname: part.fieldname,
        filename: part.filename,
        mimetype: part.mimetype,
      });*/

      if (part.type === "file") {
        if (mediaFilenames.length >= MAX_FILES_LIMIT) {
          await cleanupFiles(savedFiles);
          if (!reply.sent) {
            throw new Error(SERVICE_ERRORS.MAX_IMAGES);
          }
          return null;
        }

        if (!ALLOWED_MIME_TYPES.includes(part.mimetype || "")) {
          await cleanupFiles(savedFiles);
          if (!reply.sent) {
            throw new Error(SERVICE_ERRORS.UNSPORTED_FILE_TYPE);
          }
          return null;
        }

        const sanitizedFilename = part.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${sanitizedFilename}`;
        const filepath = path.join(filePath, filename);

        await pipeline(part.file, fs.createWriteStream(filepath));
        mediaFilenames.push(filename);
        savedFiles.push(filepath);
      } else if (part.type === "field") {
        //console.log("Field:", part.fieldname, "=", part.value);

        // Handle the field value - await it if it's a promise
        let fieldValue = part.value;
        if (typeof fieldValue?.then === "function") {
          fieldValue = await fieldValue;
        }

        if (fields[part.fieldname]) {
          if (Array.isArray(fields[part.fieldname])) {
            fields[part.fieldname].push(fieldValue);
          } else {
            fields[part.fieldname] = [fields[part.fieldname], fieldValue];
          }
        } else {
          // Try to parse JSON strings
          if (
            typeof fieldValue === "string" &&
            (fieldValue.startsWith("[") || fieldValue.startsWith("{"))
          ) {
            try {
              fields[part.fieldname] = JSON.parse(fieldValue);
            } catch {
              fields[part.fieldname] = fieldValue;
            }
          } else {
            fields[part.fieldname] = fieldValue;
          }
        }
      } else {
        console.log("Unknown part type:", part.type);
      }
    }

    console.log("Final fields:", fields);
    console.log("Media filenames:", mediaFilenames);
    return { fields, mediaFilenames };
  } catch (error) {
    console.error("Error in processFileUploads:", error);
    await cleanupFiles(savedFiles);
    throw error;
  }
}

// Helper function to cleanup files
export async function cleanupFiles(filePaths: string[]): Promise<void> {
  for (const filepath of filePaths) {
    try {
      if (fs.existsSync(filepath)) {
        await fs.promises.unlink(filepath);
      }
    } catch (error) {
      console.error(`Failed to cleanup file ${filepath}:`, error);
    }
  }
}
