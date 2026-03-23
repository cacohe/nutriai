import React from 'react';

const TIME_PERIODS = [
    { value: 'breakfast', label: '早餐' },
    { value: 'lunch', label: '午餐' },
    { value: 'dinner', label: '晚餐' },
    { value: 'whole_day', label: '全天' },
    { value: 'custom', label: '自定义' }
];

function FoodInput({ foods, setFoods, onSubmit, loading }) {
    const addFood = () => {
        setFoods([...foods, { name: '', amount: '' }]);
    };

    const removeFood = (index) => {
        setFoods(foods.filter((_, i) => i !== index));
    };

    const updateFood = (index, field, value) => {
        const newFoods = [...foods];
        newFoods[index][field] = value;
        setFoods(newFoods);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validFoods = foods.filter(f => f.name.trim());
        if (validFoods.length > 0) {
            onSubmit(validFoods);
        }
    };

    return (
        <div className="card">
            <h2 className="card-title">输入食物信息</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>时间段</label>
                    <select name="timePeriod" required>
                        {TIME_PERIODS.map(period => (
                            <option key={period.value} value={period.value}>
                                {period.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>食物列表</label>
                    {foods.map((food, index) => (
                        <div key={index} className="food-input-group">
                            <input
                                type="text"
                                placeholder="食物名称（如：米饭、鸡蛋、西兰花）"
                                value={food.name}
                                onChange={(e) => updateFood(index, 'name', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="份量（如：1碗、2个、100克）"
                                value={food.amount}
                                onChange={(e) => updateFood(index, 'amount', e.target.value)}
                            />
                            {foods.length > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-small"
                                    onClick={() => removeFood(index)}
                                >
                                    删除
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary" onClick={addFood}>
                        + 添加食物
                    </button>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? '分析中...' : '开始分析'}
                </button>
            </form>
        </div>
    );
}

export default FoodInput;
