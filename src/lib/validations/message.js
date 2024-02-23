import { z } from "zod";

export const messageValidator = z.object({
  senderId: z.string(),
  content: z.string().max(2000),
  timestamp: z.number(),
});

export const messageValidatorArray = z.array(messageValidator);
