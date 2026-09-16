// Student Result Management System (vanilla JS)

// Data structure: array of students matching user's schema
// Student: { student_id, name, matric_no, results: [ { result_id, student_id, course, score, grade } ] }

// Use localStorage key so data persists across reloads
const STORAGE_KEY = 'srs_data_v1';
let students = [];

// --- Helper: grade calculation ---
function getGrade(score) {
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 45) return 'D';
  if (score >= 40) return 'E';
  return 'F';
}

// --- DOM elements ---
const addStudentForm = document.getElementById('add-student-form');
const studentNameInput = document.getElementById('student-name');
const studentMatricInput = document.getElementById('student-matric');

const studentSelect = document.getElementById('student-select');
const studentInfo = document.getElementById('student-info');
const infoName = document.getElementById('info-name');
const infoMatric = document.getElementById('info-matric');

const addResultForm = document.getElementById('add-result-form');
const courseNameInput = document.getElementById('course-name');
const courseCodeInput = document.getElementById('course-code');
const courseScoreInput = document.getElementById('course-score');

const resultsTableBody = document.querySelector('#results-table tbody');
const totalScoreEl = document.getElementById('total-score');
const avgScoreEl = document.getElementById('avg-score');

let currentStudentId = null;

const deleteStudentBtn = document.getElementById('delete-student-btn');

// --- Persistence helpers ---
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return (students = []);
    students = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load data', err);
    students = [];
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to save data', err);
  }
}

// --- UI Helpers ---
function refreshStudentSelect() {
  // Clear and repopulate the select
  studentSelect.innerHTML = '<option value="">-- Select student --</option>';
  students.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.student_id;
    opt.textContent = `${s.name} — ${s.matric_no}`;
    studentSelect.appendChild(opt);
  });
}

function showSelectedStudent(student) {
  if (!student) {
    studentInfo.classList.add('hidden');
    currentStudentId = null;
    return;
  }
  currentStudentId = student.student_id;
  infoName.textContent = student.name;
  infoMatric.textContent = student.matric_no;
  studentInfo.classList.remove('hidden');
  renderResultsTable(student.results);
}

function renderResultsTable(results) {
  resultsTableBody.innerHTML = '';
  if (!results || results.length === 0) {
    resultsTableBody.innerHTML = '<tr><td colspan="4">No results yet.</td></tr>';
    totalScoreEl.textContent = '0';
    avgScoreEl.textContent = '0';
    return;
  }

  let total = 0;
  results.forEach(r => {
    const tr = document.createElement('tr');
    const tdCode = document.createElement('td'); tdCode.textContent = r.course;
    const tdName = document.createElement('td'); tdName.textContent = r.course; // course name stored in `course` per schema
    const tdScore = document.createElement('td'); tdScore.textContent = r.score;
    const tdGrade = document.createElement('td'); tdGrade.textContent = r.grade;
    tr.append(tdCode, tdName, tdScore, tdGrade);
    resultsTableBody.appendChild(tr);
    total += Number(r.score);
  });

  totalScoreEl.textContent = total;
  avgScoreEl.textContent = (total / results.length).toFixed(2);
}

// --- Event listeners ---
addStudentForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = studentNameInput.value.trim();
  const matric = studentMatricInput.value.trim();

  // Validation: name and matric cannot be empty
  if (!name) return alert('Student name cannot be empty.');
  if (!matric) return alert('Matric number cannot be empty.');

  // Create a simple unique student_id
  const student_id = 'student_' + Date.now();
  const newStudent = { student_id, name, matric_no: matric, results: [] };
  students.push(newStudent);
  saveData();
  refreshStudentSelect();

  // Clear inputs
  studentNameInput.value = '';
  studentMatricInput.value = '';
  alert('Student added. Select them from the dropdown to add results.');
});

studentSelect.addEventListener('change', function () {
  const id = studentSelect.value;
  const student = students.find(s => s.student_id === id) || null;
  showSelectedStudent(student);
});

addResultForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!currentStudentId) return alert('Please select a student first.');

  const courseName = courseNameInput.value.trim();
  const courseCode = courseCodeInput.value.trim();
  const scoreRaw = courseScoreInput.value.trim();

  // Validation
  if (!courseName) return alert('Course name cannot be empty.');
  if (!courseCode) return alert('Course code cannot be empty.');
  if (scoreRaw === '') return alert('Score is required.');

  const score = Number(scoreRaw);
  if (Number.isNaN(score) || score < 0 || score > 100) return alert('Score must be a number between 0 and 100.');

  const grade = getGrade(score);

  // Create a result object following the requested schema
  const result_id = 'result_' + Date.now();
  const result = {
    result_id,
    student_id: currentStudentId,
    course: `${courseCode} - ${courseName}`,
    score,
    grade,
  };

  const student = students.find(s => s.student_id === currentStudentId);
  student.results.push(result);
  saveData();

  // Update UI
  renderResultsTable(student.results);

  // Clear inputs
  courseNameInput.value = '';
  courseCodeInput.value = '';
  courseScoreInput.value = '';
});

// Initialize from storage and UI
loadData();
refreshStudentSelect();
showSelectedStudent(null);

// --- Delete student handler ---
if (deleteStudentBtn) {
  deleteStudentBtn.addEventListener('click', function () {
    if (!currentStudentId) return alert('No student selected to delete.');
    const student = students.find(s => s.student_id === currentStudentId);
    if (!student) return alert('Selected student not found.');
    const ok = confirm(`Delete student "${student.name}" and all their results? This cannot be undone.`);
    if (!ok) return;

    // Remove student from array
    students = students.filter(s => s.student_id !== currentStudentId);
    saveData();

    // Refresh UI
    refreshStudentSelect();
    showSelectedStudent(null);
    alert('Student deleted.');
  });
}

