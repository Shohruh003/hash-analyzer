import { useState } from "react";

type Mode = "merkle-damgard" | "sponge";

export function ConstructionDiagram() {
    const [mode, setMode] = useState<Mode>("merkle-damgard");

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <button
                    onClick={() => setMode("merkle-damgard")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        mode === "merkle-damgard"
                            ? "bg-accent text-white"
                            : "bg-bg-elevated text-slate-100 hover:bg-slate-700"
                    }`}
                >
                    Merkle-Damgård
                </button>
                <button
                    onClick={() => setMode("sponge")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        mode === "sponge"
                            ? "bg-accent text-white"
                            : "bg-bg-elevated text-slate-100 hover:bg-slate-700"
                    }`}
                >
                    Sponge (SHA-3)
                </button>
            </div>

            {mode === "merkle-damgard" ? <MerkleDamgard /> : <Sponge />}
        </div>
    );
}

function MerkleDamgard() {
    return (
        <>
            <div className="card-elevated">
                <h3 className="text-xl font-bold text-white mb-4">
                    Merkle-Damgård konstruksiyasi
                </h3>

                <svg
                    viewBox="0 0 900 280"
                    className="w-full bg-bg rounded-lg p-4"
                >
                    <defs>
                        <marker
                            id="arr-md"
                            viewBox="0 0 10 10"
                            refX="9"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
                        </marker>
                    </defs>

                    {[0, 1, 2, 3].map((i) => (
                        <g key={i}>
                            <rect
                                x={50 + i * 200}
                                y={120}
                                width={140}
                                height={60}
                                rx={8}
                                fill="#1e40af"
                                stroke="#3b82f6"
                            />
                            <text
                                x={120 + i * 200}
                                y={155}
                                textAnchor="middle"
                                fill="white"
                                fontSize="14"
                                fontWeight="600"
                            >
                                f
                            </text>
                            <text
                                x={120 + i * 200}
                                y={175}
                                textAnchor="middle"
                                fill="#93c5fd"
                                fontSize="10"
                            >
                                kompressiya
                            </text>

                            <rect
                                x={70 + i * 200}
                                y={30}
                                width={100}
                                height={40}
                                rx={6}
                                fill="#10b981"
                                opacity="0.3"
                                stroke="#10b981"
                            />
                            <text
                                x={120 + i * 200}
                                y={55}
                                textAnchor="middle"
                                fill="white"
                                fontSize="13"
                            >
                                M{i + 1}
                            </text>

                            <line
                                x1={120 + i * 200}
                                y1={70}
                                x2={120 + i * 200}
                                y2={115}
                                stroke="#60a5fa"
                                strokeWidth="2"
                                markerEnd="url(#arr-md)"
                            />

                            {i < 3 && (
                                <line
                                    x1={190 + i * 200}
                                    y1={150}
                                    x2={245 + i * 200}
                                    y2={150}
                                    stroke="#60a5fa"
                                    strokeWidth="2"
                                    markerEnd="url(#arr-md)"
                                />
                            )}
                        </g>
                    ))}

                    <text
                        x={30}
                        y={155}
                        textAnchor="end"
                        fill="#fbbf24"
                        fontSize="13"
                        fontWeight="600"
                    >
                        IV
                    </text>
                    <line
                        x1={32}
                        y1={150}
                        x2={45}
                        y2={150}
                        stroke="#fbbf24"
                        strokeWidth="2"
                        markerEnd="url(#arr-md)"
                    />

                    <line
                        x1={850}
                        y1={150}
                        x2={880}
                        y2={150}
                        stroke="#60a5fa"
                        strokeWidth="2"
                        markerEnd="url(#arr-md)"
                    />
                    <text x={845} y={210} fill="#10b981" fontSize="13">
                        H = xesh kod
                    </text>

                    <text
                        x={450}
                        y={250}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="12"
                    >
                        IV → f(M₁) → f(M₂) → f(M₃) → f(M₄) → H
                    </text>
                </svg>
            </div>

            <div className="card">
                <h4 className="font-bold text-white mb-2">
                    Ishlash prinsipi:
                </h4>
                <ol className="text-sm text-slate-100 space-y-2 list-decimal list-inside">
                    <li>
                        Kirish xabari tayinlangan o'lchamdagi bloklarga
                        bo'linadi (M₁, M₂, M₃, ...).
                    </li>
                    <li>
                        Boshlang'ich qiymat (IV) bilan birinchi blok kompressiya
                        funksiyasi <code>f</code>ga uzatiladi.
                    </li>
                    <li>
                        Har bir keyingi qadamda oldingi natija va keyingi blok
                        kompressiya qilinadi.
                    </li>
                    <li>
                        Oxirgi natija — bu xesh kod <code>H</code>.
                    </li>
                </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="card border-l-4 border-l-success">
                    <h4 className="font-bold text-white mb-2">
                        ✅ Afzalliklari
                    </h4>
                    <ul className="text-sm text-slate-100 space-y-1 list-disc list-inside">
                        <li>Sodda va tushunarli</li>
                        <li>Apparatda samarali</li>
                        <li>30+ yil sinovdan o'tgan</li>
                    </ul>
                </div>
                <div className="card border-l-4 border-l-danger">
                    <h4 className="font-bold text-white mb-2">
                        ⚠️ Kamchiliklari
                    </h4>
                    <ul className="text-sm text-slate-100 space-y-1 list-disc list-inside">
                        <li>
                            Length-extension hujum (SHA-1, SHA-2 zaifligi)
                        </li>
                        <li>Kompressiya funksiyasi mustahkamligiga bog'liq</li>
                        <li>Parallel hisoblashga qiyin</li>
                    </ul>
                </div>
            </div>

            <div className="card">
                <h4 className="font-bold text-white mb-2">
                    🔧 Bu konstruksiyani ishlatadigan algoritmlar:
                </h4>
                <div className="flex flex-wrap gap-2">
                    {["MD5", "SHA-1", "SHA-224", "SHA-256", "SHA-384", "SHA-512"].map(
                        (a) => (
                            <span
                                key={a}
                                className="px-3 py-1 bg-bg-elevated rounded-full text-sm text-slate-100 border border-slate-700"
                            >
                                {a}
                            </span>
                        ),
                    )}
                </div>
            </div>
        </>
    );
}

function Sponge() {
    return (
        <>
            <div className="card-elevated">
                <h3 className="text-xl font-bold text-white mb-4">
                    Sponge konstruksiyasi (SHA-3 / Keccak)
                </h3>

                <svg
                    viewBox="0 0 900 320"
                    className="w-full bg-bg rounded-lg p-4"
                >
                    <defs>
                        <marker
                            id="arr-sp"
                            viewBox="0 0 10 10"
                            refX="9"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                        </marker>
                    </defs>

                    <text x={450} y={20} textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="600">
                        Absorbing (yutish) fazasi
                    </text>

                    {[0, 1, 2].map((i) => (
                        <g key={`abs-${i}`}>
                            <rect
                                x={70 + i * 180}
                                y={50}
                                width={80}
                                height={30}
                                rx={4}
                                fill="#3b82f6"
                                opacity="0.3"
                                stroke="#3b82f6"
                            />
                            <text x={110 + i * 180} y={70} textAnchor="middle" fill="white" fontSize="12">
                                M{i + 1}
                            </text>

                            <rect
                                x={70 + i * 180}
                                y={100}
                                width={140}
                                height={40}
                                rx={4}
                                fill="#1e3a8a"
                                stroke="#3b82f6"
                            />
                            <text x={140 + i * 180} y={123} textAnchor="middle" fill="#93c5fd" fontSize="11">
                                rate (r)
                            </text>

                            <rect
                                x={70 + i * 180}
                                y={145}
                                width={140}
                                height={30}
                                rx={4}
                                fill="#7c2d12"
                                stroke="#f97316"
                            />
                            <text x={140 + i * 180} y={163} textAnchor="middle" fill="#fed7aa" fontSize="11">
                                capacity (c)
                            </text>

                            <rect
                                x={70 + i * 180}
                                y={185}
                                width={140}
                                height={40}
                                rx={4}
                                fill="#581c87"
                                stroke="#a855f7"
                            />
                            <text x={140 + i * 180} y={208} textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
                                f
                            </text>

                            <line x1={110 + i * 180} y1={80} x2={110 + i * 180} y2={98} stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-sp)" />

                            {i < 2 && (
                                <line x1={210 + i * 180} y1={205} x2={245 + i * 180} y2={205} stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-sp)" />
                            )}
                        </g>
                    ))}

                    <text x={450} y={250} textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="600">
                        Squeezing (siqib chiqarish) fazasi
                    </text>

                    <rect x={620} y={100} width={100} height={40} rx={4} fill="#1e3a8a" stroke="#3b82f6" />
                    <text x={670} y={123} textAnchor="middle" fill="#93c5fd" fontSize="11">
                        rate
                    </text>
                    <rect x={620} y={145} width={100} height={30} rx={4} fill="#7c2d12" stroke="#f97316" />
                    <text x={670} y={163} textAnchor="middle" fill="#fed7aa" fontSize="11">
                        capacity
                    </text>
                    <rect x={620} y={185} width={100} height={40} rx={4} fill="#581c87" stroke="#a855f7" />
                    <text x={670} y={208} textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
                        f
                    </text>

                    <line x1={720} y1={120} x2={770} y2={120} stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-sp)" />
                    <rect x={770} y={105} width={80} height={30} rx={4} fill="#10b981" opacity="0.3" stroke="#10b981" />
                    <text x={810} y={125} textAnchor="middle" fill="white" fontSize="13">
                        H
                    </text>

                    <text x={450} y={295} textAnchor="middle" fill="#64748b" fontSize="12">
                        Holat = rate (r) + capacity (c) bitlardan iborat
                    </text>
                </svg>
            </div>

            <div className="card">
                <h4 className="font-bold text-white mb-2">
                    Ishlash prinsipi:
                </h4>
                <ol className="text-sm text-slate-100 space-y-2 list-decimal list-inside">
                    <li>
                        <strong>Absorbing fazasi</strong>: Xabar bloklari{" "}
                        <code>rate</code> qismiga XOR qilinib, permutatsiya
                        funksiyasi <code>f</code> orqali aralashtiriladi.
                    </li>
                    <li>
                        <strong>Capacity</strong> qismi tashqaridan ko'rinmaydi
                        — xavfsizlikning asosiy manbai.
                    </li>
                    <li>
                        <strong>Squeezing fazasi</strong>: <code>rate</code>{" "}
                        qismidan natijalarni o'qib chiqamiz.
                    </li>
                    <li>
                        Natija — xesh kod <code>H</code>.
                    </li>
                </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="card border-l-4 border-l-success">
                    <h4 className="font-bold text-white mb-2">
                        ✅ Afzalliklari
                    </h4>
                    <ul className="text-sm text-slate-100 space-y-1 list-disc list-inside">
                        <li>
                            Length-extension hujumga immunitet
                        </li>
                        <li>Yagona funksiya — turli o'lchamdagi natijalar</li>
                        <li>Yangi standart (NIST 2015)</li>
                        <li>Apparatda ham, dasturda ham samarali</li>
                    </ul>
                </div>
                <div className="card border-l-4 border-l-warning">
                    <h4 className="font-bold text-white mb-2">
                        ⚠️ Cheklovlari
                    </h4>
                    <ul className="text-sm text-slate-100 space-y-1 list-disc list-inside">
                        <li>SHA-2 ga qaraganda biroz sekinroq (x86)</li>
                        <li>Yangi — kamroq audit qilingan</li>
                    </ul>
                </div>
            </div>

            <div className="card">
                <h4 className="font-bold text-white mb-2">
                    🔧 Bu konstruksiyani ishlatadigan algoritmlar:
                </h4>
                <div className="flex flex-wrap gap-2">
                    {["SHA3-256", "SHA3-512", "Keccak-256", "SHAKE128", "SHAKE256"].map(
                        (a) => (
                            <span
                                key={a}
                                className="px-3 py-1 bg-bg-elevated rounded-full text-sm text-slate-100 border border-slate-700"
                            >
                                {a}
                            </span>
                        ),
                    )}
                </div>
            </div>
        </>
    );
}
