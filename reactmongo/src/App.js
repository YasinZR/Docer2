import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Sellers from './components/Sellers';
import Products from './components/Products';
import Orders from './components/Orders';
import Login from './components/Login';
import Reports from './components/Reports';
import ErrorAlert  from './components/ErrorAlert';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
          setIsLoggedIn(true);
          setUsername(storedUsername);
      }
    }, []);

    const handleLogin = async (username, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append('name', username);
            formData.append('password', password);
    
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });
    
            if (response.ok) {
                setIsLoggedIn(true);
                setUsername(username);
                localStorage.setItem('username', username);
                setShowError(false);
            } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Ошибка авторизации');
                setShowError(true);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            setErrorMessage('Ошибка подключения к серверу');
            setShowError(true);
        }
    };
    

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        localStorage.removeItem('username');
        return <Navigate to="/login" replace />;
    };

    return (
        <Router>
            <div>
                {isLoggedIn? (
                    <header>
                        <span>Магазин</span>
                        <nav>
                            <div>
                                <ul>
                                    <li><Link to="/sellers">Продавцы</Link></li>
                                    <li><Link to="/products">Продукты</Link></li>
                                    <li><Link to="/orders">Заказы</Link></li>
                                    <li><Link to="/reports">Отчеты</Link></li>
                                </ul>
                            </div>
                        </nav>
                        <div className='right-header'>
                            <label className='usernameText'>{username}</label>
                            <button onClick={handleLogout}>Сменить пользователя</button>
                        </div>
                    </header>
                ) : (
                    <>
                        <Login onLogin={handleLogin} />
                        {showError && <ErrorAlert message={errorMessage} onClose={() => setShowError(false)} />}
                    </>
                    
                )}
                <main>
                    <Routes>
                        {isLoggedIn && (
                            <>
                                <Route path="/sellers" element={<Sellers />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/orders" element={<Orders />} />
                                <Route path="/reports" element={<Reports />} />
                            </>
                        )}
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;