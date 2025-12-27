import { useState } from 'react';
import { Search, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  instructorName: string;
  semester: string;
  year: number;
  students: number;
}

const mockCourses: Course[] = [
  { id: '1', code: 'MATH101', name: 'Mathematics I', credits: 4, department: 'Mathematics', instructorName: 'Dr. Smith', semester: 'Spring', year: 2025, students: 45 },
  { id: '2', code: 'PHYS101', name: 'Physics I', credits: 4, department: 'Physics', instructorName: 'Prof. Johnson', semester: 'Spring', year: 2025, students: 55 },
  { id: '3', code: 'CS101', name: 'Programming I', credits: 3, department: 'Computer Science', instructorName: 'Dr. Williams', semester: 'Spring', year: 2025, students: 50 },
  { id: '4', code: 'ENG101', name: 'English II', credits: 2, department: 'Languages', instructorName: 'Ms. Davis', semester: 'Spring', year: 2025, students: 60 },
  { id: '5', code: 'CHEM101', name: 'Chemistry I', credits: 4, department: 'Chemistry', instructorName: 'Dr. Brown', semester: 'Spring', year: 2025, students: 40 },
];

export function SecretaryCourses() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: 3,
    department: '',
    instructorName: '',
  });

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: String(courses.length + 1),
      code: formData.code,
      name: formData.name,
      credits: formData.credits,
      department: formData.department,
      instructorName: formData.instructorName,
      semester: 'Spring',
      year: 2025,
      students: 0,
    };
    setCourses([...courses, newCourse]);
    setShowAddModal(false);
    setFormData({ code: '', name: '', credits: 3, department: '', instructorName: '' });
    showToast('Course added successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 mt-1">Manage course catalog</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          Add Course
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <Badge variant="info">{filteredCourses.length} Courses</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <BookOpen size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-1">{course.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{course.code}</p>

            <div className="space-y-2 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Instructor</span>
                <span className="text-gray-900">{course.instructorName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Department</span>
                <span className="text-gray-900">{course.department}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Students</span>
                <span className="text-gray-900">{course.students}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Credits</span>
                <Badge variant="default">{course.credits}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Course Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Course"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Course Code"
              placeholder="e.g., MATH101"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <Input
              label="Credits"
              type="number"
              min="1"
              max="6"
              value={formData.credits.toString()}
              onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            />
          </div>
          <Input
            label="Course Name"
            placeholder="Enter course name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <option value="Chemistry">Chemistry</option>
              <option value="Languages">Languages</option>
            </select>
          </div>
          <Input
            label="Instructor Name"
            placeholder="Enter instructor name"
            value={formData.instructorName}
            onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
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
              onClick={handleAddCourse}
              className="flex-1"
              disabled={!formData.code || !formData.name || !formData.department}
            >
              Add Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
