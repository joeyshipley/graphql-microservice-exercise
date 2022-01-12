import { ObjectId } from 'mongodb';

export type Ref<T> = T | ObjectId;

export type AuthPayload = {
  userId: string
};

export type EnvValue = string | undefined;
export type ValidationMessage = { property?: string, value?: string | null };