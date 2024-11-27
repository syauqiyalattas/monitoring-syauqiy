import { createSignal } from 'solid-js';
import CryptoJS from 'crypto-js';
import './register.css';

const Register = (props) => {
  // All signals as defined previously
  const [firstName, setFirstName] = createSignal('');
  const [lastName, setLastName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [provinsi, setProvinsi] = createSignal('');
  const [kabupaten, setKabupaten] = createSignal('');
  const [kecamatan, setKecamatan] = createSignal('');
  const [phoneNumber, setPhoneNumber] = createSignal('');
  const [gender, setGender] = createSignal('');
  const [bloodType, setBloodType] = createSignal('');
  const [showOtpPopup, setShowOtpPopup] = createSignal(false);
  const [otp, setOtp] = createSignal('');
  const [registrationStatus, setRegistrationStatus] = createSignal('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email().endsWith('@gmail.com')) {
      alert('Email must use @gmail.com');
      return;
    }

    const newData = {
      first_name: firstName(),
      last_name: lastName(),
      email: email(),
      password: password(),  // No hashing here, plain password
      provinsi: provinsi(),
      kabupaten: kabupaten(),
      kecamatan: kecamatan(),
      phone_number: phoneNumber(),
      gender: gender(),
      blood_type: bloodType(),
    };

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        const result = await response.json();
        setRegistrationStatus(result.message); // Assume result includes a message
        setShowOtpPopup(true);
      } else {
        const error = await response.json();
        alert(`Registration failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed. Please try again.');
    }
  };


  const handleOtpVerification = async () => {
    try {
      const response = await fetch('http://localhost:8080/verify_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email(), otp: otp() }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('OTP verified successfully!');
        setShowOtpPopup(false);
      } else {
        const error = await response.json();
        alert(`OTP verification failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('OTP verification failed. Please try again.');
    }
  };

  return (
    <div class="register-container">
      <div class="background-image"></div>
      <div class="register-box">
        <h2>Sign Up</h2>
        <p>Keep it all together and you'll be ready</p>
        <form onSubmit={handleRegister}>
          {/* Input fields as defined previously */}
          <div class="input-group">
            <input type="text" placeholder="First name" required onInput={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="Last name" required onInput={(e) => setLastName(e.target.value)} />
          </div>
          <div class="input-group">
            <input type="email" placeholder="Email" required onInput={(e) => setEmail(e.target.value)} />
          </div>
          <div class="input-group">
            <select required onChange={(e) => setKecamatan(e.target.value)}>
              <option value="" disabled selected>Kecamatan</option>
              <option value="Kecamatan A">Ajibarang</option>
              <option value="Kecamatan B">Purwokerto Selatan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <select required onChange={(e) => setKabupaten(e.target.value)}>
              <option value="" disabled selected>Kabupaten</option>
              <option value="Kabupaten A">Banyumas</option>
              <option value="Kabupaten B">Bandung</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <select required onChange={(e) => setProvinsi(e.target.value)}>
              <option value="" disabled selected>Provinsi</option>
              <option value="Provinsi A">Jawa Tengah</option>
              <option value="Provinsi B">Jawa Barat</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div class="input-group">
            <input type="tel" placeholder="Phone Number" required onInput={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <div class="input-group">
            <input type="password" placeholder="Password" required onInput={(e) => setPassword(e.target.value)} />
          </div>
          <div class="input-group">
            <select required onChange={(e) => setGender(e.target.value)}>
              <option value="" disabled selected>Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select required onChange={(e) => setBloodType(e.target.value)}>
              <option value="" disabled selected>Blood type</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>
          <button class="register-button" type="submit">Register Now</button>
        </form>
      </div>
      {showOtpPopup() && (
        <div class="otp-popup">
          <h3>Verify OTP</h3>
          <input
            type="text"
            placeholder="Enter OTP"
            onInput={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleOtpVerification}>Verify OTP</button>
          <button onClick={() => setShowOtpPopup(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Register;
