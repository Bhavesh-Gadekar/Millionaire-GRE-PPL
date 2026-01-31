'use client';

import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './testAttempts.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminPage() {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [chartData, setChartData] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('allSubmissions')) || [];
    setResults(storedData);
    setFilteredResults(storedData);
    initChart(storedData);
  }, []);

  // Initialize chart data
  const initChart = (data) => {
    const counts = [0, 0, 0, 0, 0];
    data.forEach((r) => counts[parseInt(r.score)]++);

    setChartData({
      labels: ['0/4', '1/4', '2/4', '3/4', '4/4'],
      datasets: [
        {
          label: 'Score Distribution',
          data: counts,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    });
  };

  // Filter table based on search and status
  const filterTable = () => {
    const filtered = results.filter((res) => {
      const matchesSearch =
        res.timestamp.toLowerCase().includes(searchInput.toLowerCase()) ||
        res.status.toLowerCase().includes(searchInput.toLowerCase());
      const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredResults(filtered);
  };

  useEffect(() => {
    filterTable();
  }, [searchInput, statusFilter]);

  // Export to CSV
  const exportCSV = () => {
    if (results.length === 0) {
      alert('No data to export!');
      return;
    }
    let csv = 'Date,Score,Status\n';
    results.forEach((r) => (csv += `${r.timestamp},${r.score},${r.status}\n`));

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Student_Results.csv';
    a.click();
  };

  // Clear all data
  const clearData = () => {
    if (confirm('Delete all records?')) {
      localStorage.removeItem('allSubmissions');
      setResults([]);
      setFilteredResults([]);
      setChartData(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>📊 Exam Analytics</h2>
        <div className={styles.headerBtns}>
          <button className={`${styles.btn} ${styles.btnDownload}`} onClick={exportCSV}>
            📥 Download CSV
          </button>
          <button className={`${styles.btn} ${styles.btnClear}`} onClick={clearData}>
            🗑️ Reset
          </button>
        </div>
      </header>

      <div className={styles.card}>
        {chartData && (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        )}
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Search by Date or Status..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Results</option>
          <option value="Pass">Pass Only</option>
          <option value="Fail">Fail Only</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Score</th>
              <th>Status</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((res, idx) => {
              const scoreNum = parseInt(res.score);
              const perf = (scoreNum / 4) * 100;
              return (
                <tr key={idx}>
                  <td>{res.timestamp}</td>
                  <td>
                    <strong>{res.score}</strong>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${res.status === 'Pass' ? styles.pass : styles.fail}`}>
                      {res.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${perf}%` }}></div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}