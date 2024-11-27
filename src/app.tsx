import { Component, onMount } from 'solid-js';
import { Link, useRoutes, useLocation } from '@solidjs/router';
import { routes } from './routes';
import Map from "./pages/maps"; // Import komponen Map

const App: Component = () => {
  const location = useLocation();
  const Route = useRoutes(routes);

  // Menentukan apakah sidebar harus ditampilkan berdasarkan lokasi
  const showSidebar = !['/login', '/register', '/grid', '/'].includes(location.pathname);

  return (
    <>
      {showSidebar && (
        <div class="flex">
          <div>
            <Map />
          </div>
          <aside class="bg-black text-white w-64 min-h-screen p-4">
            <div class="flex items-center mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
              </svg>
              <span class="ml-2 text-2xl font-bold">moodspace</span>
            </div>
            <nav class="flex flex-col space-y-4">
            </nav>
            <Link
              href="/login"
              class="text-white px-3 py-1 rounded-md mt-auto" style="background-color: #333;"
            >
              Login
            </Link>
          </aside>
          <main class="flex-1 p-4">
            <Route />
          </main>
        </div>
      )}

      {!showSidebar && (
        <main>
          <Route />
        </main>
      )}
    </>
  );
};

export default App;
