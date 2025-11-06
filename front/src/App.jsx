import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logout } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(loginSuccess({ user: { name: "Yug Patel" }, token: "12345" }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Redux + Tailwind + Vite 🚀
      </h1>

      {!isAuthenticated ? (
        <button
          onClick={handleLogin}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Login
        </button>
      ) : (
        <>
          <p className="text-gray-700 mt-4">Welcome, {user.name}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition mt-4"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default App;
