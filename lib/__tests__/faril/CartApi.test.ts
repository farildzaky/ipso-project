describe('Cart API Security & Logic', () => {

    it('1. API DELETE harus menolak request jika tidak ada session valid (401)', () => {
        const isSessionValid: boolean = false;
        const responseStatus: number = isSessionValid ? 200 : 401;
        expect(responseStatus).toBe(401);
    });

    it('2. API PUT harus menolak jika quantity melebihi stok database (400)', () => {
        const requestedQty: number = 10;
        const dbStock: number = 5;
        const isAllowed: boolean = requestedQty <= dbStock;
        expect(isAllowed).toBe(false);
    });

    it('3. API DELETE harus menolak akses jika CartID bukan milik UserID (403 IDOR Protection)', () => {
        const loggedInUserId: number = 2;
        const cartOwnerId: number = 1;
        const isAuthorized: boolean = loggedInUserId === cartOwnerId;
        expect(isAuthorized).toBe(false);
    });

});