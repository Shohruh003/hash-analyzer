# Hash Analyzer — Xesh Funksiyalar Tahlilchisi

Zamonaviy xesh funksiyalarini qurish usullarini interaktiv tahlil qiluvchi brauzer ilovasi. Bitiruv malakaviy ish (BMI) loyihasi doirasida ishlab chiqilgan.

## Imkoniyatlar

- **🔤 Jonli xeshlash** — 8 ta algoritm (MD5, SHA-1, SHA-256, SHA-512, SHA3-256, SHA3-512, BLAKE2b, BLAKE3) bo'yicha real vaqtda xesh hisoblash
- **❄️ Avalanche effekti** — 1 bitlik o'zgarish natijani qancha o'zgartirishini vizual ko'rsatish
- **🏗️ Qurilish sxemasi** — Merkle-Damgård va Sponge konstruksiyalari interaktiv diagramma
- **⚡ Tezlik benchmarki** — algoritmlarning samaradorligini MB/s'da o'lchash
- **📊 Taqsimot tahlili** — chiqish baytlari taqsimotini histogramma orqali ko'rsatish
- **💥 Kolliziya demosi** — MD5 ning mashhur kolliziyasini ko'rsatish va SHA-256/SHA-3 bilan taqqoslash

## Texnologiyalar

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Chart.js
- @noble/hashes
- js-md5

## Ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda http://localhost:5173 ochiladi.

## Build qilish

```bash
npm run build
```

Natija `dist/` papkasida static fayllar sifatida tayyor bo'ladi.

## Muallif

**Azimov Shoxruxbek Nabijon o'g'li**
TATU Kiberxavfsizlik fakulteti · Kriptologiya kafedrasi · Guruh 070-21 SAXo'
