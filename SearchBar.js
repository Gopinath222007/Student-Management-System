import React from 'react';

export default function SearchBar({ search, setSearch, department, setDepartment, year, setYear, departments, years }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name, email, or roll number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={department} onChange={(e) => setDepartment(e.target.value)}>
        <option value="">All Departments</option>
        {departments.map(([code, label]) => (
          <option key={code} value={code}>{label}</option>
        ))}
      </select>
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">All Years</option>
        {years.map(([val, label]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>
    </div>
  );
}
