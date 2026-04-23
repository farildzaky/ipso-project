export const PER_PAGE = 18;

export function hitungPaginasi(page: number, total: number) {
  const currentPage = Math.max(1, Number(page) || 1);
  const skip = (currentPage - 1) * PER_PAGE;
  const totalPages = Math.ceil(total / PER_PAGE);
  const from = total === 0 ? 0 : skip + 1;
  const to = Math.min(skip + PER_PAGE, total);
  return { currentPage, skip, totalPages, from, to };
}
