import { hash } from "@faustbrian/node-sha256";
import { base58 } from "bstring";

export const encode = (content: string): string => {
  const buffer: Buffer = Buffer.from(content);

  return base58.encode(
    Buffer.concat([buffer, hash(content)], buffer.length + 4),
  );
};

export const decode = (content: string): Buffer => {
  const buffer: Buffer = base58.decode(content);
  const payload: Buffer = buffer.slice(0, -4);
  const checksum: Buffer = hash(payload);

  if (checksum.readUInt32LE(0) !== buffer.slice(-4).readUInt32LE(0)) {
    throw new Error("The expected and actual checksum do not match.");
  }

  return payload;
};

export const verify = (content: string): boolean => base58.test(content);
