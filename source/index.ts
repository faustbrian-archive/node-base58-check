import { SHA256 } from "bcrypto";
import { base58 } from "bstring";

const hash256 = (buffer: Buffer | string | Buffer[]): Buffer => {
  if (Array.isArray(buffer)) {
    let sha256 = SHA256.ctx;

    sha256.init();

    for (const element of buffer) {
      sha256 = sha256.update(element);
    }

    return sha256.final();
  }

  return SHA256.digest(Buffer.from(buffer));
};

export const encode = (content: string): string => {
  const buffer: Buffer = Buffer.from(content);

  return base58.encode(
    Buffer.concat([buffer, hash256(content)], buffer.length + 4),
  );
};

export const decode = (content: string): Buffer => {
  const buffer: Buffer = base58.decode(content);
  const payload: Buffer = buffer.slice(0, -4);
  const checksum: Buffer = hash256(payload);

  if (checksum.readUInt32LE(0) !== buffer.slice(-4).readUInt32LE(0)) {
    throw new Error("The expected and actual checksum do not match.");
  }

  return payload;
};

export const verify = (content: string): boolean => base58.test(content);
