import { createSignal, onMount } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import LineChartShare from '../pages/charts';
import DonutCharts from '../pages/donut-charts';
import './grid.css';
import ThemeToggle from '../pages/ThemeToggle';
import Navbar from '../pages/navbar';
import MapComponent from '../pages/maps';
import { updateGenderData } from '../pages/store'; // Adjust the path as needed


const Grid = () => {
    let gridApi;
    const [isEditing, setIsEditing] = createSignal(false);
    const [currentUser, setCurrentUser] = createSignal(null);
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
    const [theme, setTheme] = createSignal(localStorage.getItem('theme') || 'light');
    const [rowData, setRowData] = createSignal([]);

    const toggleTheme = () => {
        const newTheme = theme() === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.classList.remove('dark-theme');
        }
    };

    onMount(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
        }
    });

    const fetchUsersFromBackend = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/fetch_users');
            const data = await response.json();
            setRowData(data);
            updateGenderData(data); // Update store with user data
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleEdit = (user) => {
        setIsEditing(true);
        setCurrentUser(user);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setEmail(user.email);
        setProvinsi(user.provinsi);
        setKabupaten(user.kabupaten);
        setKecamatan(user.kecamatan);
        setPhoneNumber(user.phone_number);
        setGender(user.gender);
        setBloodType(user.blood_type);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://127.0.0.1:8080/delete/${id}`, { method: 'DELETE' });
            fetchUsersFromBackend();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSave = async () => {
        try {
            const user = {
                first_name: firstName(),
                last_name: lastName(),
                email: email(),
                provinsi: provinsi(),
                kabupaten: kabupaten(),
                kecamatan: kecamatan(),
                phone_number: phoneNumber(),
                gender: gender(),
                blood_type: bloodType(),
                password: password(),
            };

            if (currentUser()) {
                await fetch(`http://127.0.0.1:8080/update_user/${currentUser().id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });
            } else {
                await fetch('http://127.0.0.1:8080/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });
            }

            fetchUsersFromBackend();
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleAdd = () => {
        setIsEditing(true);
        setCurrentUser(null);
        setFirstName('');
        setLastName('');
        setEmail('');
        setProvinsi('');
        setKabupaten('');
        setKecamatan('');
        setPhoneNumber('');
        setGender('');
        setBloodType('');
        setPassword('');
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email() }),
            });

            if (response.ok) {
                localStorage.removeItem('token');
                alert('Logout successful');
                window.location.href = '/login';
            } else {
                console.error('Failed to logout');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const columnDefs = [
        { headerName: 'First Name', field: 'first_name', sortable: true, filter: true },
        { headerName: 'Last Name', field: 'last_name', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        { headerName: 'Provinsi', field: 'provinsi', sortable: true, filter: true },
        { headerName: 'Kabupaten', field: 'kabupaten', sortable: true, filter: true },
        { headerName: 'Kecamatan', field: 'kecamatan', sortable: true, filter: true },
        { headerName: 'Phone Number', field: 'phone_number', sortable: true, filter: true },
        { headerName: 'Gender', field: 'gender', sortable: true, filter: true },
        { headerName: 'Blood Type', field: 'blood_type', sortable: true, filter: true },
        {
            headerName: 'Actions',
            cellRenderer: (params) => {
                const { data } = params;
                return (
                    <div class="action-buttons">
                        <button class="edit-button" onClick={() => handleEdit(data)}>
                            Edit
                        </button>
                        <button class="delete-button" onClick={() => handleDelete(data.id)}>
                            Delete
                        </button>
                        <button class="add-button" onClick={handleAdd}>
                            Add
                        </button>
                    </div>
                );
            },
        },
    ];

    const onGridReady = (params) => {
        gridApi = params.api;
        gridApi?.sizeColumnsToFit();
    };

    onMount(() => {
        fetchUsersFromBackend();
    });

    return (
        <div class={`admin-page ${theme()}`}>
            <Navbar
                currentUser={currentUser}
                handleLogout={handleLogout}
                toggleTheme={toggleTheme}
                theme={theme}
            />
            <div class="theme-toggle">
                <button onClick={toggleTheme}>
                    Toggle to {theme() === 'light' ? 'Dark' : 'Light'} Theme
                </button>
            </div>
            <div class="profile-ui">
                <div class="profile-info">
                    <ThemeToggle />
                </div>
            </div>
            <div class="dashboard">
                <div class="stats-card">
                    <h3>Total Users</h3>
                    <p>{rowData().length}</p>
                </div>
                <div class="stats-card">
                    <h3>Recent Signups</h3>
                    <p>{rowData().slice(-5).map(user => `${user.first_name} ${user.last_name}`).join(', ')}</p>
                </div>
            </div>
            <div class="activity-log">
                <h3>Recent Activity</h3>
                <ul>
                    {rowData().slice(-5).map(user => (
                        <li>{`${user.first_name} ${user.last_name}`} signed up on {new Date(user.created_at).toLocaleString()}</li>
                    ))}
                </ul>
            </div>
            <div class="user-management">
                <h3>User Management</h3>
                <div class={`ag-theme-${theme() === 'light' ? 'alpine' : 'alpine-dark'}`} style={{ height: '250px', flex: 1 }}>
                    <AgGridSolid
                        columnDefs={columnDefs}
                        rowData={rowData()}
                        domLayout="autoHeight"
                        onGridReady={onGridReady}
                        defaultColDef={{
                            flex: 1,
                            minWidth: 150,
                            resizable: true,
                        }}
                    />
                </div>
                {isEditing() && (
                    <div class="edit-form">
                        <h3>{currentUser() ? 'Edit User' : 'Add User'}</h3>
                        <label>
                            First Name:
                            <input type="text" value={firstName()} onInput={(e) => setFirstName(e.target.value)} />
                        </label>
                        <label>
                            Last Name:
                            <input type="text" value={lastName()} onInput={(e) => setLastName(e.target.value)} />
                        </label>
                        <label>
                            Email:
                            <input type="text" value={email()} onInput={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>
                            Password:
                            <input type="password" value={password()} onInput={(e) => setPassword(e.target.value)} />
                        </label>
                        <label>
                            Provinsi:
                            <input type="text" value={provinsi()} onInput={(e) => setProvinsi(e.target.value)} />
                        </label>
                        <label>
                            Kabupaten:
                            <input type="text" value={kabupaten()} onInput={(e) => setKabupaten(e.target.value)} />
                        </label>
                        <label>
                            Kecamatan:
                            <input type="text" value={kecamatan()} onInput={(e) => setKecamatan(e.target.value)} />
                        </label>
                        <label>
                            Phone Number:
                            <input type="text" value={phoneNumber()} onInput={(e) => setPhoneNumber(e.target.value)} />
                        </label>
                        <label>
                            Gender:
                            <input type="text" value={gender()} onInput={(e) => setGender(e.target.value)} />
                        </label>
                        <label>
                            Blood Type:
                            <input type="text" value={bloodType()} onInput={(e) => setBloodType(e.target.value)} />
                        </label>
                        <div class="button-container">
                            <button onClick={handleSave}>{currentUser() ? 'Save' : 'Add'}</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
            <div class="charts-container">
                <div class="chart">
                    <LineChartShare />
                </div>
                <div class="chart">
                    <DonutCharts />
                </div>
            </div>
            <div class="map-container" style={{ border: '1px solid #ccc', padding: '10px' }}>
                <h3>Map</h3>
                <div style={{ width: '100%', height: '400px' }}>
                    <MapComponent />
                </div>
            </div>
        </div>
    );
};

export default Grid;
