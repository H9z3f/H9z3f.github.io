function generateRandomMileage(totalMileage, workDays, maxDeviation) {
    // Проверка валидности входных данных
    if (workDays <= 0 || totalMileage <= 0 || maxDeviation < 0) {
        throw new Error("Недопустимые входные данные");
    }

    // Генерация начальных значений
    const avgMileage = Math.floor(totalMileage / workDays);
    let mileages = new Array(workDays).fill(avgMileage);

    // Распределение остатка
    let remainder = totalMileage - (avgMileage * workDays);

    // Добавляем остаток случайным образом в массив
    for (let i = 0; i < remainder; i++) {
        mileages[Math.floor(Math.random() * workDays)]++;
    }

    // Применение отклонения
    mileages = mileages.map(m => {
        // Находим максимально допустимое значение пробега с учетом отклонения
        const lowerBound = Math.max(m - maxDeviation, 0);
        const upperBound = m + maxDeviation;
        return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
    });

    // Корректируем итоговый пробег, чтобы он соответствовал заданному
    const currentTotalMileage = mileages.reduce((sum, m) => sum + m, 0);
    if (currentTotalMileage !== totalMileage) {
        const diff = totalMileage - currentTotalMileage;
        for (let i = 0; i < Math.abs(diff); i++) {
            mileages[Math.floor(Math.random() * workDays)] += (diff > 0 ? 1 : -1);
        }
    }

    return mileages;
}

document.getElementById("calculate").addEventListener("click", function (ev) {
    ev.preventDefault();

    const totalMileage = parseInt(document.getElementById("mileage").value); // Общий пробег
    const workDays = parseInt(document.getElementById("days").value); // Количество рабочих дней
    const maxDeviation = parseInt(document.getElementById("deviation").value); // Максимальное отклонение
    const result = document.getElementById("result");

    try {
        const mileages = generateRandomMileage(totalMileage, workDays, maxDeviation);
        result.innerHTML = `
            <h2>Таблица дневного пробега</h2>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>День, №</th>
                        <th>Дневной пробег, км</th>
                    </tr>
                </thead>
                <tbody id="calculation">
                </tbody>
            </table>
        `;

        const calculation = document.getElementById("calculation");
        mileages.forEach(function (value, index) {
            calculation.innerHTML = calculation.innerHTML + `
                <tr>
                    <td>${index + 1}</td>
                    <td>${value}</td>
                </tr>
            `;
        });
    } catch (ex) {
        result.innerHTML = `
            <h2>${ex.message}</h2>
        `;
    }
});
