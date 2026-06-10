import { sha1 } from "@noble/hashes/sha1";
import { sha256, sha224 } from "@noble/hashes/sha2";
import { sha384, sha512 } from "@noble/hashes/sha2";
import { sha3_256, sha3_512, keccak_256 } from "@noble/hashes/sha3";
import { blake2b, blake2s } from "@noble/hashes/blake2";
import { blake3 } from "@noble/hashes/blake3";
import { md5 } from "js-md5";

export type HashAlgorithm =
    | "MD5"
    | "SHA-1"
    | "SHA-224"
    | "SHA-256"
    | "SHA-384"
    | "SHA-512"
    | "SHA3-256"
    | "SHA3-512"
    | "Keccak-256"
    | "BLAKE2b"
    | "BLAKE2s"
    | "BLAKE3";

export interface HashInfo {
    name: HashAlgorithm;
    construction:
        | "Merkle-Damgård"
        | "Sponge"
        | "HAIFA"
        | "Tree"
        | "Merkle-Damgård (zaif)";
    outputBits: number;
    year: number;
    security: "Zaif" | "O'rta" | "Yuqori";
    color: string;
}

export const HASH_INFO: Record<HashAlgorithm, HashInfo> = {
    MD5: {
        name: "MD5",
        construction: "Merkle-Damgård (zaif)",
        outputBits: 128,
        year: 1992,
        security: "Zaif",
        color: "#ef4444",
    },
    "SHA-1": {
        name: "SHA-1",
        construction: "Merkle-Damgård",
        outputBits: 160,
        year: 1995,
        security: "Zaif",
        color: "#f59e0b",
    },
    "SHA-224": {
        name: "SHA-224",
        construction: "Merkle-Damgård",
        outputBits: 224,
        year: 2001,
        security: "Yuqori",
        color: "#3b82f6",
    },
    "SHA-256": {
        name: "SHA-256",
        construction: "Merkle-Damgård",
        outputBits: 256,
        year: 2001,
        security: "Yuqori",
        color: "#2563eb",
    },
    "SHA-384": {
        name: "SHA-384",
        construction: "Merkle-Damgård",
        outputBits: 384,
        year: 2001,
        security: "Yuqori",
        color: "#1d4ed8",
    },
    "SHA-512": {
        name: "SHA-512",
        construction: "Merkle-Damgård",
        outputBits: 512,
        year: 2001,
        security: "Yuqori",
        color: "#1e40af",
    },
    "SHA3-256": {
        name: "SHA3-256",
        construction: "Sponge",
        outputBits: 256,
        year: 2015,
        security: "Yuqori",
        color: "#10b981",
    },
    "SHA3-512": {
        name: "SHA3-512",
        construction: "Sponge",
        outputBits: 512,
        year: 2015,
        security: "Yuqori",
        color: "#059669",
    },
    "Keccak-256": {
        name: "Keccak-256",
        construction: "Sponge",
        outputBits: 256,
        year: 2012,
        security: "Yuqori",
        color: "#047857",
    },
    BLAKE2b: {
        name: "BLAKE2b",
        construction: "HAIFA",
        outputBits: 512,
        year: 2012,
        security: "Yuqori",
        color: "#a855f7",
    },
    BLAKE2s: {
        name: "BLAKE2s",
        construction: "HAIFA",
        outputBits: 256,
        year: 2012,
        security: "Yuqori",
        color: "#9333ea",
    },
    BLAKE3: {
        name: "BLAKE3",
        construction: "Tree",
        outputBits: 256,
        year: 2020,
        security: "Yuqori",
        color: "#c026d3",
    },
};

const encoder = new TextEncoder();

function toHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export function computeHash(algo: HashAlgorithm, input: string): string {
    const data = encoder.encode(input);
    switch (algo) {
        case "MD5":
            return md5.hex(input);
        case "SHA-1":
            return toHex(sha1(data));
        case "SHA-224":
            return toHex(sha224(data));
        case "SHA-256":
            return toHex(sha256(data));
        case "SHA-384":
            return toHex(sha384(data));
        case "SHA-512":
            return toHex(sha512(data));
        case "SHA3-256":
            return toHex(sha3_256(data));
        case "SHA3-512":
            return toHex(sha3_512(data));
        case "Keccak-256":
            return toHex(keccak_256(data));
        case "BLAKE2b":
            return toHex(blake2b(data));
        case "BLAKE2s":
            return toHex(blake2s(data));
        case "BLAKE3":
            return toHex(blake3(data));
    }
}

export function computeHashBytes(
    algo: HashAlgorithm,
    input: string,
): Uint8Array {
    const data = encoder.encode(input);
    switch (algo) {
        case "MD5": {
            const hex = md5.hex(input);
            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0; i < bytes.length; i++) {
                bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
            }
            return bytes;
        }
        case "SHA-1":
            return sha1(data);
        case "SHA-224":
            return sha224(data);
        case "SHA-256":
            return sha256(data);
        case "SHA-384":
            return sha384(data);
        case "SHA-512":
            return sha512(data);
        case "SHA3-256":
            return sha3_256(data);
        case "SHA3-512":
            return sha3_512(data);
        case "Keccak-256":
            return keccak_256(data);
        case "BLAKE2b":
            return blake2b(data);
        case "BLAKE2s":
            return blake2s(data);
        case "BLAKE3":
            return blake3(data);
    }
}

export function bitsDifferent(a: Uint8Array, b: Uint8Array): number {
    const len = Math.min(a.length, b.length);
    let count = 0;
    for (let i = 0; i < len; i++) {
        let xor = a[i] ^ b[i];
        while (xor) {
            count += xor & 1;
            xor >>>= 1;
        }
    }
    return count;
}

export const ALL_ALGORITHMS: HashAlgorithm[] = [
    "MD5",
    "SHA-1",
    "SHA-256",
    "SHA-512",
    "SHA3-256",
    "SHA3-512",
    "BLAKE2b",
    "BLAKE3",
];
