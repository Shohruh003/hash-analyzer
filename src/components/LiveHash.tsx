import { useState, useMemo } from "react";
import {
    ALL_ALGORITHMS,
    HASH_INFO,
    computeHash,
    HashAlgorithm,
} from "../lib/hashes";

export function LiveHash() {
    const [input, setInput] = useState("Salom, dunyo!");
    const [copied, setCopied] = useState<HashAlgorithm | null>(null);

    const results = useMemo(() => {
        return ALL_ALGORITHMS.map((algo) => ({
            algo,
            info: HASH_INFO[algo],
            hash: computeHash(algo, input),
        }));
    }, [input]);

    const handleCopy = (algo: HashAlgorithm, hash: string) => {
        navigator.clipboard.writeText(hash);
        setCopied(algo);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div className="space-y-6">
            <div className="card-elevated">
                <label className="block text-sm font-medium text-slate-100 mb-2">
                    Xeshlash uchun matn kiriting
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="input-base font-mono min-h-[100px] resize-y"
                    placeholder="Matn yozing..."
                />
                <div className="mt-2 text-xs text-slate-300">
                    Matn uzunligi:{" "}
                    <span className="text-accent">{input.length}</span> belgi ·{" "}
                    <span className="text-accent">
                        {new TextEncoder().encode(input).length}
                    </span>{" "}
                    bayt
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {results.map(({ algo, info, hash }) => (
                    <div
                        key={algo}
                        className="card hover:border-slate-700 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-2 gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="w-2 h-8 rounded-full"
                                    style={{ backgroundColor: info.color }}
                                />
                                <div>
                                    <div className="font-bold text-white">
                                        {algo}
                                    </div>
                                    <div className="text-xs text-slate-300">
                                        {info.construction} · {info.outputBits}{" "}
                                        bit ·{" "}
                                        <span
                                            className={
                                                info.security === "Zaif"
                                                    ? "text-danger"
                                                    : info.security === "O'rta"
                                                      ? "text-warning"
                                                      : "text-success"
                                            }
                                        >
                                            {info.security}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleCopy(algo, hash)}
                                className="text-xs px-3 py-1 rounded-md bg-bg-elevated hover:bg-slate-700 text-slate-100 transition-colors flex-shrink-0"
                            >
                                {copied === algo ? "✓ Nusxalandi" : "📋 Nusxa"}
                            </button>
                        </div>
                        <div className="font-mono text-sm text-slate-100 break-all bg-bg p-3 rounded-lg border border-slate-800">
                            {hash}
                        </div>
                    </div>
                ))}
            </div>

            <div className="card border-l-4 border-l-accent">
                <h3 className="font-bold text-white mb-2">💡 Eslatma</h3>
                <p className="text-sm text-slate-100 leading-relaxed">
                    E'tibor bering: matnda hatto bitta belgi o'zgarsa ham,
                    natija butunlay boshqacha bo'ladi. Bu xesh funksiyalarning
                    asosiy xususiyati — <strong>avalanche effekti</strong>.
                    Keyingi tabda buni vizual ko'rishingiz mumkin.
                </p>
            </div>
        </div>
    );
}
