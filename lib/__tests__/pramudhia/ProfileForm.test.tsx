// __tests__/pramudhia/ProfileForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileForm from "@/app/(main)/profil/_components/ProfileForm";

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: { id: "1", name: "Test User", email: "test@example.com" },
    },
    update: jest.fn(),
  }),
}));

const mockUser = {
  id: 1,
  nama: "Test User",
  email: "test@example.com",
  noTelepon: "08123456789",
  alamat: "Jl. Test No. 1",
  image: null,
};

describe("ProfileForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("menampilkan data user dengan benar", () => {
    render(<ProfileForm user={mockUser} />);
    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("08123456789")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jl. Test No. 1")).toBeInTheDocument();
  });

  it("email tidak bisa diedit (readOnly)", () => {
    render(<ProfileForm user={mockUser} />);
    const emailInput = screen.getByDisplayValue("test@example.com");
    expect(emailInput).toHaveAttribute("readOnly");
  });

  it("menampilkan inisial nama di avatar", () => {
    render(<ProfileForm user={mockUser} />);
    expect(screen.getByText("TU")).toBeInTheDocument();
  });

  it("berhasil update profil dan tampil pesan sukses", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...mockUser, nama: "Nama Baru" }),
    });

    render(<ProfileForm user={mockUser} />);

    const namaInput = screen.getByDisplayValue("Test User");
    await userEvent.clear(namaInput);
    await userEvent.type(namaInput, "Nama Baru");
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText("Profil berhasil disimpan!")).toBeInTheDocument();
    });
  });

  it("menampilkan error ketika update profil gagal", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Gagal menyimpan." }),
    });

    render(<ProfileForm user={mockUser} />);
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText("Gagal menyimpan.")).toBeInTheDocument();
    });
  });

  it("tombol Change Photo ada", () => {
    render(<ProfileForm user={mockUser} />);
    expect(screen.getByRole("button", { name: /change photo/i })).toBeInTheDocument();
  });

  it("menampilkan foto jika user punya image", () => {
    const userWithImage = { ...mockUser, image: "https://example.com/photo.jpg" };
    render(<ProfileForm user={userWithImage} />);
    const img = screen.getByAltText("Test User");
    expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("tombol save disabled saat loading", async () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<ProfileForm user={mockUser} />);
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /menyimpan/i })).toBeDisabled();
    });
  });
});
