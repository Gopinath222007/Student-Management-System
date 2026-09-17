import React, { useEffect, useState } from 'react';

const emptyForm = {
  first_name: '', last_name: '', email: '', roll_number: '',
  department: 'CSE', year: 1, phone: '', date_of_admission: '',
};

export default function StudentForm({ editingStudent, onSubmit, onCancel, departments, years, serverErrors }) {
  const [form, setForm] = useState(emptyForm);
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setForm({
        first_name: editingStudent.first_name,
        last_name: editingStudent.last_name,
        email: editingStudent.email,
        roll_number: editingStudent.roll_number,
        department: editingStudent.department,
        year: editingStudent.year,
        phone: editingStudent.phone || '',
        date_of_admission: editingStudent.date_of_admission,
      });
    } else {
      setForm(emptyForm);
    }
    setClientErrors({});
  }, [editingStudent]);

  const validate = () => {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = 'First name is required.';
    if (!form.last_name.trim()) errs.last_name = 'Last name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.roll_number.trim()) errs.roll_number = 'Roll number is required.';
    if (!form.date_of_admission) errs.date_of_admission = 'Date of admission is required.';
    if (form.phone && !/^\+?\d{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number (7-15 digits).';
    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, year: Number(form.year) });
  };

  const errorFor = (field) => clientErrors[field] || (serverErrors && serverErrors[field]);

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>

      <div className="form-row">
        <div className="form-field">
          <label>First Name *</label>
          <input name="first_name" value={form.first_name} onChange={handleChange} />
          {errorFor('first_name') && <span className="error">{errorFor('first_name')}</span>}
        </div>
        <div className="form-field">
          <label>Last Name *</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} />
          {errorFor('last_name') && <span className="error">{errorFor('last_name')}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
          {errorFor('email') && <span className="error">{errorFor('email')}</span>}
        </div>
        <div className="form-field">
          <label>Roll Number *</label>
          <input name="roll_number" value={form.roll_number} onChange={handleChange} />
          {errorFor('roll_number') && <span className="error">{errorFor('roll_number')}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Department *</label>
          <select name="department" value={form.department} onChange={handleChange}>
            {departments.map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Year *</label>
          <select name="year" value={form.year} onChange={handleChange}>
            {years.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91XXXXXXXXXX" />
          {errorFor('phone') && <span className="error">{errorFor('phone')}</span>}
        </div>
        <div className="form-field">
          <label>Date of Admission *</label>
          <input name="date_of_admission" type="date" value={form.date_of_admission} onChange={handleChange} />
          {errorFor('date_of_admission') && <span className="error">{errorFor('date_of_admission')}</span>}
        </div>
      </div>

      {serverErrors && serverErrors.detail && <div className="error server-error">{serverErrors.detail}</div>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{editingStudent ? 'Update' : 'Add'} Student</button>
        {editingStudent && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
