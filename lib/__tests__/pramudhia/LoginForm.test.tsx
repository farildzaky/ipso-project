// __tests__/pramudhia/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/app/(auth)/_components/auth/LoginForm";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
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

import { signIn } from "next-auth/react";

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ user: { role: "customer" } }),
    });
  });

  it("menampilkan form login dengan benar", () => {
    render(<LoginForm />);
    expect(screen.getByText("Welcome Back!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("menampilkan link ke halaman register", () => {
    render(<LoginForm />);
    const signUpLink = screen.getByRole("link", { name: /sign up/i });
    expect(signUpLink).toHaveAttribute("href", "/register");
  });

  it("menampilkan error ketika login gagal", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: "CredentialsSignin" });
    render(<LoginForm />);

    await userEvent.type(screen.getByPlaceholderText("Enter your email"), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText("Enter your password"), "wrongpassword");
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Email atau password salah.")).toBeInTheDocument();
    });
  });

  it("bisa toggle show/hide password", async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    expect(passwordInput).toHaveAttribute("type", "password");

    const buttons = screen.getAllByRole("button");
    const toggleBtn = buttons.find(btn => !btn.textContent?.match(/sign in/i));
    if (toggleBtn) {
      fireEvent.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "text");
      fireEvent.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "password");
    }
  });

  it("memanggil signIn dengan kredensial yang benar", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    render(<LoginForm />);

    await userEvent.type(screen.getByPlaceholderText("Enter your email"), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText("Enter your password"), "password123");
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      });
    });
  });

  it("tombol submit disabled saat loading", async () => {
    (signIn as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<LoginForm />);

    await userEvent.type(screen.getByPlaceholderText("Enter your email"), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText("Enter your password"), "password123");
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /masuk/i })).toBeDisabled();
    });
  });
});
