import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Charts = ({ blogData, projectData }) => {
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Blog Views',
        data: blogData?.views || [65, 59, 80, 81, 56, 55, 40, 70, 85, 90, 95, 100],
        fill: true,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Blog Likes',
        data: blogData?.likes || [28, 48, 40, 19, 86, 27, 90, 45, 70, 65, 80, 85],
        fill: true,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: ['Web', 'Mobile', 'AI/ML', 'Other'],
    datasets: [
      {
        label: 'Projects by Category',
        data: projectData?.byCategory || [12, 5, 3, 2],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const pieChartData = {
    labels: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Soft Skills'],
    datasets: [
      {
        data: projectData?.skillsByCategory || [8, 6, 4, 3, 5, 4],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Blog Analytics</h3>
        <div className="h-80">
          <Line data={lineChartData} options={options} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Projects by Category</h3>
          <div className="h-64">
            <Bar data={barChartData} options={options} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Skills Distribution</h3>
          <div className="h-64">
            <Pie data={pieChartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;