import React, { useState, useEffect } from 'react';
import FoodInput from './components/FoodInput';
import ResultDisplay from './components/ResultDisplay';
import History from './components/History';
import { analyzeFood, getHistory } from './services/api';

function App() {
    const [foods, setFoods] = useState([{ name: '', amount: '' }]);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await getHistory();
            if (res.success) {
                setHistory(res.data);
            }
        } catch (e) {
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

    return (
        <div className="container">
            <div className="header">
                <h1>NutriAI 智能营养分析</h1>
                <p>输入您吃的食物，AI为您分析营养状况</p>
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
