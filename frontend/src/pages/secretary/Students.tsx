import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';

interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  enrollmentYear: number;
  status: 'active' | 'inactive' | 'graduated';
}

const mockStudents: Student[] = [
  { id: '1', studentId: '20240001', name: 'John Doe', email: 'john.doe@uskudar.edu.tr', department: 'Computer Science', enrollmentYear: 2024, status: 'active' },
  { id: '2', studentId: '20240002', name: 'Jane Smith', email: 'jane.smith@uskudar.edu.tr', department: 'Engineering', enrollmentYear: 2024, status: 'active' },
  { id: '3', studentId: '20230015', name: 'Bob Johnson', email: 'bob.johnson@uskudar.edu.tr', department: 'Mathematics', enrollmentYear: 2023, status: 'active' },
  { id: '4', studentId: '20220042', name: 'Alice Brown', email: 'alice.brown@uskudar.edu.tr', department: 'Physics', enrollmentYear: 2022, status: 'inactive' },
  { id: '5', studentId: '20210108', name: 'Charlie Wilson', email: 'charlie.wilson@uskudar.edu.tr', department: 'Computer Science', enrollmentYear: 2021, status: 'graduated' },
];

export function SecretaryStudents() {
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    enrollmentYear: new Date().getFullYear(),
  });

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.includes(searchQuery) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = () => {
    const newStudent: Student = {
      id: String(students.length + 1),
      studentId: `2024${String(students.length + 1).padStart(4, '0')}`,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      enrollmentYear: formData.enrollmentYear,
      status: 'active',
    };
    setStudents([...students, newStudent]);
    setShowAddModal(false);
    setFormData({ name: '', email: '', department: '', enrollmentYear: new Date().getFullYear() });
    showToast('Student added successfully', 'success');
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">Manage student records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Upload size={18} />
            Import
          </Button>
          <Button variant="secondary">
            <Download size={18} />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Student
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <Badge variant="info">{filteredStudents.length} Students</Badge>
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
                  Student ID
                </th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Department
                </th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Enrollment
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
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{student.studentId}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{student.department}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{student.enrollmentYear}</td>
                  <td className="py-4 px-6">
                    <Badge variant={getStatusVariant(student.status)}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter student's full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
          <Input
            label="Enrollment Year"
            type="number"
            value={formData.enrollmentYear.toString()}
            onChange={(e) => setFormData({ ...formData, enrollmentYear: parseInt(e.target.value) })}
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStudent}
              className="flex-1"
              disabled={!formData.name || !formData.email || !formData.department}
            >
              Add Student
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
