import { useState } from "react";
import { computeHash } from "../lib/hashes";

const MD5_COLLISION_1 =
    "d131dd02c5e6eec4693d9a0698aff95c2fcab58712467eab4004583eb8fb7f8955ad340609f4b30283e488832571415a085125e8f7cdc99fd91dbdf280373c5bd8823e3156348f5bae6dacd436c919c6dd53e2b487da03fd02396306d248cda0e99f33420f577ee8ce54b67080a80d1ec69821bcb6a8839396f9652b6ff72a70";
const MD5_COLLISION_2 =
    "d131dd02c5e6eec4693d9a0698aff95c2fcab50712467eab4004583eb8fb7f8955ad340609f4b30283e4888325f1415a085125e8f7cdc99fd91dbd7280373c5bd8823e3156348f5bae6dacd436c919c6dd53e23487da03fd02396306d248cda0e99f33420f577ee8ce54b67080280d1ec69821bcb6a8839396f965ab6ff72a70";

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

function bytesToString(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : "·"))
        .join("");
}

export function CollisionDemo() {
    const [showDiff, setShowDiff] = useState(false);

    const bytes1 = hexToBytes(MD5_COLLISION_1);
    const bytes2 = hexToBytes(MD5_COLLISION_2);
    const str1 = bytesToString(bytes1);
    const str2 = bytesToString(bytes2);

    const md5_1 = computeHash("MD5", str1);
    const md5_2 = computeHash("MD5", str2);
    const sha256_1 = computeHash("SHA-256", str1);
    const sha256_2 = computeHash("SHA-256", str2);
    const sha3_1 = computeHash("SHA3-256", str1);
    const sha3_2 = computeHash("SHA3-256", str2);

    const md5Match = md5_1 === md5_2;

    let diffPositions = 0;
    for (let i = 0; i < bytes1.length; i++) {
        if (bytes1[i] !== bytes2[i]) diffPositions++;
    }

    return (
        <div className="space-y-6">
            <div className="card-elevated border-l-4 border-l-danger">
                <h3 className="text-xl font-bold text-white mb-2">
                    💥 MD5 ning mashhur kolliziyasi
                </h3>
                <p className="text-sm text-slate-100">
                    2004-yilda Xiaoyun Wang va boshqalar tomonidan topilgan.
                    Quyidagi 2 ta turli ma'lumot bir xil MD5 xesh kodga ega!
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="card">
                    <div className="text-xs text-slate-300 mb-2">Ma'lumot 1</div>
                    <div className="font-mono text-xs text-slate-100 bg-bg p-3 rounded-lg border border-slate-800 break-all max-h-32 overflow-y-auto">
                        {MD5_COLLISION_1}
                    </div>
                </div>
                <div className="card">
                    <div className="text-xs text-slate-300 mb-2">Ma'lumot 2</div>
                    <div className="font-mono text-xs text-slate-100 bg-bg p-3 rounded-lg border border-slate-800 break-all max-h-32 overflow-y-auto">
                        {MD5_COLLISION_2}
                    </div>
                </div>
            </div>

            <div className="card text-center">
                <div className="text-sm text-slate-200 mb-2">
                    Ikki ma'lumot orasidagi farq
                </div>
                <div className="text-3xl font-bold text-warning">
                    {diffPositions} bayt
                </div>
                <button
                    onClick={() => setShowDiff(!showDiff)}
                    className="btn-ghost mt-2 text-xs"
                >
                    {showDiff ? "Yashirish" : "Farqni ko'rsatish"}
                </button>
                {showDiff && (
                    <div className="mt-4 font-mono text-xs bg-bg p-3 rounded-lg text-left break-all leading-6">
                        {Array.from(bytes1).map((b, i) => {
                            const diff = b !== bytes2[i];
                            return (
                                <span
                                    key={i}
                                    className={
                                        diff
                                            ? "bg-danger text-white px-0.5 mx-0.5 rounded"
                                            : "text-slate-300 mx-0.5"
                                    }
                                >
                                    {b.toString(16).padStart(2, "0")}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>

            <HashCompare
                title="MD5 — XAVFLI! ❌"
                description="Ikkala turli ma'lumot bir xil xesh kodga ega (KOLLIZIYA)"
                hash1={md5_1}
                hash2={md5_2}
                match={md5Match}
                color="danger"
            />

            <HashCompare
                title="SHA-256 — XAVFSIZ ✅"
                description="Ma'lumotlar farq qilgani sababli xesh kodlar ham farq qiladi"
                hash1={sha256_1}
                hash2={sha256_2}
                match={sha256_1 === sha256_2}
                color="success"
            />

            <HashCompare
                title="SHA3-256 — XAVFSIZ ✅"
                description="Sponge konstruksiyasi MD5 zaifligini bartaraf qiladi"
                hash1={sha3_1}
                hash2={sha3_2}
                match={sha3_1 === sha3_2}
                color="success"
            />

            <div className="card border-l-4 border-l-warning">
                <h3 className="font-bold text-white mb-2">
                    📚 Nima uchun MD5 dan voz kechilgan?
                </h3>
                <ul className="text-sm text-slate-100 space-y-2 list-disc list-inside">
                    <li>
                        <strong>2004:</strong> Wang, Feng, Lai, Yu — MD5
                        kolliziyasi topildi.
                    </li>
                    <li>
                        <strong>2008:</strong> Soxta SSL sertifikatlari
                        yaratildi (RapidSSL, Verisign).
                    </li>
                    <li>
                        <strong>2012:</strong> Flame zararli dasturi MD5
                        kolliziyasidan foydalanib Windows Update'ni aldagan.
                    </li>
                    <li>
                        Hozir MD5 faqat <em>parolsiz</em> xeshlash (checksums)
                        uchun ishlatiladi, kriptografiyada — yo'q.
                    </li>
                </ul>
            </div>
        </div>
    );
}

interface HashCompareProps {
    title: string;
    description: string;
    hash1: string;
    hash2: string;
    match: boolean;
    color: "danger" | "success";
}

function HashCompare({
    title,
    description,
    hash1,
    hash2,
    match,
    color,
}: HashCompareProps) {
    const borderColor =
        color === "danger" ? "border-l-danger" : "border-l-success";
    const textColor = color === "danger" ? "text-danger" : "text-success";

    return (
        <div className={`card border-l-4 ${borderColor}`}>
            <h3 className={`font-bold mb-1 ${textColor}`}>{title}</h3>
            <p className="text-xs text-slate-200 mb-3">{description}</p>
            <div className="space-y-2">
                <div>
                    <div className="text-xs text-slate-300 mb-1">
                        Ma'lumot 1 xeshi
                    </div>
                    <div className="font-mono text-xs text-slate-100 break-all bg-bg p-2 rounded border border-slate-800">
                        {hash1}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-300 mb-1">
                        Ma'lumot 2 xeshi
                    </div>
                    <div className="font-mono text-xs text-slate-100 break-all bg-bg p-2 rounded border border-slate-800">
                        {hash2}
                    </div>
                </div>
                <div
                    className={`text-center font-bold text-sm py-2 rounded ${
                        match
                            ? "bg-danger/20 text-danger"
                            : "bg-success/20 text-success"
                    }`}
                >
                    {match
                        ? "⚠️ XESH KODLAR BIR XIL — KOLLIZIYA!"
                        : "✓ XESH KODLAR FARQ QILADI"}
                </div>
            </div>
        </div>
    );
}
