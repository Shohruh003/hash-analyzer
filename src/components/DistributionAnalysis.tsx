import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {
    ALL_ALGORITHMS,
    HASH_INFO,
    computeHashBytes,
    HashAlgorithm,
} from "../lib/hashes";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export function DistributionAnalysis() {
    const [algo, setAlgo] = useState<HashAlgorithm>("SHA-256");
    const [samples, setSamples] = useState(1000);

    const analysis = useMemo(() => {
        const buckets = new Array(256).fill(0);
        for (let i = 0; i < samples; i++) {
            const bytes = computeHashBytes(algo, `sample-${i}`);
            for (const b of bytes) buckets[b]++;
        }

        const total = buckets.reduce((a, b) => a + b, 0);
        const mean = total / 256;
        const variance =
            buckets.reduce((s, v) => s + (v - mean) ** 2, 0) / 256;
        const stdDev = Math.sqrt(variance);
        const min = Math.min(...buckets);
        const max = Math.max(...buckets);

        const expected = mean;
        const chiSquared = buckets.reduce(
            (s, observed) => s + (observed - expected) ** 2 / expected,
            0,
        );

        return { buckets, mean, stdDev, min, max, total, chiSquared };
    }, [algo, samples]);

    const chartData = {
        labels: analysis.buckets.map((_, i) => i.toString()),
        datasets: [
            {
                label: "Bayt qiymati uchrash soni",
                data: analysis.buckets,
                backgroundColor: HASH_INFO[algo].color,
                borderRadius: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx: any) =>
                        `Bayt ${ctx.label}: ${ctx.parsed.y} marta`,
                },
            },
        },
        scales: {
            y: {
                ticks: { color: "#94a3b8" },
                grid: { color: "rgba(148, 163, 184, 0.1)" },
                title: {
                    display: true,
                    text: "Uchrash soni",
                    color: "#cbd5e1",
                },
            },
            x: {
                ticks: {
                    color: "#94a3b8",
                    maxTicksLimit: 16,
                },
                grid: { display: false },
                title: {
                    display: true,
                    text: "Bayt qiymati (0-255)",
                    color: "#cbd5e1",
                },
            },
        },
    };

    return (
        <div className="space-y-6">
            <div className="card-elevated">
                <div className="grid md:grid-cols-2 gap-4">
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
                                    {a}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-100 mb-2">
                            Namuna soni
                        </label>
                        <input
                            type="number"
                            value={samples}
                            onChange={(e) =>
                                setSamples(Number(e.target.value))
                            }
                            min={100}
                            max={10000}
                            step={100}
                            className="input-base font-mono"
                        />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-3">
                <div className="card text-center">
                    <div className="text-xs text-slate-300 mb-1">
                        Jami baytlar
                    </div>
                    <div className="text-lg font-mono font-bold text-white">
                        {analysis.total.toLocaleString()}
                    </div>
                </div>
                <div className="card text-center">
                    <div className="text-xs text-slate-300 mb-1">
                        O'rtacha
                    </div>
                    <div className="text-lg font-mono font-bold text-white">
                        {analysis.mean.toFixed(1)}
                    </div>
                </div>
                <div className="card text-center">
                    <div className="text-xs text-slate-300 mb-1">
                        Standart og'ish
                    </div>
                    <div className="text-lg font-mono font-bold text-success">
                        {analysis.stdDev.toFixed(2)}
                    </div>
                </div>
                <div className="card text-center">
                    <div className="text-xs text-slate-300 mb-1">
                        Min - Max
                    </div>
                    <div className="text-lg font-mono font-bold text-white">
                        {analysis.min} - {analysis.max}
                    </div>
                </div>
            </div>

            <div className="card-elevated" style={{ height: "350px" }}>
                <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="card border-l-4 border-l-accent">
                <h3 className="font-bold text-white mb-2">
                    📊 Talqin (Interpretation)
                </h3>
                <p className="text-sm text-slate-100 leading-relaxed">
                    Yaxshi xesh funksiyada chiqish baytlari <strong>0 dan
                    255 gacha</strong> bir tekis (uniformly) taqsimlangan
                    bo'lishi kerak. Histogramma deyarli tekis chiziqqa o'xshasa
                    — funksiya yaxshi. Standart og'ish ({analysis.stdDev.toFixed(2)})
                    qancha kichik bo'lsa, taqsimot shuncha tekis.
                </p>
                <div className="mt-3 text-xs text-slate-200">
                    Chi-kvadrat statistikasi:{" "}
                    <span className="text-accent font-mono">
                        {analysis.chiSquared.toFixed(2)}
                    </span>{" "}
                    (256 baytli taqsimot uchun ideal qiymat ~255 atrofida)
                </div>
            </div>
        </div>
    );
}
