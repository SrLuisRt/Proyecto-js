const students = [];
const tableBody = document.querySelector("#studentsTable tbody");
const averageDiv = document.getElementById("average");
let editingStudent = null; 

document.getElementById("studentForm").addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const fecha = document.getElementById("fecha").value.trim();
    const grade = parseFloat(document.getElementById("grade").value);

    if (!name || !lastName || !fecha || isNaN(grade) || grade < 1 || grade > 7) {
        alert("Error al ingresar Datos");
        return;
    }

    const student = { name, lastName, grade, fecha };

    if (editingStudent) {
        const index = students.indexOf(editingStudent);
        students[index] = student;  
        
 
        const row = tableBody.querySelector(`tr[data-id="${editingStudent.id}"]`);
        row.querySelector(".name-column").textContent = student.name;
        row.querySelector(".lastName-column").textContent = student.lastName;
        row.querySelector(".fecha-column").textContent = student.fecha;
        row.querySelector(".grade-column").textContent = student.grade;

        editingStudent = null;
    } else {

        student.id = Date.now(); 
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

    row.querySelector(".edit-btn").addEventListener("click", function(){
        editarEstudiante(student, row);
    });
    row.querySelector(".delete-btn").addEventListener("click", function(){
        deleteEstudiante(student, row);
    });

    tableBody.appendChild(row);
}

function deleteEstudiante(student, row) {

    const index = students.findIndex(s => s.id === student.id);
    if (index !== -1) {
        students.splice(index, 1); 
        row.remove(); 
        calculateAverage(); 
    }
}


function calculateAverage() {
    if (students.length === 0) {
        averageDiv.textContent = "Promedio General del Curso: N/A";
        return;
    }
    

    const total = students.reduce((sum, student) => sum + student.grade, 0);
    const prom = total / students.length;
    averageDiv.textContent = "Promedio General del Curso: " + prom.toFixed(2);
}

function editarEstudiante(student, row) {

    editingStudent = student;


    document.getElementById("name").value = student.name;
    document.getElementById("lastName").value = student.lastName;
    document.getElementById("fecha").value = student.fecha;
    document.getElementById("grade").value = student.grade;
}
