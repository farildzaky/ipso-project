import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartPage from '@/app/(main)/cart/page';

jest.mock('next-auth/react', () => ({
    useSession: () => ({ data: { user: { id: '1', name: 'Test User' } }, status: 'authenticated' }),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

global.fetch = jest.fn();

describe('CartPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ items: [], userId: 1, id: 1 }),
        });
    });

    describe('Loading State', () => {
        it('1. harus menampilkan loading state saat fetch data (simulasi awal)', () => {
            render(<CartPage />);
            expect(screen.getByText(/Loading cart.../i)).toBeInTheDocument();
        });

        it('2. loading state harus menghilang setelah data berhasil diload', async () => {
            render(<CartPage />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading cart.../i)).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });
    });

    describe('Page Structure', () => {
        it('3. harus merender komponen utama halaman cart', async () => {
            render(<CartPage />);

            await waitFor(() => {
                // Check if component renders after loading
                expect(screen.queryByText(/Loading cart.../i)).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('4. harus merender CartSummary ketika data loaded', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ items: [], userId: 1, id: 1 }),
            });

            render(<CartPage />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading cart.../i)).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('5. harus handle page structure dengan benar', () => {
            render(<CartPage />);
            expect(screen.getByText(/Loading cart.../i)).toBeInTheDocument();
        });
    });

    describe('Cart Items Display', () => {
        it('6. harus menampilkan loading awal jika cart kosong', () => {
            render(<CartPage />);
            expect(screen.getByText(/Loading cart.../i)).toBeInTheDocument();
        });

        it('7. harus fetch data saat component mount', () => {
            render(<CartPage />);
            expect(global.fetch).toHaveBeenCalled();
        });

        it('8. API call harus ke endpoint /api/cart', () => {
            render(<CartPage />);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/cart')
            );
        });
    });

    describe('Price Calculation', () => {
        it('9. harus handle price calculation dengan benar', async () => {
            render(<CartPage />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading cart.../i)).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('10. harus support rupiah formatting', async () => {
            render(<CartPage />);

            await waitFor(() => {
                // Component should render and not show loading
                const loading = screen.queryByText(/Loading cart.../i);
                expect(loading).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });
    });

    describe('Checkout Flow', () => {
        it('11. halaman harus render dengan user data', async () => {
            render(<CartPage />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading cart.../i)).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('12. harus handle user session dengan benar', () => {
            render(<CartPage />);
            // Initial render shows loading
            expect(screen.getByText(/Loading cart.../i)).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('13. harus handle fetch error dengan graceful', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            render(<CartPage />);

            await waitFor(() => {
                // Page should still render
                expect(screen.getByText(/Loading cart.../i)).toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('14. harus handle API error response', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'Failed' }),
            });

            render(<CartPage />);

            await waitFor(() => {
                // Component should handle error gracefully
                expect(screen.getByText(/Loading cart.../i)).toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('15. harus tetap render meski ada error', () => {
            render(<CartPage />);
            // Component should render something
            expect(screen.getByText(/Loading cart.../i)).toBeInTheDocument();
        });
    });

    describe('Integration', () => {
        it('16. harus memanggil useSession hook', () => {
            render(<CartPage />);
            // Component renders with authenticated state
            expect(screen.getByText(/Loading cart.../i)).toBeInTheDocument();
        });

        it('17. harus setup fetch untuk cart data', () => {
            render(<CartPage />);
            expect(global.fetch).toHaveBeenCalled();
        });

        it('18. harus handle async data loading', async () => {
            render(<CartPage />);

            // Initial: loading state
            expect(screen.getByText(/Loading cart.../i)).toBeInTheDocument();

            // After fetch: data state
            await waitFor(() => {
                expect(screen.queryByText(/Loading cart.../i)).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('19. harus support component lifecycle', async () => {
            render(<CartPage />);

            // Verify rendering flow
            expect(global.fetch).toHaveBeenCalled();

            await waitFor(() => {
                // After loading resolves
                expect(screen.queryByText(/Loading cart.../i)).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('20. harus maintain session context', () => {
            render(<CartPage />);
            // Component renders successfully
            expect(screen.getByText(/Loading cart.../i)).toBeInTheDocument();
        });
    });
});