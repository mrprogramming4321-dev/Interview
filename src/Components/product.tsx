import { useState } from "react";

interface User {
  name: string;
  email: string;
  password: string;
}

interface Product {
  id: number;
  name: string;
}

function Product() {
  const [page, setPage] = useState<"signup" | "login" | "dashboard">("signup");

  const [users, setUsers] = useState<User[]>(
    JSON.parse(localStorage.getItem("users") || "[]"),
  );

  const [products, setProducts] = useState<Product[]>(
    JSON.parse(localStorage.getItem("products") || "[]"),
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [productName, setProductName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    login: "",
    product: "",
  });

  const handleSignup = () => {
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      login: "",
      product: "",
    };

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    } else if (users.some((user) => user.email === email)) {
      errors.email = "Email already exists";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setError(errors);

    if (Object.values(errors).some((value) => value)) {
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      password,
    };

    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setPage("login");
  };

  const handleLogin = () => {
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      login: "",
      product: "",
    };

    if (!email.trim()) {
      errors.email = "Email is required";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    const user = users.find(
      (item) => item.email === email && item.password === password,
    );

    if (!errors.email && !errors.password && !user) {
      errors.login = "Invalid email or password";
    }

    setError(errors);

    if (Object.values(errors).some((value) => value)) {
      return;
    }

    const token = btoa(
      JSON.stringify({
        email: user!.email,
        time: Date.now(),
      }),
    );

    localStorage.setItem("token", token);

    setEmail("");
    setPassword("");
    setPage("dashboard");
  };

  const handleProduct = () => {
    if (!productName.trim()) {
      return;
    }

    if (editId !== null) {
      const updatedProducts = products.map((item) =>
        item.id === editId
          ? {
              ...item,
              name: productName.trim(),
            }
          : item,
      );

      setProducts(updatedProducts);

      localStorage.setItem("products", JSON.stringify(updatedProducts));

      setEditId(null);
      setProductName("");

      return;
    }

    const newProduct = {
      id: Date.now(),
      name: productName.trim(),
    };

    const updatedProducts = [...products, newProduct];

    setProducts(updatedProducts);

    localStorage.setItem("products", JSON.stringify(updatedProducts));

    setProductName("");
  };

  const handleDelete = (id: number) => {
    const updatedProducts = products.filter((item) => item.id !== id);

    setProducts(updatedProducts);

    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setProductName(product.name);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    setPage("login");
    setError({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      login: "",
      product: "",
    });
  };

  if (page === "signup") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Create Account</h1>

          <input
            className="w-full border p-2 mb-3 rounded"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error.name && (
            <p className="text-red-500 text-sm mt-1">{error.name}</p>
          )}

          <input
            className="w-full border p-2 mb-3 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && (
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
          )}

          <input
            className="w-full border p-2 mb-3 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && (
            <p className="text-red-500 text-sm mt-1">{error.password}</p>
          )}

          <input
            className="w-full border p-2 mb-3 rounded"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>
          )}

          <button
            className="w-full bg-black text-white p-2 rounded"
            onClick={handleSignup}
          >
            Create Account
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <button
              className="text-blue-600"
              onClick={() => {
                setError("");
                setPage("login");
              }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (page === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Login</h1>

          <input
            className="w-full border p-2 mb-3 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && (
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
          )}

          <input
            className="w-full border p-2 mb-3 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && (
            <p className="text-red-500 text-sm mt-1">{error.password}</p>
          )}
          {error.login && (
            <p className="text-red-500 text-sm mt-2">{error.login}</p>
          )}

          <button
            className="w-full bg-black text-white p-2 rounded"
            onClick={handleLogin}
          >
            Login
          </button>

          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <button
              className="text-blue-600"
              onClick={() => {
                setError("");
                setPage("signup");
              }}
            >
              Signup
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-3">
            {editId !== null ? "Update Product" : "Add Product"}
          </h2>

          <div className="flex gap-2">
            <input
              className="flex-1 border p-2 rounded"
              placeholder="Product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />

            <button
              className="bg-black text-white px-4 rounded"
              onClick={handleProduct}
            >
              {editId !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {products.length === 0 ? (
            <p className="p-4 text-gray-500">No products found</p>
          ) : (
            products.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 border-b"
              >
                <span>{item.name}</span>

                <div className="flex gap-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
