/**
 * CART LIST - BLACK-BOX & WHITE-BOX TESTING
 * Coverage: BB-13, BB-14, BB-15, BB-16, BB-17, WB-16 sampai WB-23
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartItemList from '@/app/(main)/cart/_components/CartList';

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

const mockItems = [
    { id: 1, name: 'Vegetable Salad', price: 220000, stock: 54, qty: 1, image: '', category: 'Vegetables', cartId: 1, productId: 1 },
    { id: 2, name: 'Organic Tomato', price: 45000, stock: 30, qty: 2, image: '', category: 'Vegetables', cartId: 1, productId: 2 },
];

describe('CartItemList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ success: true }),
        });
    });

    describe('Black-Box: Cart Display', () => {
        it('BB-15: Cart kosong → tampil pesan "Cart is empty"', () => {
            render(<CartItemList items={[]} />);
            expect(screen.getByText(/Cart is empty/i)).toBeInTheDocument();
        });

        it('BB-16: Tampilan harga produk dalam format Rupiah', () => {
            render(<CartItemList items={mockItems} />);
            const rupiahTexts = screen.getAllByText(/Rp\s?\d{1,3}(\.\d{3})*/);
            expect(rupiahTexts.length).toBeGreaterThan(0);
        });

        it('BB-15b: Render multiple items dengan nama produk benar', () => {
            render(<CartItemList items={mockItems} />);
            expect(screen.getByText('Vegetable Salad')).toBeInTheDocument();
            expect(screen.getByText('Organic Tomato')).toBeInTheDocument();
        });
    });

    describe('Black-Box: Checkbox Selection', () => {
        it('BB-17: Setiap item punya checkbox untuk select', () => {
            const { container } = render(
                <CartItemList items={mockItems} checkedItems={new Set()} />
            );
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            expect(checkboxes.length).toBeGreaterThanOrEqual(mockItems.length + 1);
        });
    });

    describe('Black-Box: Delete All Button', () => {
        it('BB-13: Delete All disabled tanpa selection', () => {
            render(<CartItemList items={mockItems} checkedItems={new Set()} />);
            expect(screen.getByText(/Delete All/i)).toBeDisabled();
        });

        it('BB-14: Delete All enabled dengan minimal 1 selection', () => {
            render(<CartItemList items={mockItems} checkedItems={new Set([1])} />);
            expect(screen.getByText(/Delete All/i)).not.toBeDisabled();
        });
    });

    describe('White-Box: handleSelectAll Branches', () => {
        it('WB-16: Branch semua sudah terselect → clear semua selection', () => {
            const onCheckedChange = jest.fn();
            render(
                <CartItemList
                    items={mockItems}
                    checkedItems={new Set([1, 2])}
                    onCheckedChange={onCheckedChange}
                />
            );
            fireEvent.click(screen.getByLabelText(/Choose All/i));
            expect(onCheckedChange).toHaveBeenCalledWith(new Set());
        });

        it('WB-17: Branch belum semua terselect → select semua item', () => {
            const onCheckedChange = jest.fn();
            render(
                <CartItemList
                    items={mockItems}
                    checkedItems={new Set([1])}
                    onCheckedChange={onCheckedChange}
                />
            );
            fireEvent.click(screen.getByLabelText(/Choose All/i));
            expect(onCheckedChange).toHaveBeenCalledWith(new Set([1, 2]));
        });
    });

    describe('White-Box: handleToggleCheckbox Branches', () => {
        it('WB-18: Branch item belum di-check → tambah ke set', () => {
            const onCheckedChange = jest.fn();
            render(
                <CartItemList
                    items={mockItems}
                    checkedItems={new Set()}
                    onCheckedChange={onCheckedChange}
                />
            );
            fireEvent.click(screen.getByLabelText(/Select Vegetable Salad/i));
            expect(onCheckedChange).toHaveBeenCalledWith(new Set([1]));
        });

        it('WB-19: Branch item sudah di-check → remove dari set', () => {
            const onCheckedChange = jest.fn();
            render(
                <CartItemList
                    items={mockItems}
                    checkedItems={new Set([1])}
                    onCheckedChange={onCheckedChange}
                />
            );
            fireEvent.click(screen.getByLabelText(/Select Vegetable Salad/i));
            expect(onCheckedChange).toHaveBeenCalledWith(new Set());
        });
    });

    describe('White-Box: handleUpdateQuantity Logic', () => {
        it('WB-20: Branch newQty < 1 → early return, tidak update', async () => {
            render(<CartItemList items={[{ ...mockItems[0], qty: 1 }]} />);
            fireEvent.click(screen.getByLabelText(/Kurangi kuantitas/i));
            await waitFor(() => {
                expect(global.fetch).not.toHaveBeenCalled();
            });
        });

        it('WB-21: Path debounce - klik increment sekali → update qty di state', async () => {
            const onItemsChange = jest.fn();
            render(
                <CartItemList
                    items={[{ ...mockItems[0], qty: 1 }]}
                    onItemsChange={onItemsChange}
                />
            );
            fireEvent.click(screen.getByLabelText(/Tambah kuantitas/i));
            await waitFor(() => {
                expect(onItemsChange).toHaveBeenCalled();
            });
        });
    });

    describe('White-Box: Optimistic Update Logic', () => {
        it('WB-22: Path API success → state permanen, tidak rollback', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            });

            render(<CartItemList items={mockItems} />);
            const deleteButtons = screen.getAllByLabelText(/Hapus dari keranjang/i);
            fireEvent.click(deleteButtons[0]);

            await waitFor(() => {
                expect(screen.queryByText('Vegetable Salad')).not.toBeInTheDocument();
            });
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalled();
            });
        });

        it('WB-23: Path API fail → rollback ke state sebelumnya', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'Server error' }),
            });

            render(<CartItemList items={mockItems} />);
            const deleteButtons = screen.getAllByLabelText(/Hapus dari keranjang/i);
            fireEvent.click(deleteButtons[0]);

            await waitFor(() => {
                expect(screen.getByText('Vegetable Salad')).toBeInTheDocument();
            });
        });
    });
});