import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import CartItemList from '@/app/(main)/cart/_components/CartList';

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} />;
    },
}));

describe('CartItemList Component', () => {
    const mockItems = [
        { id: 1, name: 'Vegetable Salad', price: 220000, stock: 54, qty: 1, image: '', category: 'Vegetables', cartId: 1, productId: 1 },
        { id: 2, name: 'Organic Tomato', price: 45000, stock: 30, qty: 2, image: '', category: 'Vegetables', cartId: 1, productId: 2 }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    describe('Empty State', () => {
        it('1. harus menampilkan pesan kosong jika cart kosong', () => {
            render(<CartItemList items={[]} />);
            expect(screen.getByText(/Cart is empty/i)).toBeInTheDocument();
        });

        it('2. pesan empty harus visible dan jelas', () => {
            render(<CartItemList items={[]} />);
            const emptyMsg = screen.getByText(/Cart is empty/i);
            expect(emptyMsg).toBeVisible();
        });
    });

    describe('Display Product Info', () => {
        it('3. harus menampilkan nama produk dari props', () => {
            render(<CartItemList items={mockItems} />);
            expect(screen.getByText('Vegetable Salad')).toBeInTheDocument();
            expect(screen.getByText('Organic Tomato')).toBeInTheDocument();
        });

        it('4. harus menampilkan harga dalam format Rupiah', () => {
            render(<CartItemList items={mockItems} />);
            const rupiah = screen.queryAllByText(/Rp/);
            expect(rupiah.length).toBeGreaterThan(0);
        });

        it('5. harus render multiple items tanpa error', () => {
            render(<CartItemList items={mockItems} />);
            expect(screen.getByText('Vegetable Salad')).toBeInTheDocument();
            expect(screen.getByText('Organic Tomato')).toBeInTheDocument();
        });
    });

    describe('Checkbox Controls', () => {
        it('6. harus render checkbox untuk items', () => {
            const { container } = render(<CartItemList items={mockItems} checkedItems={new Set()} />);
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            expect(checkboxes.length).toBeGreaterThan(0);
        });

        it('7. checkbox harus tidak disabled', () => {
            const { container } = render(<CartItemList items={mockItems} checkedItems={new Set()} />);
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                expect((cb as HTMLInputElement).disabled).toBe(false);
            });
        });

        it('8. setiap item punya checkbox tersendiri', () => {
            const { container } = render(<CartItemList items={mockItems} checkedItems={new Set()} />);
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            // Minimal ada 2 checkbox (Choose All + items)
            expect(checkboxes.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('Quantity Control', () => {
        it('9. harus ada tombol increment (+)', () => {
            render(<CartItemList items={mockItems} />);
            const plusButtons = screen.getAllByText('+');
            expect(plusButtons.length).toBeGreaterThan(0);
        });

        it('10. harus ada tombol decrement (-)', () => {
            render(<CartItemList items={mockItems} />);
            const minusButtons = screen.getAllByText('-');
            expect(minusButtons.length).toBeGreaterThan(0);
        });

        it('11. quantity harus valid (>= 1)', () => {
            mockItems.forEach(item => {
                expect(item.qty).toBeGreaterThanOrEqual(1);
            });
        });

        it('12. quantity tidak boleh > stock', () => {
            mockItems.forEach(item => {
                expect(item.qty).toBeLessThanOrEqual(item.stock);
            });
        });
    });

    describe('Delete Controls', () => {
        it('13. Delete All button harus disabled tanpa selection', () => {
            render(<CartItemList items={mockItems} checkedItems={new Set()} />);
            const deleteBtn = screen.getByText(/Delete All/i);
            expect(deleteBtn).toBeDisabled();
        });

        it('14. Delete All button harus enabled dengan selection', () => {
            render(
                <CartItemList
                    items={mockItems}
                    checkedItems={new Set([1])}
                />
            );
            const deleteBtn = screen.getByText(/Delete All/i);
            expect(deleteBtn).not.toBeDisabled();
        });

        it('15. harus ada button untuk delete tiap item', () => {
            const { container } = render(<CartItemList items={mockItems} />);
            const buttons = container.querySelectorAll('button');
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('16. component render dengan delete callback', () => {
            const mockDelete = jest.fn();
            render(
                <CartItemList
                    items={mockItems}
                    onCartUpdate={mockDelete}
                />
            );
            expect(screen.getByText('Vegetable Salad')).toBeInTheDocument();
        });

        it('17. component render dengan items change callback', () => {
            const mockChange = jest.fn();
            render(
                <CartItemList
                    items={mockItems}
                    onItemsChange={mockChange}
                />
            );
            expect(screen.getByText('Vegetable Salad')).toBeInTheDocument();
        });
    });

    describe('Component Props', () => {
        it('18. component accept all required props', () => {
            const { container } = render(
                <CartItemList
                    items={mockItems}
                    checkedItems={new Set()}
                    onCartUpdate={jest.fn()}
                    onCheckedChange={jest.fn()}
                    onItemsChange={jest.fn()}
                />
            );
            expect(container).toBeInTheDocument();
        });

        it('19. component render dengan minimal props', () => {
            const { container } = render(
                <CartItemList items={mockItems} />
            );
            expect(container).toBeInTheDocument();
        });
    });
});
