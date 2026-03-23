import React from 'react';

function History({ history, onSelect }) {
    const formatTime = (timeStr) => {
        const date = new Date(timeStr);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPeriodLabel = (period) => {
        const labels = {
            'breakfast': '早餐',
            'lunch': '午餐',
            'dinner': '晚餐',
            'whole_day': '全天',
            'custom': '自定义'
        };
        return labels[period] || period;
    };

    const getFoodSummary = (foods) => {
        if (!foods) return '无';
        if (Array.isArray(foods)) {
            return foods.map(f => f.name).join('、');
        }
        return '无';
    };

    if (!history || history.length === 0) {
        return (
            <div className="card">
                <h2 className="card-title">历史记录</h2>
                <div className="empty">暂无历史记录</div>
            </div>
        );
    }

    return (
        <div className="card">
            <h2 className="card-title">历史记录</h2>
            {history.map((item) => (
                <div 
                    key={item.id} 
                    className="history-item"
                    onClick={() => onSelect(item)}
                >
                    <div className="history-time">
                        {formatTime(item.created_at)} · {getPeriodLabel(item.time_period)}
                    </div>
                    <div className="history-foods">
                        {getFoodSummary(item.foods)}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default History;
