import React, { useState, useEffect } from 'react';
import FoodInput from './components/FoodInput';
import ResultDisplay from './components/ResultDisplay';
import History from './components/History';
import Auth from './components/Auth';
import { analyzeFood, getHistory } from './services/api';

function App() {
    const [foods, setFoods] = useState([{ name: '', amount: '' }]);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        if (user) {
            loadHistory();
        }
    }, [user]);

    const handleLogin = (userData) => {
        setUser(userData.user);
        loadHistory();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setHistory([]);
        setResult(null);
    };

    const loadHistory = async () => {
        try {
            const res = await getHistory();
            if (res.success) {
                setHistory(res.data);
            }
        } catch (e) {
            if (e.response?.status === 401 || e.response?.status === 403) {
                handleLogout();
            }
            console.error('加载历史失败:', e);
        }
    };

    const handleAnalyze = async (validFoods) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const form = document.querySelector('form');
            const timePeriod = form.timePeriod.value;
            const res = await analyzeFood(validFoods, timePeriod);
            
            if (res.success) {
                setResult(res.result);
                loadHistory();
            } else {
                setError(res.error || '分析失败');
            }
        } catch (e) {
            setError(e.response?.data?.error || e.message || '请求失败');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectHistory = (item) => {
        setResult(item.result);
    };

    if (!user) {
        return <Auth onLogin={handleLogin} />;
    }

    return (
        <div className="container">
            <div className="header">
                <h1>NutriAI 智能营养分析</h1>
                <p>输入您吃的食物，AI为您分析营养状况</p>
                <div className="user-info">
                    <span>欢迎，{user.username}</span>
                    <button onClick={handleLogout} className="btn-logout">退出</button>
                </div>
            </div>

            {error && <div className="error">{error}</div>}

            <FoodInput
                foods={foods}
                setFoods={setFoods}
                onSubmit={handleAnalyze}
                loading={loading}
            />

            {loading && <div className="loading">AI正在分析中，请稍候...</div>}

            <ResultDisplay result={result} />

            <History history={history} onSelect={handleSelectHistory} />
        </div>
    );
}

export default App;
