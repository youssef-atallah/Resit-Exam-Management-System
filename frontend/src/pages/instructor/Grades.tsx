import { useState } from 'react';
import { Search, Save, Download } from 'lucide-react';
import { Card, CardHeader, Badge, Button, Input } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';

interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  midterm: number | null;
  final: number | null;
  resit: number | null;
  letterGrade: string | null;
}

const mockStudents: StudentGrade[] = [
  { id: '1', studentId: '20240001', studentName: 'John Doe', midterm: 75, final: 68, resit: null, letterGrade: 'C+' },
  { id: '2', studentId: '20240002', studentName: 'Jane Smith', midterm: 88, final: 92, resit: null, letterGrade: 'A' },
  { id: '3', studentId: '20240003', studentName: 'Bob Johnson', midterm: 45, final: 38, resit: 55, letterGrade: 'D' },
  { id: '4', studentId: '20240004', studentName: 'Alice Brown', midterm: 92, final: 95, resit: null, letterGrade: 'A' },
  { id: '5', studentId: '20240005', studentName: 'Charlie Wilson', midterm: 55, final: 42, resit: null, letterGrade: 'F' },
];

const mockCourses = [
  { id: '1', code: 'MATH101', name: 'Mathematics I' },
  { id: '2', code: 'PHYS101', name: 'Physics I' },
  { id: '3', code: 'CS101', name: 'Programming I' },
];

export function InstructorGrades() {
  const { showToast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState(mockCourses[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentGrade[]>(mockStudents);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ midterm: string; final: string; resit: string }>({
    midterm: '',
    final: '',
    resit: '',
  });

  const filteredStudents = students.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.includes(searchQuery)
  );

  const handleEdit = (student: StudentGrade) => {
    setEditingId(student.id);
    setEditValues({
      midterm: student.midterm?.toString() || '',
      final: student.final?.toString() || '',
      resit: student.resit?.toString() || '',
    });
  };

  const handleSave = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              midterm: editValues.midterm ? parseInt(editValues.midterm) : null,
              final: editValues.final ? parseInt(editValues.final) : null,
              resit: editValues.resit ? parseInt(editValues.resit) : null,
            }
          : s
      )
    );
    setEditingId(null);
    showToast('Grade updated successfully', 'success');
  };

  const calculateLetterGrade = (midterm: number | null, final: number | null): string => {
    if (!midterm || !final) return '-';
    const avg = midterm * 0.4 + final * 0.6;
    if (avg >= 90) return 'A';
    if (avg >= 85) return 'A-';
    if (avg >= 80) return 'B+';
    if (avg >= 75) return 'B';
    if (avg >= 70) return 'B-';
    if (avg >= 65) return 'C+';
    if (avg >= 60) return 'C';
    if (avg >= 55) return 'C-';
    if (avg >= 50) return 'D';
    return 'F';
  };

  const getGradeVariant = (grade: string | null): 'success' | 'info' | 'warning' | 'danger' | 'default' => {
    if (!grade || grade === '-') return 'default';
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'info';
    if (grade.startsWith('C')) return 'warning';
    if (grade === 'F') return 'danger';
    return 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grade Management</h1>
          <p className="text-gray-500 mt-1">Enter and manage student grades</p>
        </div>
        <Button variant="secondary">
          <Download size={18} />
          Export Grades
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-64">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {mockCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Student
                </th>
                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Midterm (40%)
                </th>
                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Final (60%)
                </th>
                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Resit
                </th>
                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Grade
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
                    <p className="font-medium text-gray-900">{student.studentName}</p>
                    <p className="text-sm text-gray-500">{student.studentId}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {editingId === student.id ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editValues.midterm}
                        onChange={(e) => setEditValues({ ...editValues, midterm: e.target.value })}
                        className="w-20 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className={`font-medium ${
                        (student.midterm ?? 0) >= 50 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {student.midterm ?? '-'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {editingId === student.id ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editValues.final}
                        onChange={(e) => setEditValues({ ...editValues, final: e.target.value })}
                        className="w-20 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className={`font-medium ${
                        (student.final ?? 0) >= 50 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {student.final ?? '-'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {editingId === student.id ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editValues.resit}
                        onChange={(e) => setEditValues({ ...editValues, resit: e.target.value })}
                        className="w-20 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="font-medium">{student.resit ?? '-'}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Badge variant={getGradeVariant(student.letterGrade)}>
                      {student.letterGrade || calculateLetterGrade(student.midterm, student.final)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {editingId === student.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(student.id)}
                        >
                          <Save size={14} />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
