// __tests__/pramudhia/RegisterForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

async function fillForm() {
  await userEvent.type(screen.getByPlaceholderText("Enter your full name"), "Test User");
  await userEvent.type(screen.getByPlaceholderText("Enter your email"), "test@example.com");
  await userEvent.type(screen.getByPlaceholderText("Enter your password"), "password123");

  // Isi noTelepon jika ada
  const teleponInput = screen.queryByPlaceholderText(/08123456789/i);
  if (teleponInput) await userEvent.type(teleponInput, "08123456789");

  // Isi alamat jika ada
  const alamatInput = screen.queryByPlaceholderText(/alamat/i);
  if (alamatInput) await userEvent.type(alamatInput, "Jl. Test No. 1");
}

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("menampilkan form register dengan benar", () => {
    render(<RegisterForm />);
    expect(screen.getByText("Get Started Now!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your full name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("menampilkan link ke halaman login", () => {
    render(<RegisterForm />);
    const signInLink = screen.getByRole("link", { name: /sign in/i });
    expect(signInLink).toHaveAttribute("href", "/login");
  });

  it("menampilkan error jika belum centang terms", async () => {
    render(<RegisterForm />);
    await fillForm();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
     expect(screen.getByText("Kamu harus menyetujui Terms & Privacy.")).toBeInTheDocument();
    });
  });

  it("memanggil API register dengan data yang benar", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, nama: "Test User", email: "test@example.com" }),
    });

    render(<RegisterForm />);
    await fillForm();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
  "/api/register",
  expect.objectContaining({ method: "POST" })
);
    });
  });

  it("menampilkan error dari server ketika email sudah terdaftar", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Email sudah terdaftar." }),
    });

    render(<RegisterForm />);
    await fillForm();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Email sudah terdaftar.")).toBeInTheDocument();
    });
  });

  it("bisa toggle show/hide password", async () => {
    render(<RegisterForm />);
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    expect(passwordInput).toHaveAttribute("type", "password");

    const buttons = screen.getAllByRole("button");
    const toggleBtn = buttons.find(btn => !btn.textContent?.match(/create account/i));
    if (toggleBtn) {
      fireEvent.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "text");
    }
  });
});