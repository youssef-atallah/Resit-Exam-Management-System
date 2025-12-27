import { useState } from 'react';
import { Search, Calendar, Clock, MapPin, Check, X, Eye } from 'lucide-react';
import { Card, CardHeader, Badge, Button, Input, Modal } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';

interface ResitApplication {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  examDate: string;
  examTime: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

const mockApplications: ResitApplication[] = [
  { id: '1', studentId: '20240001', studentName: 'John Doe', courseCode: 'MATH101', courseName: 'Mathematics I', examDate: '2025-01-15', examTime: '10:00', location: 'Room 101', status: 'pending', appliedAt: '2025-01-02' },
  { id: '2', studentId: '20240002', studentName: 'Jane Smith', courseCode: 'PHYS101', courseName: 'Physics I', examDate: '2025-01-16', examTime: '14:00', location: 'Room 203', status: 'pending', appliedAt: '2025-01-02' },
  { id: '3', studentId: '20240003', studentName: 'Bob Johnson', courseCode: 'CS101', courseName: 'Programming I', examDate: '2025-01-17', examTime: '09:00', location: 'Lab 1', status: 'approved', appliedAt: '2025-01-01' },
  { id: '4', studentId: '20240004', studentName: 'Alice Brown', courseCode: 'CHEM101', courseName: 'Chemistry I', examDate: '2025-01-18', examTime: '11:00', location: 'Room 302', status: 'rejected', appliedAt: '2025-01-01' },
];

export function SecretaryResitExams() {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<ResitApplication[]>(mockApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<ResitApplication | null>(null);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentId.includes(searchQuery) ||
      app.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'approved' as const } : app))
    );
    showToast('Application approved', 'success');
    setSelectedApp(null);
  };

  const handleReject = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'rejected' as const } : app))
    );
    showToast('Application rejected', 'error');
    setSelectedApp(null);
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resit Exam Applications</h1>
          <p className="text-gray-500 mt-1">Review and manage resit exam applications</p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="warning">{pendingCount} Pending</Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by student or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Student
                </th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Course
                </th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Exam Details
                </th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Applied
                </th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{app.studentName}</p>
                    <p className="text-sm text-gray-500">{app.studentId}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{app.courseName}</p>
                    <p className="text-sm text-gray-500">{app.courseCode}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{new Date(app.examDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        <span>{app.examTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{app.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={getStatusVariant(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {app.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprove(app.id)}
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReject(app.id)}
                          >
                            <X size={14} />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedApp(app)}
                      >
                        <Eye size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Application Details Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
      >
        {selectedApp && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {selectedApp.studentName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedApp.studentName}</p>
                  <p className="text-sm text-gray-500">{selectedApp.studentId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Course</span>
                <span className="font-medium text-gray-900">{selectedApp.courseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Course Code</span>
                <span className="font-medium text-gray-900">{selectedApp.courseCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Exam Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(selectedApp.examDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Exam Time</span>
                <span className="font-medium text-gray-900">{selectedApp.examTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="font-medium text-gray-900">{selectedApp.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Applied On</span>
                <span className="font-medium text-gray-900">
                  {new Date(selectedApp.appliedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <Badge variant={getStatusVariant(selectedApp.status)}>
                  {selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1)}
                </Badge>
              </div>
            </div>

            {selectedApp.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  variant="danger"
                  onClick={() => handleReject(selectedApp.id)}
                  className="flex-1"
                >
                  <X size={18} />
                  Reject
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleApprove(selectedApp.id)}
                  className="flex-1"
                >
                  <Check size={18} />
                  Approve
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
