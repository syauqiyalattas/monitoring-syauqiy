import { createSignal } from 'solid-js';

const ThemeToggle = () => {
    const [theme, setTheme] = createSignal(localStorage.getItem('theme') || 'light');

    const toggleTheme = () => {
        const newTheme = theme() === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        // Toggle the dark theme on the root element
        document.documentElement.classList.toggle('dark-theme', newTheme === 'dark');
    };

    return (
        <label class="switch">
            <input type="checkbox" checked={theme() === 'dark'} onClick={toggleTheme} />
            <span class="slider"></span>
        </label>
    );
};

export default ThemeToggle;
