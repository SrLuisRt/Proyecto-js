const students = [];
const tableBody = document.querySelector("#studentsTable tbody");
const averageDiv = document.getElementById("average");
let editingId = null;

document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const fecha = document.getElementById("fecha").value.trim();
    const grade = parseFloat(document.getElementById("grade").value);

    if (!name || !lastName || !fecha || isNaN(grade) || grade < 1 || grade > 7 || passedStudents >=4.0 || failedStudents <=4.0) {
        alert("Error al ingresar Datos");
        return;
    }

    if (editingId !== null) {
        const index = students.findIndex(s => s.id === editingId);
        if (index !== -1) {
            students[index] = { id: editingId, name, lastName, fecha, grade };

           
            const row = tableBody.querySelector(`tr[data-id="${editingId}"]`);
            row.querySelector(".name-column").textContent = name;
            row.querySelector(".lastName-column").textContent = lastName;
            row.querySelector(".fecha-column").textContent = fecha;
            row.querySelector(".grade-column").textContent = grade;
        }
        editingId = null;
    } else {
        const student = {
            id: Date.now(),
            name,
            lastName,
            fecha,
            grade
        };
        students.push(student);
        addStudentToTable(student);
    }

    calculateAverage();
    this.reset();
});

function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.setAttribute("data-id", student.id);
    row.innerHTML = `
        <td class="name-column">${student.name}</td>
        <td class="lastName-column">${student.lastName}</td>
        <td class="fecha-column">${student.fecha}</td>
        <td class="grade-column">${student.grade}</td>
        <td><button class="edit-btn">Editar</button></td>
        <td><button class="delete-btn">Eliminar</button></td>
    `;

row.querySelector(".edit-btn").addEventListener("click", function () {
    const updatedStudent = students.find(s => s.id === student.id);
    editarEstudiante(updatedStudent);
});


    row.querySelector(".delete-btn").addEventListener("click", function () {
        deleteEstudiante(student.id, row);
    });

    tableBody.appendChild(row);
}

function editarEstudiante(student) {
    editingId = student.id;

    document.getElementById("name").value = student.name;
    document.getElementById("lastName").value = student.lastName;
    document.getElementById("fecha").value = student.fecha;
    document.getElementById("grade").value = student.grade;
}

function deleteEstudiante(studentId, row) {
    const index = students.findIndex(s => s.id === studentId);
    if (index !== -1) {
        students.splice(index, 1);
        row.remove();
        calculateAverage();
    }

    if (editingId === studentId) {
        editingId = null;
        document.getElementById("studentForm").reset();
    }
}
function updateStatistics() {
    const totalStudents = students.length;
    const passedStudents = students.filter(s => s.grade >= 4.0).length;
    const failedStudents = totalStudents - passedStudents;

    document.getElementById("totalStudents").textContent = `Total de estudiantes: ${totalStudents}`;
    document.getElementById("passedStudents").textContent = `Cantidad de aprobados: ${passedStudents}`;
    document.getElementById("failedStudents").textContent = `Cantidad de reprobados: ${failedStudents}`;
}

function calculateAverage() {
    if (students.length === 0) {
        averageDiv.textContent = "Promedio General del Curso: N/A";
        updateStatistics();  
    }

    const total = students.reduce((sum, s) => sum + s.grade, 0);
    const avg = total / students.length;
    averageDiv.textContent = "Promedio General del Curso: " + avg.toFixed(2);

    updateStatistics();
}