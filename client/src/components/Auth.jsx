import React, { useState } from 'react';
import { login, register } from '../services/api';

function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let res;
            if (isLogin) {
                res = await login(username, password);
            } else {
                res = await register(username, password);
            }

            if (res.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                onLogin(res.data);
            } else {
                setError(res.error || (isLogin ? '登录失败' : '注册失败'));
            }
        } catch (err) {
            setError(err.response?.data?.error || '请求失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isLogin ? '登录' : '注册'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>用户名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="请输入用户名"
                            required
                            minLength={3}
                            maxLength={50}
                        />
                    </div>
                    <div className="form-group">
                        <label>密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                            required
                            minLength={6}
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? '请稍候...' : (isLogin ? '登录' : '注册')}
                    </button>
                </form>
                <p className="toggle-link">
                    {isLogin ? '没有账号？' : '已有账号？'}
                    <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                        {isLogin ? '立即注册' : '立即登录'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Auth;