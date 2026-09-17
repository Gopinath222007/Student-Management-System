import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { StudentAPI } from './api';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import SearchBar from './components/SearchBar';

const DEPARTMENTS = [
  ['CSE', 'Computer Science & Engineering'],
  ['ECE', 'Electronics & Communication Engineering'],
  ['EEE', 'Electrical & Electronics Engineering'],
  ['MECH', 'Mechanical Engineering'],
  ['CIVIL', 'Civil Engineering'],
  ['IT', 'Information Technology'],
  ['MBA', 'Master of Business Administration'],
];

const YEARS = [[1, 'First Year'], [2, 'Second Year'], [3, 'Third Year'], [4, 'Fourth Year']];

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [serverErrors, setServerErrors] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');

  const fetchStudents = useCallback(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (search) params.search = search;
    if (department) params.department = department;
    if (year) params.year = year;

    StudentAPI.list(params)
      .then((res) => setStudents(res.data.results ?? res.data))
      .catch(() => setError('Could not reach the backend. Is the Django server running on http://127.0.0.1:8000 ?'))
      .finally(() => setLoading(false));
  }, [search, department, year]);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300); // debounce search input
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const flashMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreateOrUpdate = (data) => {
    setServerErrors(null);
    const request = editingStudent
      ? StudentAPI.update(editingStudent.id, data)
      : StudentAPI.create(data);

    request
      .then(() => {
        flashMessage(editingStudent ? 'Student updated successfully.' : 'Student added successfully.');
        setEditingStudent(null);
        setShowForm(false);
        fetchStudents();
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setServerErrors(err.response.data);
        } else {
          setServerErrors({ detail: 'Something went wrong. Please try again.' });
        }
      });
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setServerErrors(null);
    setShowForm(true);
  };

  const handleDelete = (student) => {
    if (!window.confirm(`Delete ${student.full_name} (${student.roll_number})? This cannot be undone.`)) return;
    StudentAPI.remove(student.id)
      .then(() => {
        flashMessage('Student deleted successfully.');
        fetchStudents();
      })
      .catch(() => setError('Failed to delete student.'));
  };

  const handleCancel = () => {
    setEditingStudent(null);
    setServerErrors(null);
    setShowForm(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 Student Management System</h1>
        <p>CRUD-based Web Application — React + Django REST Framework + SQLite</p>
      </header>

      {message && <div className="banner success">{message}</div>}
      {error && <div className="banner error-banner">{error}</div>}

      <div className="toolbar">
        <SearchBar
          search={search} setSearch={setSearch}
          department={department} setDepartment={setDepartment}
          year={year} setYear={setYear}
          departments={DEPARTMENTS} years={YEARS}
        />
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Student</button>
        )}
      </div>

      {showForm && (
        <StudentForm
          editingStudent={editingStudent}
          onSubmit={handleCreateOrUpdate}
          onCancel={handleCancel}
          departments={DEPARTMENTS}
          years={YEARS}
          serverErrors={serverErrors}
        />
      )}

      <StudentList
        students={students}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
