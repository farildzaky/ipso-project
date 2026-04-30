/**
 * Cart Helper Functions - Whitebox Testing
 * Testing internal logic untuk quantity validation, price calculation, dan cart operations
 */

describe('Cart Helper Functions', () => {

    describe('Quantity Validation', () => {
        const validateQuantity = (qty: number, stock: number): boolean => {
            return qty > 0 && qty <= stock;
        };

        it('WB-01: Quantity harus > 0', () => {
            expect(validateQuantity(0, 10)).toBe(false);
            expect(validateQuantity(-1, 10)).toBe(false);
        });

        it('WB-02: Quantity harus <= stock', () => {
            expect(validateQuantity(5, 10)).toBe(true);
            expect(validateQuantity(10, 10)).toBe(true);
            expect(validateQuantity(11, 10)).toBe(false);
        });

        it('WB-03: Quantity validation dengan berbagai edge cases', () => {
            expect(validateQuantity(1, 1)).toBe(true);
            expect(validateQuantity(100, 100)).toBe(true);
            expect(validateQuantity(101, 100)).toBe(false);
            expect(validateQuantity(0, 100)).toBe(false);
        });
    });

    describe('Price Calculation', () => {
        const calculateTotalPrice = (items: Array<{ price: number; qty: number }>): number => {
            return items.reduce((total, item) => total + (item.price * item.qty), 0);
        };

        it('WB-04: Calculate total price untuk single item', () => {
            const items = [{ price: 100000, qty: 1 }];
            expect(calculateTotalPrice(items)).toBe(100000);
        });

        it('WB-05: Calculate total price untuk multiple items', () => {
            const items = [
                { price: 100000, qty: 1 },
                { price: 50000, qty: 2 }
            ];
            expect(calculateTotalPrice(items)).toBe(200000);
        });

        it('WB-06: Calculate total price dengan empty items', () => {
            expect(calculateTotalPrice([])).toBe(0);
        });

        it('WB-07: Calculate total price dengan large quantities', () => {
            const items = [{ price: 100000, qty: 999 }];
            expect(calculateTotalPrice(items)).toBe(99900000);
        });
    });

    describe('Tax Calculation', () => {
        const calculateTax = (subtotal: number, taxRate: number = 0.1): number => {
            return Math.round(subtotal * taxRate);
        };

        it('WB-08: Tax calculation dengan 10% rate', () => {
            expect(calculateTax(100000, 0.1)).toBe(10000);
            expect(calculateTax(1000000, 0.1)).toBe(100000);
        });

        it('WB-09: Tax calculation dengan custom rate', () => {
            expect(calculateTax(100000, 0.05)).toBe(5000);
            expect(calculateTax(100000, 0.15)).toBe(15000);
        });

        it('WB-10: Tax calculation dengan rounding', () => {
            expect(calculateTax(33333, 0.1)).toBe(3333);
            expect(calculateTax(99999, 0.1)).toBe(10000);
        });
    });

    describe('Shipping Cost Calculation', () => {
        const calculateShippingCost = (distance: number, baseRate: number = 5000): number => {
            // Rp 5000 per km
            return Math.round(distance * baseRate);
        };

        it('WB-11: Shipping cost calculation', () => {
            expect(calculateShippingCost(10)).toBe(50000);
            expect(calculateShippingCost(5)).toBe(25000);
        });

        it('WB-12: Shipping cost dengan custom base rate', () => {
            expect(calculateShippingCost(10, 10000)).toBe(100000);
        });

        it('WB-13: Shipping cost minimum', () => {
            expect(calculateShippingCost(0)).toBe(0);
        });
    });

    describe('Grand Total Calculation', () => {
        const calculateGrandTotal = (subtotal: number, taxRate: number = 0.1, shippingCost: number = 0): number => {
            const tax = Math.round(subtotal * taxRate);
            return subtotal + tax + shippingCost;
        };

        it('WB-14: Calculate grand total with subtotal only', () => {
            expect(calculateGrandTotal(100000, 0.1, 0)).toBe(110000);
        });

        it('WB-15: Calculate grand total dengan shipping', () => {
            expect(calculateGrandTotal(100000, 0.1, 25000)).toBe(135000);
        });

        it('WB-16: Calculate grand total dengan berbagai tax rates', () => {
            expect(calculateGrandTotal(100000, 0.05, 0)).toBe(105000);
            expect(calculateGrandTotal(100000, 0.15, 0)).toBe(115000);
        });
    });

    describe('Cart Item Operations', () => {
        const updateCartItemQty = (items: Array<{ id: number; qty: number }>, itemId: number, newQty: number) => {
            return items.map(item =>
                item.id === itemId ? { ...item, qty: newQty } : item
            );
        };

        it('WB-17: Update cart item quantity', () => {
            const items = [{ id: 1, qty: 1 }, { id: 2, qty: 2 }];
            const updated = updateCartItemQty(items, 1, 5);
            expect(updated[0].qty).toBe(5);
            expect(updated[1].qty).toBe(2);
        });

        it('WB-18: Update non-existent item harus tidak error', () => {
            const items = [{ id: 1, qty: 1 }];
            const updated = updateCartItemQty(items, 999, 5);
            expect(updated.length).toBe(1);
            expect(updated[0].qty).toBe(1);
        });

        const removeCartItem = (items: Array<{ id: number }>, itemId: number) => {
            return items.filter(item => item.id !== itemId);
        };

        it('WB-19: Remove cart item', () => {
            const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const updated = removeCartItem(items, 2);
            expect(updated.length).toBe(2);
            expect(updated.find(item => item.id === 2)).toBeUndefined();
        });

        it('WB-20: Remove non-existent item harus tidak error', () => {
            const items = [{ id: 1 }, { id: 2 }];
            const updated = removeCartItem(items, 999);
            expect(updated.length).toBe(2);
        });
    });

    describe('Format Rupiah', () => {
        const formatRupiah = (number: number): string => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(number);
        };

        it('WB-21: Format single digit number', () => {
            const result = formatRupiah(5);
            expect(result).toContain('Rp');
        });

        it('WB-22: Format thousands', () => {
            const result = formatRupiah(100000);
            expect(result).toContain('Rp');
            expect(result).toContain('100');
        });

        it('WB-23: Format large numbers', () => {
            const result = formatRupiah(1000000);
            expect(result).toContain('Rp');
            expect(result).toContain('1');
        });

        it('WB-24: Format zero value', () => {
            const result = formatRupiah(0);
            expect(result).toContain('Rp');
        });
    });

    describe('Cart Validation', () => {
        interface CartItem {
            id: number;
            productId: number;
            qty: number;
            price: number;
            stock: number;
        }

        const validateCartItems = (items: CartItem[]): { valid: boolean; errors: string[] } => {
            const errors: string[] = [];

            items.forEach((item, index) => {
                if (item.qty <= 0) {
                    errors.push(`Item ${index + 1}: Quantity harus > 0`);
                }
                if (item.qty > item.stock) {
                    errors.push(`Item ${index + 1}: Quantity melebihi stok`);
                }
                if (item.price <= 0) {
                    errors.push(`Item ${index + 1}: Harga tidak valid`);
                }
            });

            return {
                valid: errors.length === 0,
                errors
            };
        };

        it('WB-25: Validate empty cart', () => {
            const result = validateCartItems([]);
            expect(result.valid).toBe(true);
            expect(result.errors.length).toBe(0);
        });

        it('WB-26: Validate valid cart items', () => {
            const items = [
                { id: 1, productId: 1, qty: 1, price: 100000, stock: 10 },
                { id: 2, productId: 2, qty: 2, price: 50000, stock: 20 }
            ];
            const result = validateCartItems(items);
            expect(result.valid).toBe(true);
        });

        it('WB-27: Validate invalid quantity (zero)', () => {
            const items = [
                { id: 1, productId: 1, qty: 0, price: 100000, stock: 10 }
            ];
            const result = validateCartItems(items);
            expect(result.valid).toBe(false);
            expect(result.errors[0]).toContain('Quantity harus > 0');
        });

        it('WB-28: Validate quantity exceeds stock', () => {
            const items = [
                { id: 1, productId: 1, qty: 20, price: 100000, stock: 10 }
            ];
            const result = validateCartItems(items);
            expect(result.valid).toBe(false);
            expect(result.errors[0]).toContain('melebihi stok');
        });

        it('WB-29: Validate invalid price', () => {
            const items = [
                { id: 1, productId: 1, qty: 1, price: 0, stock: 10 }
            ];
            const result = validateCartItems(items);
            expect(result.valid).toBe(false);
            expect(result.errors[0]).toContain('Harga tidak valid');
        });

        it('WB-30: Validate multiple errors', () => {
            const items = [
                { id: 1, productId: 1, qty: 0, price: -100, stock: 10 }
            ];
            const result = validateCartItems(items);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(1);
        });
    });

});