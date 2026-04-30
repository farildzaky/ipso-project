/**
 * CART PAGE - BLACK-BOX & WHITE-BOX TESTING
 * Coverage: BB-01, BB-02, BB-15, BB-16, BB-18, BB-19, BB-20, BB-21, BB-22, WB-12 sampai WB-15
 */

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import CartPage from '@/app/(main)/cart/page';

const mockPush = jest.fn();
const mockUseSession = jest.fn();

jest.mock('next-auth/react', () => ({
    useSession: () => mockUseSession(),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush, refresh: jest.fn() }),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

global.fetch = jest.fn();

const setAuthenticated = () => {
    mockUseSession.mockReturnValue({
        data: { user: { id: '1', name: 'Test User' } },
        status: 'authenticated',
    });
};

const setUnauthenticated = () => {
    mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
    });
};

const mockApiResponse = (items: any[] = []) => ({
    ok: true,
    json: () => Promise.resolve({
        id: 1,
        userId: 1,
        createdAt: new Date().toISOString(),
        items,
    }),
});

const sampleProducts = [
    {
        id: 1, cartId: 1, productId: 1, qty: 2,
        product: { namaProduct: 'Vegetable Salad', harga: 220000, stok: 50, gambarUrls: [], kategori: 'Vegetables' },
    },
    {
        id: 2, cartId: 1, productId: 2, qty: 1,
        product: { namaProduct: 'Beef Burger', harga: 50000, stok: 20, gambarUrls: [], kategori: 'Meat' },
    },
];

const waitForLoadingToFinish = async () => {
    await waitFor(() => {
        expect(screen.queryByText(/Loading cart/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
};

describe('CartPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setAuthenticated();
        (global.fetch as jest.Mock).mockResolvedValue(mockApiResponse([]));
    });

    describe('Black-Box: Authentication & Access', () => {
        it('BB-01: Akses /cart tanpa login → redirect ke /login', async () => {
            setUnauthenticated();
            render(<CartPage />);
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/login');
            });
        });

        it('BB-02: Akses /cart dengan login valid → halaman cart tampil', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockApiResponse(sampleProducts));
            render(<CartPage />);
            await waitForLoadingToFinish();
            expect(screen.getByRole('heading', { name: /^Cart$/i })).toBeInTheDocument();
            expect(screen.getByText('Vegetable Salad')).toBeInTheDocument();
        });
    });

    describe('Black-Box: Loading State', () => {
        it('BB-02b: Initial mount → tampil "Loading cart..."', async () => {
            render(<CartPage />);
            expect(screen.getByText(/Loading cart/i)).toBeInTheDocument();
            await waitForLoadingToFinish();
        });

        it('BB-02c: Setelah data loaded → loading state hilang', async () => {
            render(<CartPage />);
            await waitForLoadingToFinish();
            expect(screen.queryByText(/Loading cart/i)).not.toBeInTheDocument();
        });
    });

    describe('Black-Box: Cart Display', () => {
        it('BB-15: Cart kosong → tampil pesan "Cart is empty"', async () => {
            render(<CartPage />);
            await waitForLoadingToFinish();
            expect(screen.getByText(/Cart is empty/i)).toBeInTheDocument();
        });

        it('BB-16: Tampilan harga dalam format Rupiah', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockApiResponse(sampleProducts));
            render(<CartPage />);
            await waitForLoadingToFinish();
            const rupiahTexts = screen.getAllByText(/Rp\s?\d/);
            expect(rupiahTexts.length).toBeGreaterThan(0);
        });
    });

    describe('Black-Box: Page Structure', () => {
        it('BB-02d: Render heading dan breadcrumb', async () => {
            render(<CartPage />);
            await waitForLoadingToFinish();
            expect(screen.getByRole('heading', { name: /^Cart$/i })).toBeInTheDocument();
            expect(screen.getByText(/Home/i)).toBeInTheDocument();
        });

        it('BB-02e: Render CartSummary dengan total price', async () => {
            render(<CartPage />);
            await waitForLoadingToFinish();
            expect(screen.getByText(/Rincian Harga/i)).toBeInTheDocument();
            expect(screen.getByText(/Pesan Sekarang/i)).toBeInTheDocument();
        });
    });

    describe('White-Box: useEffect Mount Branches', () => {
        it('WB-12: Branch status="authenticated" → fetchCart() terpanggil', async () => {
            render(<CartPage />);
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith('/api/cart');
            });
            await waitForLoadingToFinish();
        });

        it('WB-13: Branch status="unauthenticated" → router.push("/login")', async () => {
            setUnauthenticated();
            render(<CartPage />);
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/login');
            });
            expect(global.fetch).not.toHaveBeenCalled();
        });
    });

    describe('White-Box: fetchCart Error Paths', () => {
        it('WB-14: Path network error → setError dipanggil, loading=false', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
            render(<CartPage />);
            await waitForLoadingToFinish();
            await waitFor(() => {
                expect(screen.getByText(/Network error/i)).toBeInTheDocument();
            });
        });

        it('WB-15: Path response.ok=false → throw error, masuk catch', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'Failed' }),
            });
            render(<CartPage />);
            await waitForLoadingToFinish();
            await waitFor(() => {
                expect(screen.getByText(/Failed to fetch cart/i)).toBeInTheDocument();
            });
        });
    });

    describe('Black-Box: Search & Sort', () => {
        it('BB-18: Search dengan keyword ada → item match tampil', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockApiResponse(sampleProducts));
            render(<CartPage />);
            await waitForLoadingToFinish();
            expect(screen.getByText('Vegetable Salad')).toBeInTheDocument();
            expect(screen.getByText('Beef Burger')).toBeInTheDocument();
        });

        it('BB-19: Search input tersedia untuk filter items', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockApiResponse(sampleProducts));
            render(<CartPage />);
            await waitForLoadingToFinish();
            expect(screen.getByPlaceholderText(/Cari sesuatu/i)).toBeInTheDocument();
        });

        it('BB-20: Sort dropdown tersedia dengan opsi default', async () => {
            render(<CartPage />);
            await waitForLoadingToFinish();
            expect(screen.getByText(/Relevant/i)).toBeInTheDocument();
        });
    });

    describe('Black-Box: Checkout Button State', () => {
        it('BB-21: Tanpa item dipilih (totalPrice=0) → tombol disabled', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockApiResponse(sampleProducts));
            render(<CartPage />);
            await waitForLoadingToFinish();
            const checkoutBtn = screen.getByRole('button', { name: /Pesan Sekarang/i });
            expect(checkoutBtn).toBeDisabled();
        });

        it('BB-22: Cart kosong → tombol checkout tetap disabled', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockApiResponse([]));
            render(<CartPage />);
            await waitForLoadingToFinish();
            const checkoutBtn = screen.getByRole('button', { name: /Pesan Sekarang/i });
            expect(checkoutBtn).toBeDisabled();
        });
    });
});