import { z } from 'zod';

export const tokenSchema = z.object({
  token: z.string().min(1),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  redirectURI: z.string().url().min(1),
});

export interface BotFormValue {
  token: string;
  clientId: string;
  redirectURI: string;
  clientSecret: string;
}

export const gptSchema = z.object({
  gptToken: z.string().min(1),
});
