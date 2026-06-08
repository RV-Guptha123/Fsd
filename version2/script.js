function getStudents(){
    const stored = localStorage.getItem('students');
    return stored ? JSON.parse(stored) : [];
}

function saveStudents(students){
    localStorage.setItem('students', JSON.stringify(students));
}

function register(event){
    if (event){
        event.preventDefault();
    }
    const fname = document.getElementById('username').value.trim();
    const email = document.getElementById('mail').value.trim();
    const password = document.getElementById('password').value;

    if (!fname || !email || !password) {
        alert('Please fill all fields');
        return;
    }

    const user = {
        name: fname,
        email: email,
        password: password
    };

    localStorage.setItem('user', JSON.stringify(user));
    alert('Registration successful');
    window.location.href = 'login.html';
}

function login(event){
    if (event){
        event.preventDefault();
    }
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.name === username && user.password === password){
        alert('Login successful');
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid username or password');
    }
}

function addStudent(event){
    if (event){
        event.preventDefault();
    }
    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const grade = document.getElementById('grade').value.trim();

    if (!name || !age || !grade) {
        alert('Please fill all fields');
        return;
    }

    const students = getStudents();
    const newStudent = {
        id: Date.now(),
        name: name,
        age: age,
        grade: grade
    };

    students.push(newStudent);
    saveStudents(students);
    alert('Student added successfully');
    window.location.href = 'viewstudents.html';
}

function renderStudents(){
    const students = getStudents();
    const tbody = document.getElementById('student-list');
    if (!tbody) {
        return;
    }

    tbody.innerHTML = '';
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No students found.</td></tr>';
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.grade}</td>
            <td>
                <button type="button" onclick="deleteStudent(${student.id})">Delete</button>
                <a href="updatestudent.html?id=${student.id}">Update</a>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteStudent(studentId){
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }
    let students = getStudents();
    students = students.filter(student => student.id !== studentId);
    saveStudents(students);
    renderStudents();
}

function getQueryId(){
    const params = new URLSearchParams(window.location.search);
    return params.has('id') ? Number(params.get('id')) : null;
}

function loadStudentForUpdate(){
    const studentId = getQueryId();
    if (!studentId) {
        return;
    }

    const student = getStudents().find(item => item.id === studentId);
    if (!student) {
        alert('Student not found');
        return;
    }

    document.getElementById('student-id').value = student.id;
    document.getElementById('name').value = student.name;
    document.getElementById('age').value = student.age;
    document.getElementById('grade').value = student.grade;
}

function updateStudent(event){
    if (event){
        event.preventDefault();
    }
    const studentId = Number(document.getElementById('student-id').value);
    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const grade = document.getElementById('grade').value.trim();

    if (!name || !age || !grade) {
        alert('Please fill all fields');
        return;
    }

    const students = getStudents();
    const index = students.findIndex(item => item.id === studentId);
    if (index === -1) {
        alert('Student not found');
        return;
    }

    students[index] = {
        id: studentId,
        name: name,
        age: age,
        grade: grade
    };
    saveStudents(students);
    alert('Student updated successfully');
    window.location.href = 'viewstudents.html';
}

window.addEventListener('load', function(){
    if (document.getElementById('student-list')) {
        renderStudents();
    }
    if (document.getElementById('student-id')) {
        loadStudentForUpdate();
    }
});