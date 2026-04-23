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
        { id: 1, name: 'Vegetable Salad', price: 220000, stock: 54, qty: 1, image: '', category: 'Vegetables' }
    ];

    it('1. harus menampilkan daftar item kosong jika cart kosong', () => {
        render(<CartItemList items={[]} />);
        expect(screen.getByText(/Cart is empty/i)).toBeInTheDocument();
    });

    it('2. harus merender nama produk yang dikirimkan melalui props', () => {
        render(<CartItemList items={mockItems} />);
        expect(screen.getByText('Vegetable Salad')).toBeInTheDocument();
    });

    it('3. harus merender tombol Delete All dalam keadaan disabled jika tidak ada yang dicentang', () => {
        render(<CartItemList items={mockItems} checkedItems={new Set()} />);
        const deleteBtn = screen.getByText(/Delete All/i);
        expect(deleteBtn).toBeDisabled();
    });

    it('4. harus bisa menekan tombol tambah (+) kuantitas tanpa error', () => {
        render(<CartItemList items={mockItems} />);
        const plusButton = screen.getByText('+');
        expect(plusButton).toBeInTheDocument();
        expect(plusButton).not.toBeDisabled();
    });

    it('5. checkbox "Choose All" dapat berinteraksi (bukan readonly)', () => {
        render(<CartItemList items={mockItems} />);
        const chooseAllCheckbox = screen.getByLabelText(/Choose All/i);
        expect(chooseAllCheckbox).toBeInTheDocument();
        expect(chooseAllCheckbox).not.toBeDisabled();
    });
});