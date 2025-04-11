import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import { loginService } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import architectsLogo from '../../assets/architectsLogo.png';
import architectsLogo2 from '../../assets/architectsLogo2.png';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginService(email, password);

      console.log("response in loginform: ", response);
      await login(response.user);
      navigate("/recruiter/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-center space-x-4">
          <img
            src={architectsLogo}
            alt="ATS Architects Logo"
            className="h-28 w-28 rounded-full object-cover transform hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              ARchitects
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              ATS Streamlining System
            </p>
          </div>
        </div>

        <div>
          <h2 className="mt-6 text-center text-2xl font-thin text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="space-y-6">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              loadingChildren="Signing in..."
              fullWidth
            >
              Sign in
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/candidate/careers")}
              variant="secondary"
              fullWidth
            >
              View Career Opporturnities
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Register Now
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
