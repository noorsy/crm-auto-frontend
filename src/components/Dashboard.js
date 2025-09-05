import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import {
  UserGroupIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { getDashboardStats, loading, error } = useApi();
  const [stats, setStats] = useState({
    total_customers: 0,
    total_loans: 0,
    active_loans: 0,
    past_due_loans: 0,
    total_portfolio: 0,
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  };

  const statCards = [
    {
      name: 'Total Customers',
      value: stats.total_customers.toLocaleString(),
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Loans',
      value: stats.active_loans.toLocaleString(),
      icon: CreditCardIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Past Due Loans',
      value: stats.past_due_loans.toLocaleString(),
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Total Portfolio',
      value: `$${stats.total_portfolio.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="lg:ml-64">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-700">
              Overview of your auto credit portfolio performance
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${item.color} rounded-md flex items-center justify-center`}>
                      <item.icon className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                      <dd className="text-lg font-medium text-gray-900">{item.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Portfolio Health */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Portfolio Health</h3>
              <div className="mt-5">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Performing Loans</span>
                      <span className="font-medium">
                        {stats.total_loans > 0 
                          ? ((stats.active_loans / stats.total_loans) * 100).toFixed(1)
                          : 0
                        }%
                      </span>
                    </div>
                    <div className="mt-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: stats.total_loans > 0 
                            ? `${(stats.active_loans / stats.total_loans) * 100}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Past Due Loans</span>
                      <span className="font-medium">
                        {stats.total_loans > 0 
                          ? ((stats.past_due_loans / stats.total_loans) * 100).toFixed(1)
                          : 0
                        }%
                      </span>
                    </div>
                    <div className="mt-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: stats.total_loans > 0 
                            ? `${(stats.past_due_loans / stats.total_loans) * 100}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
              <div className="mt-5 space-y-3">
                <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Add New Customer
                </button>
                <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Process Payment
                </button>
                <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 