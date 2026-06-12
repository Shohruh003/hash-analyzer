# SHA-256 algoritmining sof Python implementatsiyasi

Ushbu modul SHA-256 algoritmini **noldan**, FIPS 180-4 va RFC 6234 standartlariga muvofiq sof Python tilida amalga oshiradi. Hech qanday kriptografik kutubxonadan (hashlib, cryptography va h.k.) foydalanilmagan — faqat algoritmning bit operatsiyalari (XOR, AND, OR, NOT, ROTATE, SHIFT) ishlatilgan.

## Maqsad

Bu loyiha **diplom loyihasining 2.4-§** doirasida algoritmning ichki ishlash mexanizmini namoyish qilish va o'rganish maqsadida yaratilgan. Asosiy interaktiv vosita (`hash-analyzer`) TypeScript'da yozilgan bo'lsa, bu Python implementatsiyasi educational maqsadlarda algoritm tuzilishini aniq ko'rsatadi.

## Strukturasi

Fayl 4 ta asosiy qismdan iborat:

1. **Konstantalar** — Boshlang'ich xesh qiymatlar (H0..H7) va raund konstantalari (K0..K63)
2. **Bit operatsiyalari** — `rotr`, `shr`, `ch`, `maj`, `sigma` funksiyalari
3. **Asosiy algoritm** — `padding`, `compress`, `sha256` funksiyalari
4. **CLI interfeysi** — komand qatori orqali foydalanish

## Foydalanish

### Matnni xeshlash

```bash
python sha256.py "Salom, dunyo!"
```

### Faylni xeshlash

```bash
python sha256.py --file myfile.txt
```

### Natijani `hashlib` bilan tekshirish

```bash
python sha256.py "matn" --verify
```

### Test vektorlari bo'yicha sinash

```bash
python sha256.py --test
```

Bu RFC 6234 dagi standart test vektorlarini sinaydi:
- Bo'sh xabar
- "abc"
- 1 MB ma'lumot

### Tezlik benchmarki

```bash
python sha256.py --benchmark 100
```

Bizning sof Python implementatsiyani Python ning ichki `hashlib` (C tilida yozilgan) bilan solishtiradi.

## Test natijalari

```
=== TEST VEKTORLARI ===
[OK] RFC 6234 vektoridan
   Kirish: b'' (0 bayt)
   Olindi: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

[OK] RFC 6234 vektoridan
   Kirish: b'abc' (3 bayt)
   Olindi: ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad

[OK] hashlib bilan tekshirildi
   Kirish: b'Salom, dunyo!' (13 bayt)
   Olindi: c11e5068cb7c996b2a7926817d7e9fae330f73e49a47e660fa8a461c9dde1345

BARCHA TESTLAR MUVAFFAQIYATLI O'TDI!
```

## Tezlik solishtirilishi

| Implementatsiya | Tezlik (MB/s) |
|---|---|
| Bizning sof Python | ~0.4 MB/s |
| Python `hashlib` (C asosida) | ~1400 MB/s |

Pure Python `hashlib`'dan ~3000 marta sekinroq, chunki:
- Python interpretator dinamik tilda har bir bit operatsiyani sekin bajaradi
- `hashlib` C tilida yozilgan va apparat akselerator (SHA-NI) ishlatadi
- Lekin bizning implementatsiya **algoritmning tushuncha namoyishi** uchun yaratilgan, samaradorlik uchun emas

## Algoritm bosqichlari

SHA-256 quyidagi bosqichlardan iborat:

1. **Padding** — xabarni 512-bit (64-bayt) bloklarga to'g'rilash
2. **Boshlang'ich holat** — 8 ta 32-bitli registr (H0-H7)
3. **Har bir blok uchun:**
   - Xabar jadvalini (W[0..63]) hosil qilish
   - 64 raundlik kompressiya (Ch, Maj, Sigma funksiyalari bilan)
   - Yangi holatni hisoblash
4. **Yakuniy natija** — 8 registrning 64 belgili hex stringi

## Mualliflik

**Azimov Shoxruxbek Nabijon o'g'li**
TATU Kiberxavfsizlik fakulteti · Kriptologiya kafedrasi · Guruh 070-21 SAXo'

Diplom loyihasi: "Zamonaviy xesh funksiyalarini qurish usullarining tahlili"
