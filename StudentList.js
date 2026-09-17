import React from 'react';

export default function StudentList({ students, loading, onEdit, onDelete }) {
  if (loading) return <p className="status-text">Loading students...</p>;
  if (!students.length) return <p className="status-text">No students found.</p>;

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>Roll No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Year</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.roll_number}</td>
              <td>{s.full_name}</td>
              <td>{s.email}</td>
              <td>{s.department_display}</td>
              <td>{s.year_display}</td>
              <td>{s.phone || '—'}</td>
              <td className="actions">
                <button className="btn btn-small" onClick={() => onEdit(s)}>Edit</button>
                <button className="btn btn-small btn-danger" onClick={() => onDelete(s)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
