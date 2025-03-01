document.addEventListener("DOMContentLoaded", function () {
    const students = [
        "مريم كافي", "شذى", "اية", "نور كافي", "نور غرام","أحمد", "أويس", "رحمة", "يوسف", "عمر","أبي", "مريم"
    ];
    const studentsContainer = document.getElementById("students-container");
    const darkModeToggle = document.getElementById("darkModeToggle");

    let studentsGoals = JSON.parse(localStorage.getItem("studentsGoals")) || {};

    function createStudentBlock(name) {
        const studentDiv = document.createElement("div");
        studentDiv.classList.add("student");

        studentDiv.innerHTML = `
            <h3>📝 ${name}</h3>
            <div class="progress-bar-container">
                <div class="progress-bar" id="progress-${name}"></div>
            </div>
            <input type="text" id="goal-input-${name}" placeholder="أضف هدفًا...">
            <button onclick="addGoal('${name}')">إضافة ✅</button>
            <ul class="goal-list" id="goal-list-${name}"></ul>
        `;

        studentsContainer.appendChild(studentDiv);
        updateGoals(name);
    }

    function updateGoals(name) {
        const goalList = document.getElementById(`goal-list-${name}`);
        goalList.innerHTML = "";

        const goals = studentsGoals[name] || [];
        goals.forEach((goal, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${goal.text}</span>
                <input type="checkbox" ${goal.completed ? "checked" : ""} onclick="toggleGoal('${name}', ${index})">
                <button onclick="deleteGoal('${name}', ${index})">❌</button>
            `;
            goalList.appendChild(li);
        });

        updateProgress(name);
    }

    function updateProgress(name) {
        const goals = studentsGoals[name] || [];
        const completedGoals = goals.filter(goal => goal.completed).length;
        const progress = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;
        document.getElementById(`progress-${name}`).style.width = progress + "%";
    }

    window.addGoal = function (name) {
        const input = document.getElementById(`goal-input-${name}`);
        const newGoal = input.value.trim();
        if (newGoal) {
            studentsGoals[name] = studentsGoals[name] || [];
            studentsGoals[name].push({ text: newGoal, completed: false });
            input.value = "";
            saveGoals();
            updateGoals(name);
        }
    };

    window.deleteGoal = function (name, index) {
        if (confirm("هل أنت متأكد من حذف هذا الهدف؟")) {
            studentsGoals[name].splice(index, 1);
            saveGoals();
            updateGoals(name);
        }
    };

    window.toggleGoal = function (name, index) {
        studentsGoals[name][index].completed = !studentsGoals[name][index].completed;
        saveGoals();
        updateGoals(name);
    };

    function saveGoals() {
        localStorage.setItem("studentsGoals", JSON.stringify(studentsGoals));
    }

    students.forEach(createStudentBlock);

    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
        darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ وضع النهار" : "🌙 وضع الليل";
    });

    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.textContent = "☀️ وضع النهار";
    }
});
