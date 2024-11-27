import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import ThemeToggle from '../pages/ThemeToggle';
import './navbar.css';

const Navbar = ({ currentUser, handleLogout, toggleTheme, theme }) => {
    const navigate = useNavigate();

    const goToMap = () => {
        navigate('/map');
    };

    return (
        <nav class={`navbar ${theme()}`}>
            <div class="logo">
                <div class="circle-logo">
                    <div class="outer-circle"></div>
                    <div class="inner-circle"></div>
                </div>
                <span>MoodSpace</span>
            </div>

            <div class="map-section">
                <button class="map-button" onClick={goToMap}>
                    <div class="map-icon">
                        <div class="land"></div>
                        <div class="water"></div>
                        <div class="roads"></div>
                        <div class="buildings"></div>
                    </div>
                </button>
            </div>

            <div class="profile-section">
                <img src="/public/pages-img/profile.jpg" alt="Profile Picture" class="profile-pic" />
                <span class="username">{currentUser()?.first_name || 'Dummy'}</span>
                <button class="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
