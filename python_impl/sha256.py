#!/usr/bin/env python3
"""
SHA-256 algoritmining noldan amalga oshirilishi (educational implementation)

Mualliflik: Azimov Shoxruxbek Nabijon o'g'li
Diplom loyihasi: "Zamonaviy xesh funksiyalarini qurish usullarining tahlili"
Toshkent Axborot Texnologiyalari Universiteti, Kiberxavfsizlik fakulteti

Ushbu modul SHA-256 algoritmini RFC 6234 va FIPS 180-4 standartlariga
muvofiq sof Python tilida, hech qanday kriptografik kutubxonadan
foydalanmasdan amalga oshiradi. Asosiy maqsad — algoritmning ichki
ishlash mexanizmini namoyish qilish va o'rganish.
"""

import sys
import time
import argparse
import hashlib


# ============================================================
# SHA-256 KONSTANTALARI (FIPS 180-4 bo'yicha)
# ============================================================

# H0..H7 — boshlang'ich xesh qiymatlar.
# Bu qiymatlar dastlabki 8 ta tub sonning (2,3,5,7,11,13,17,19)
# kvadrat ildizlarining kasr qismidan dastlabki 32 bitidir.
INITIAL_HASH = [
    0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
    0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19,
]

# K[0..63] — raund konstantalari.
# Dastlabki 64 ta tub sonning kub ildizlarining kasr qismidan
# dastlabki 32 bitidir.
ROUND_CONSTANTS = [
    0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
    0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
    0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
    0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
    0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
    0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
    0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
    0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
    0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
    0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
    0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
    0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
    0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
    0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
    0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
    0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2,
]


# ============================================================
# YORDAMCHI BIT OPERATSIYALARI
# ============================================================

MASK32 = 0xFFFFFFFF  # 32 bitli qiymat uchun maska


def rotr(x: int, n: int) -> int:
    """32-bit so'zni o'ngga aylantiruvchi rotatsiya (right rotate)."""
    return ((x >> n) | (x << (32 - n))) & MASK32


def shr(x: int, n: int) -> int:
    """32-bit so'zni o'ngga siljitish (right shift)."""
    return (x >> n) & MASK32


def ch(x: int, y: int, z: int) -> int:
    """Choice (tanlash) funksiyasi: x ga bog'liq holda y yoki z ni tanlaydi."""
    return (x & y) ^ ((~x) & z) & MASK32


def maj(x: int, y: int, z: int) -> int:
    """Majority (ko'pchilik) funksiyasi: uchta bit orasidagi ko'pchilik."""
    return (x & y) ^ (x & z) ^ (y & z)


def big_sigma0(x: int) -> int:
    """Katta sigma 0 — ichki holatning a qismini aralashtiradi."""
    return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22)


def big_sigma1(x: int) -> int:
    """Katta sigma 1 — ichki holatning e qismini aralashtiradi."""
    return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25)


def small_sigma0(x: int) -> int:
    """Kichik sigma 0 — xabar jadvalini kengaytirish uchun."""
    return rotr(x, 7) ^ rotr(x, 18) ^ shr(x, 3)


def small_sigma1(x: int) -> int:
    """Kichik sigma 1 — xabar jadvalini kengaytirish uchun."""
    return rotr(x, 17) ^ rotr(x, 19) ^ shr(x, 10)


# ============================================================
# ASOSIY SHA-256 FUNKSIYASI
# ============================================================


def padding(message: bytes) -> bytes:
    """Xabarni 512-bit (64-bayt) bloklarga to'g'rilash.

    To'ldirish qoidasi (FIPS 180-4 bo'yicha):
      1. Xabar oxiriga bitta '1' biti (bayt 0x80) qo'shiladi.
      2. So'ngra '0' bitlar qo'shiladi, oxirgi 64 bit qoldiriladi.
      3. Oxirgi 64 bit — asl xabarning bit uzunligini saqlaydi.
    """
    original_bit_len = len(message) * 8

    # 1-qadam: '1' bitini qo'shish
    padded = message + b'\x80'

    # 2-qadam: blok 56 baytga (448 bit) yetguncha '0' qo'shish
    # (64 - 8 = 56, chunki oxirgi 8 bayt uzunlik uchun)
    while len(padded) % 64 != 56:
        padded += b'\x00'

    # 3-qadam: asl xabar uzunligini 64-bit big-endian formatda qo'shish
    padded += original_bit_len.to_bytes(8, 'big')

    return padded


def compress(state: list, block: bytes) -> list:
    """Bitta 512-bitli blok uchun kompressiya funksiyasi.

    Bu SHA-256 ning eng muhim qismi — har bir blok mavjud holatni
    aralashtirib yangi holat hosil qiladi (64 raund).
    """
    # 1-qadam: Xabar jadvalini hosil qilish (W[0..63])
    W = []
    # Birinchi 16 ta so'z — bevosita blokdan
    for i in range(16):
        word = int.from_bytes(block[i * 4:(i + 1) * 4], 'big')
        W.append(word)

    # Qolgan 48 ta so'z — kengaytirish formulasi orqali
    for i in range(16, 64):
        s0 = small_sigma0(W[i - 15])
        s1 = small_sigma1(W[i - 2])
        new_word = (W[i - 16] + s0 + W[i - 7] + s1) & MASK32
        W.append(new_word)

    # 2-qadam: Ish o'zgaruvchilarini holatdan olish
    a, b, c, d, e, f, g, h = state

    # 3-qadam: 64 raundlik aralashtirish
    for i in range(64):
        T1 = (h + big_sigma1(e) + ch(e, f, g) + ROUND_CONSTANTS[i] + W[i]) & MASK32
        T2 = (big_sigma0(a) + maj(a, b, c)) & MASK32

        h = g
        g = f
        f = e
        e = (d + T1) & MASK32
        d = c
        c = b
        b = a
        a = (T1 + T2) & MASK32

    # 4-qadam: Yangi holatni hisoblash (eski + ish o'zgaruvchilari)
    new_state = [
        (state[0] + a) & MASK32,
        (state[1] + b) & MASK32,
        (state[2] + c) & MASK32,
        (state[3] + d) & MASK32,
        (state[4] + e) & MASK32,
        (state[5] + f) & MASK32,
        (state[6] + g) & MASK32,
        (state[7] + h) & MASK32,
    ]
    return new_state


def sha256(message: bytes) -> str:
    """SHA-256 xesh qiymatini hisoblash (asosiy funksiya).

    Kirish: bayt ketma-ketligi (bytes)
    Chiqish: 64 belgili heks string (256 bit = 32 bayt = 64 hex)
    """
    # 1-qadam: Xabarni to'g'rilash
    padded = padding(message)

    # 2-qadam: Boshlang'ich holatni belgilash
    state = INITIAL_HASH.copy()

    # 3-qadam: Har bir 512-bitli (64 baytli) blokni qayta ishlash
    for i in range(0, len(padded), 64):
        block = padded[i:i + 64]
        state = compress(state, block)

    # 4-qadam: Yakuniy holatni 64-belgili hex string ga aylantirish
    return ''.join(f'{h:08x}' for h in state)


# ============================================================
# CLI (COMMAND-LINE INTERFACE)
# ============================================================


def verify_against_hashlib(message: bytes) -> bool:
    """Bizning implementatsiyamizni Python ning hashlib bilan solishtirish."""
    ours = sha256(message)
    theirs = hashlib.sha256(message).hexdigest()
    return ours == theirs


def benchmark(size_kb: int = 100, iterations: int = 10):
    """Tezlik benchmarki — bizning va hashlib implementatsiyasi solishtirish."""
    data = b'a' * (size_kb * 1024)
    total_mb = (size_kb * iterations) / 1024

    print(f"\n=== BENCHMARK ({size_kb} KB x {iterations} marta) ===")

    # Bizning implementatsiya
    start = time.time()
    for _ in range(iterations):
        sha256(data)
    ours_time = time.time() - start
    ours_speed = total_mb / ours_time if ours_time > 0 else 0
    print(f"Bizning Python:  {ours_time:.2f} sek  ({ours_speed:.2f} MB/s)")

    # Hashlib
    start = time.time()
    for _ in range(iterations):
        hashlib.sha256(data).hexdigest()
    theirs_time = time.time() - start
    theirs_speed = total_mb / theirs_time if theirs_time > 0 else 0
    print(f"Hashlib (C):     {theirs_time:.2f} sek  ({theirs_speed:.2f} MB/s)")

    ratio = theirs_speed / ours_speed if ours_speed > 0 else 0
    print(f"Nisbat: hashlib bizdan {ratio:.0f}x marta tezroq")


def run_tests():
    """Test vektorlari bo'yicha tekshirish (RFC 6234 dan)."""
    test_vectors = [
        (b'', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
        (b'abc', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'),
        (b'Salom, dunyo!', None),  # hashlib bilan solishtirish
        (b'a' * 1000000, None),  # 1 MB
    ]

    print("\n=== TEST VEKTORLARI ===")
    all_pass = True
    for msg, expected in test_vectors:
        result = sha256(msg)
        if expected is None:
            expected = hashlib.sha256(msg).hexdigest()
            method = "hashlib bilan tekshirildi"
        else:
            method = "RFC 6234 vektoridan"

        status = "[OK]" if result == expected else "[FAIL]"
        if result != expected:
            all_pass = False

        preview = msg[:30] + (b'...' if len(msg) > 30 else b'')
        print(f"{status} {method}")
        print(f"   Kirish: {preview!r} ({len(msg)} bayt)")
        print(f"   Olindi:  {result}")
        if result != expected:
            print(f"   Kerak:   {expected}")
        print()

    if all_pass:
        print("BARCHA TESTLAR MUVAFFAQIYATLI O'TDI!")
    else:
        print("BA'ZI TESTLAR MUVAFFAQIYATSIZ!")
    return all_pass


def main():
    parser = argparse.ArgumentParser(
        description='SHA-256 algoritmining sof Python implementatsiyasi (diplom loyihasi)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Misollar:
  python sha256.py "Salom, dunyo!"
  python sha256.py --file myfile.txt
  python sha256.py --test
  python sha256.py --benchmark 100
  python sha256.py --verify "test matn"
'''
    )
    parser.add_argument('text', nargs='?', help='Xeshlanadigan matn')
    parser.add_argument('--file', '-f', help='Faylni xeshlash')
    parser.add_argument('--test', '-t', action='store_true',
                        help='Test vektorlari bo\'yicha tekshirish')
    parser.add_argument('--benchmark', '-b', type=int, nargs='?', const=100,
                        help='Tezlik benchmark (KB hajmi, default 100)')
    parser.add_argument('--verify', '-v', action='store_true',
                        help='Natijani hashlib bilan tekshirish')

    args = parser.parse_args()

    # Test rejimi
    if args.test:
        success = run_tests()
        sys.exit(0 if success else 1)

    # Benchmark rejimi
    if args.benchmark:
        benchmark(args.benchmark)
        sys.exit(0)

    # Fayl yoki matn xeshlash
    if args.file:
        with open(args.file, 'rb') as f:
            data = f.read()
        print(f"Fayl: {args.file} ({len(data)} bayt)")
    elif args.text:
        data = args.text.encode('utf-8')
        print(f"Matn: {args.text!r} ({len(data)} bayt)")
    else:
        # STDIN dan o'qish
        if sys.stdin.isatty():
            parser.print_help()
            sys.exit(1)
        data = sys.stdin.buffer.read()
        print(f"STDIN: {len(data)} bayt")

    # Xeshlash
    start = time.time()
    result = sha256(data)
    elapsed = time.time() - start

    print(f"SHA-256: {result}")
    print(f"Vaqt:    {elapsed * 1000:.2f} ms")

    # Hashlib bilan solishtirish
    if args.verify:
        expected = hashlib.sha256(data).hexdigest()
        if result == expected:
            print("Tekshiruv: [OK] MOS KELDI (hashlib bilan bir xil)")
        else:
            print("Tekshiruv: [FAIL] MOS KELMADI!")
            print(f"   Hashlib: {expected}")
            sys.exit(1)


if __name__ == '__main__':
    main()
