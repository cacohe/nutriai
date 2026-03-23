import React from 'react';

function ResultDisplay({ result }) {
    if (!result) return null;

    const formatList = (arr) => {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return '无';
        return arr.map((item, i) => <span key={i} className="tag tag-warning">{item}</span>);
    };

    const formatListGreen = (arr) => {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return '无';
        return arr.map((item, i) => <span key={i} className="tag tag-success">{item}</span>);
    };

    const formatListRed = (arr) => {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return '无';
        return arr.map((item, i) => <span key={i} className="tag tag-danger">{item}</span>);
    };

    if (result.raw) {
        return (
            <div className="card">
                <h2 className="card-title">分析结果</h2>
                <div className="summary">
                    {result.raw}
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <h2 className="card-title">分析结果</h2>
            
            {result.summary && (
                <div className="summary">
                    <strong>总体评价：</strong>{result.summary}
                </div>
            )}

            {result.missingNutrients && result.missingNutrients.length > 0 && (
                <div className="result-section">
                    <h3>可能缺少的营养</h3>
                    <ul>
                        {result.missingNutrients.map((item, i) => (
                            <li key={i}>{formatListGreen([item])}</li>
                        ))}
                    </ul>
                </div>
            )}

            {result.excessNutrients && result.excessNutrients.length > 0 && (
                <div className="result-section">
                    <h3>可能过剩的营养</h3>
                    <ul>
                        {result.excessNutrients.map((item, i) => (
                            <li key={i}>{formatListRed([item])}</li>
                        ))}
                    </ul>
                </div>
            )}

            {result.seasoningIssues && result.seasoningIssues.length > 0 && (
                <div className="result-section">
                    <h3>调料品建议</h3>
                    <ul>
                        {result.seasoningIssues.map((item, i) => (
                            <li key={i}>{formatList([item])}</li>
                        ))}
                    </ul>
                </div>
            )}

            {result.recommendations && (
                <div className="result-section">
                    <h3>饮食建议</h3>
                    {result.recommendations.increase && result.recommendations.increase.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                            <strong>建议增加：</strong>
                            {formatListGreen(result.recommendations.increase)}
                        </div>
                    )}
                    {result.recommendations.decrease && result.recommendations.decrease.length > 0 && (
                        <div>
                            <strong>建议减少：</strong>
                            {formatListRed(result.recommendations.decrease)}
                        </div>
                    )}
                </div>
            )}

            {result.healthEffects && (
                <div className="result-section">
                    <h3>健康影响</h3>
                    {result.healthEffects.deficient && (
                        <div style={{ marginBottom: '12px' }}>
                            <strong>摄入不足的影响：</strong>
                            {result.healthEffects.deficient}
                        </div>
                    )}
                    {result.healthEffects.excess && (
                        <div>
                            <strong>摄入过多的影响：</strong>
                            {result.healthEffects.excess}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ResultDisplay;
