import { createSignal } from 'solid-js';
import './login.css';
import { useNavigate } from '@solidjs/router';

const loginUser = async (emailOrPhone, password) => {
  const response = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: emailOrPhone, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

const resetPassword = async (email, token, newPassword) => {
  const response = await fetch('http://localhost:8080/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, token, newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Password reset failed');
  }

  return response.json();
};

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [isForgotPassword, setIsForgotPassword] = createSignal(false);
  const [resetEmail, setResetEmail] = createSignal('');
  const [resetToken, setResetToken] = createSignal('');
  const [newPassword, setNewPassword] = createSignal('');
  const [resetError, setResetError] = createSignal('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(emailOrPhone(), password());
      localStorage.setItem('authToken', data.token);
      navigate('/grid');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    
    try {
      const response = await fetch('http://localhost:8080/forgot_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail(), token: resetToken(), new_password: newPassword() }),
      });
    
      if (!response.ok) {
        const errorText = await response.text();
        setResetError(errorText || 'Password reset failed');
        return;
      }
    
      const responseData = await response.json();
      console.log(responseData);
      setIsForgotPassword(false); // Tutup popup setelah berhasil reset
    } catch (err) {
      setResetError(err.message || 'An error occurred');
    }
  };
  

  return (
    <div class="login-container">
      <div class="background-image"></div>
      <div class="login-box">
        <h2>Sign In</h2>
        <p>Keep it all together and you'll be fine</p>
        {error() && <p class="error-message">{error()}</p>}
        <form onSubmit={handleLogin}>
          <div class="input-group">
            <input
              type="text"
              placeholder="Email or Phone"
              required
              onInput={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>
          <div class="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              onInput={(e) => setPassword(e.target.value)}
            />
          </div>
          <div class="forgot-password">
            <a href="#" onClick={() => setIsForgotPassword(true)}>Forgot Password</a>
          </div>
          <button class="sign-in-button" type="submit">Sign In</button>
          <div class="separator">or</div>
          <button class="apple-sign-in" type="button">Sign in with Apple</button>
        </form>
      </div>

      {isForgotPassword() && (
        <div class="popup">
          <div class="popup-content">
            <h2>Reset Password</h2>
            {resetError() && <p class="error-message">{resetError()}</p>}
            <form onSubmit={handleResetPassword}>
              <div class="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  onInput={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <div class="input-group">
                <input
                  type="text"
                  placeholder="Token"
                  required
                  onInput={(e) => setResetToken(e.target.value)}
                />
              </div>
              <div class="input-group">
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  onInput={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <button class="reset-password-button" type="submit">Reset Password</button>
            </form>
            <button class="close-popup" onClick={() => setIsForgotPassword(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
