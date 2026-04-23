import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import CartPage from '@/app/(main)/cart/page';

jest.mock('next-auth/react', () => ({
    useSession: () => ({ data: { user: { id: '1', name: 'Test User' } }, status: 'authenticated' }),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
    })
) as jest.Mock;

describe('CartPage Component', () => {

    it('1. harus menampilkan loading state saat fetch data (simulasi awal)', () => {
        render(<CartPage />);
        expect(screen.getByText(/Loading cart.../i)).toBeInTheDocument();
    });

    it('2. harus merender judul halaman Cart dengan benar setelah loading', async () => {
        render(<CartPage />);

        await waitFor(() => {
            const heading = screen.getByRole('heading', { name: /Cart/i, level: 1 });
            expect(heading).toBeInTheDocument();
        });
    });

    it('3. harus merender CartSummary (Rincian Harga)', async () => {
        render(<CartPage />);

        await waitFor(() => {
            expect(screen.getByText(/Rincian Harga/i)).toBeInTheDocument();
        });
    });

    it('4. harus menampilkan CartToolbar (SearchBar)', async () => {
        render(<CartPage />);

        await waitFor(() => {
            expect(screen.getByText(/Relevant/i)).toBeInTheDocument();
        });
    });

});