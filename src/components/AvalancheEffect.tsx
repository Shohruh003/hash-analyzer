import { useState, useMemo } from "react";
import {
    ALL_ALGORITHMS,
    HASH_INFO,
    computeHashBytes,
    bitsDifferent,
    HashAlgorithm,
} from "../lib/hashes";

function flipBit(input: string, bitIndex: number): string {
    const bytes = new TextEncoder().encode(input);
    if (bitIndex >= bytes.length * 8) return input;
    const byteIdx = Math.floor(bitIndex / 8);
    const bitInByte = bitIndex % 8;
    bytes[byteIdx] ^= 1 << bitInByte;
    return new TextDecoder().decode(bytes);
}

function bytesToBitGrid(bytes: Uint8Array): number[] {
    const bits: number[] = [];
    for (const b of bytes) {
        for (let i = 7; i >= 0; i--) {
            bits.push((b >> i) & 1);
        }
    }
    return bits;
}

export function AvalancheEffect() {
    const [input, setInput] = useState("Salom, dunyo!");
    const [algo, setAlgo] = useState<HashAlgorithm>("SHA-256");

    const analysis = useMemo(() => {
        const original = input;
        const modified = flipBit(input, 0);
        const hashA = computeHashBytes(algo, original);
        const hashB = computeHashBytes(algo, modified);
        const totalBits = hashA.length * 8;
        const changedBits = bitsDifferent(hashA, hashB);
        const percent = (changedBits / totalBits) * 100;
        return {
            original,
            modified,
            hashA,
            hashB,
            totalBits,
            changedBits,
            percent,
            bitsA: bytesToBitGrid(hashA),
            bitsB: bytesToBitGrid(hashB),
        };
    }, [input, algo]);

    const toHex = (bytes: Uint8Array) =>
        Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

    return (
        <div className="space-y-6">
            <div className="card-elevated">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-100 mb-2">
                            Matn (1-bit o'zgartiriladi)
                        </label>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="input-base font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-100 mb-2">
                            Algoritm
                        </label>
                        <select
                            value={algo}
                            onChange={(e) =>
                                setAlgo(e.target.value as HashAlgorithm)
                            }
                            className="input-base"
                        >
                            {ALL_ALGORITHMS.map((a) => (
                                <option key={a} value={a}>
                                    {a} ({HASH_INFO[a].construction})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="card-elevated text-center">
                <div className="text-6xl font-bold text-accent mb-2">
                    {analysis.percent.toFixed(2)}%
                </div>
                <div className="text-slate-100">
                    bit o'zgardi (<strong>{analysis.changedBits}</strong> /{" "}
                    {analysis.totalBits} bit)
                </div>
                <div className="text-xs text-slate-300 mt-2">
                    Ideal qiymat ~50% atrofida bo'lishi kerak (yaxshi xesh
                    funksiyada)
                </div>
                <div className="mt-4 h-3 bg-bg rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-accent to-success transition-all duration-500"
                        style={{ width: `${analysis.percent}%` }}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="card">
                    <div className="text-xs text-slate-300 mb-1">
                        Asl matn xeshi
                    </div>
                    <div className="font-mono text-xs text-slate-100 break-all">
                        {toHex(analysis.hashA)}
                    </div>
                </div>
                <div className="card">
                    <div className="text-xs text-slate-300 mb-1">
                        1-bit o'zgargandagi xesh
                    </div>
                    <div className="font-mono text-xs text-slate-100 break-all">
                        {toHex(analysis.hashB)}
                    </div>
                </div>
            </div>

            <div className="card-elevated">
                <h3 className="text-sm font-medium text-slate-100 mb-3">
                    Bit-darajada vizualizatsiya
                </h3>
                <div className="text-xs text-slate-300 mb-2">
                    🟢 — bir xil bit · 🔴 — o'zgargan bit
                </div>
                <div className="flex flex-wrap gap-[2px]">
                    {analysis.bitsA.map((bit, i) => {
                        const changed = bit !== analysis.bitsB[i];
                        return (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-sm ${
                                    changed ? "bg-danger" : "bg-success/40"
                                }`}
                                title={`Bit ${i + 1}: ${changed ? "o'zgargan" : "o'zgarmagan"}`}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="card border-l-4 border-l-success">
                <h3 className="font-bold text-white mb-2">📚 Nazariy asos</h3>
                <p className="text-sm text-slate-100 leading-relaxed">
                    <strong>Avalanche effekti</strong> — kriptografik xesh
                    funksiyaning muhim xususiyati: kirishdagi kichik o'zgarish
                    (hatto 1 bit) chiqishni 50% atrofida o'zgartirishi kerak. Bu
                    Strict Avalanche Criterion (SAC) deb ataladi va Webster va
                    Tavares (1985) tomonidan kiritilgan. Yaxshi xesh funksiyada
                    bu qiymat 49-51% oralig'ida bo'ladi.
                </p>
            </div>
        </div>
    );
}
