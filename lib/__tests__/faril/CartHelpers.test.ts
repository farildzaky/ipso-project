/**
 * CART HELPERS - WHITE-BOX TESTING
 * Coverage: WB-01 sampai WB-11, WB-24 sampai WB-30
 */

import '@testing-library/jest-dom';

// Pure functions under test
const validateQty = (qty: number, stock: number): boolean => {
    if (qty <= 0) return false;
    if (qty > stock) return false;
    return true;
};

const calculateTotal = (items: Array<{ price: number; qty: number }>): number => {
    return items.reduce((acc, item) => acc + item.price * item.qty, 0);
};

const formatRupiah = (number: number): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

type CartItem = { id: number; name: string; price: number; qty: number; category?: string };

const updateCartItem = (items: CartItem[], itemId: number, newQty: number): CartItem[] => {
    return items.map(item => item.id === itemId ? { ...item, qty: newQty } : item);
};

const removeCartItem = (items: CartItem[], itemId: number): CartItem[] => {
    return items.filter(item => item.id !== itemId);
};

const filterItems = (items: CartItem[], searchTerm: string): CartItem[] => {
    const lower = searchTerm.toLowerCase();
    return items.filter(item =>
        item.name.toLowerCase().includes(lower) ||
        (item.category && item.category.toLowerCase().includes(lower))
    );
};

const sortItems = (items: CartItem[], sortBy: string): CartItem[] => {
    return [...items].sort((a, b) => {
        if (sortBy === "Lowest Price") return a.price - b.price;
        if (sortBy === "Newest") return b.id - a.id;
        return 0;
    });
};

const calculateSelectedTotal = (items: CartItem[], checkedIds: Set<number>): number => {
    return items
        .filter(item => checkedIds.has(item.id))
        .reduce((acc, item) => acc + item.price * item.qty, 0);
};

describe('Cart Helper Functions - White-Box Testing', () => {

    describe('Quantity Validation', () => {
        it('WB-01: Branch qty <= 0 → return false', () => {
            expect(validateQty(0, 10)).toBe(false);
            expect(validateQty(-1, 10)).toBe(false);
        });

        it('WB-02: Branch qty > stock → return false', () => {
            expect(validateQty(11, 10)).toBe(false);
            expect(validateQty(100, 10)).toBe(false);
        });

        it('WB-03: Branch 0 < qty <= stock → return true', () => {
            expect(validateQty(1, 10)).toBe(true);
            expect(validateQty(10, 10)).toBe(true);
        });
    });

    describe('Total Price Calculation', () => {
        it('WB-04: Path items kosong → return 0', () => {
            expect(calculateTotal([])).toBe(0);
        });

        it('WB-05: Path single item → return price * qty', () => {
            expect(calculateTotal([{ price: 10000, qty: 3 }])).toBe(30000);
        });

        it('WB-06: Path multiple items → return sum(price * qty)', () => {
            const items = [
                { price: 10000, qty: 2 },
                { price: 5000, qty: 3 },
                { price: 25000, qty: 1 },
            ];
            expect(calculateTotal(items)).toBe(60000);
        });
    });

    describe('Format Rupiah', () => {
        it('WB-07: Path angka standar → format Rupiah benar', () => {
            expect(formatRupiah(220000)).toMatch(/Rp\s?220\.000/);
        });

        it('WB-08: Path nilai 0 → "Rp 0"', () => {
            expect(formatRupiah(0)).toMatch(/Rp\s?0/);
        });
    });

    describe('Cart Item Operations', () => {
        const items: CartItem[] = [
            { id: 1, name: 'Salad', price: 10000, qty: 1 },
            { id: 2, name: 'Tomato', price: 5000, qty: 2 },
        ];

        it('WB-09: updateCartItem - item ada → quantity terupdate', () => {
            const result = updateCartItem(items, 1, 5);
            expect(result[0].qty).toBe(5);
            expect(result[1].qty).toBe(2);
        });

        it('WB-10: updateCartItem - item tidak ada → state tidak berubah', () => {
            const result = updateCartItem(items, 999, 5);
            expect(result).toEqual(items);
        });

        it('WB-11: removeCartItem - hapus item valid → item hilang', () => {
            const result = removeCartItem(items, 1);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(2);
        });
    });

    describe('Filter Logic (Search)', () => {
        const items: CartItem[] = [
            { id: 1, name: 'Vegetable Salad', price: 10000, qty: 1, category: 'Vegetables' },
            { id: 2, name: 'Beef Burger', price: 25000, qty: 1, category: 'Meat' },
            { id: 3, name: 'Tomato Soup', price: 8000, qty: 1, category: 'Vegetables' },
        ];

        it('WB-24: Branch match nama produk → item tampil', () => {
            const result = filterItems(items, 'salad');
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Vegetable Salad');
        });

        it('WB-25: Branch match category → semua item dalam category tampil', () => {
            const result = filterItems(items, 'vegetable');
            expect(result).toHaveLength(2);
        });
    });

    describe('Sort Logic', () => {
        const items: CartItem[] = [
            { id: 3, name: 'C', price: 30000, qty: 1 },
            { id: 1, name: 'A', price: 10000, qty: 1 },
            { id: 2, name: 'B', price: 20000, qty: 1 },
        ];

        it('WB-26: Branch "Lowest Price" → ascending by price', () => {
            const result = sortItems(items, 'Lowest Price');
            expect(result.map(i => i.price)).toEqual([10000, 20000, 30000]);
        });

        it('WB-27: Branch "Newest" → descending by id', () => {
            const result = sortItems(items, 'Newest');
            expect(result.map(i => i.id)).toEqual([3, 2, 1]);
        });

        it('WB-28: Branch "Relevant" (default) → tidak melakukan sort', () => {
            const result = sortItems(items, 'Relevant');
            expect(result.map(i => i.id)).toEqual([3, 1, 2]);
        });
    });

    describe('Selected Total Calculation', () => {
        const items: CartItem[] = [
            { id: 1, name: 'A', price: 10000, qty: 2 },
            { id: 2, name: 'B', price: 5000, qty: 1 },
            { id: 3, name: 'C', price: 30000, qty: 1 },
        ];

        it('WB-29: Path filter by checkedItems → hanya hitung yang di-check', () => {
            const checked = new Set([1, 3]);
            expect(calculateSelectedTotal(items, checked)).toBe(50000);
        });

        it('WB-30: Path tidak ada selection → total = 0', () => {
            expect(calculateSelectedTotal(items, new Set())).toBe(0);
        });
    });
});