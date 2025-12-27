import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react';
import { Card, CardHeader, Badge } from '../../components/ui';

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'class' | 'office_hours' | 'meeting';
  time: string;
  endTime: string;
  location: string;
  color: string;
  students?: number;
}

const mockSchedule: Record<string, ScheduleEvent[]> = {
  Monday: [
    {
      id: '1',
      title: 'Mathematics I - Lecture',
      type: 'class',
      time: '09:00',
      endTime: '10:30',
      location: 'Room 101',
      color: 'bg-blue-500',
      students: 45,
    },
    {
      id: '2',
      title: 'Office Hours',
      type: 'office_hours',
      time: '14:00',
      endTime: '16:00',
      location: 'Office 305',
      color: 'bg-green-500',
    },
  ],
  Tuesday: [
    {
      id: '3',
      title: 'Physics I - Lab',
      type: 'class',
      time: '10:00',
      endTime: '12:00',
      location: 'Lab 2',
      color: 'bg-purple-500',
      students: 30,
    },
    {
      id: '4',
      title: 'Department Meeting',
      type: 'meeting',
      time: '14:00',
      endTime: '15:00',
      location: 'Conference Room A',
      color: 'bg-orange-500',
    },
  ],
  Wednesday: [
    {
      id: '5',
      title: 'Mathematics I - Tutorial',
      type: 'class',
      time: '09:00',
      endTime: '10:30',
      location: 'Room 102',
      color: 'bg-blue-500',
      students: 25,
    },
    {
      id: '6',
      title: 'Programming I - Lecture',
      type: 'class',
      time: '11:00',
      endTime: '12:30',
      location: 'Room 201',
      color: 'bg-red-500',
      students: 50,
    },
  ],
  Thursday: [
    {
      id: '7',
      title: 'Physics I - Lecture',
      type: 'class',
      time: '09:00',
      endTime: '10:30',
      location: 'Room 103',
      color: 'bg-purple-500',
      students: 55,
    },
    {
      id: '8',
      title: 'Office Hours',
      type: 'office_hours',
      time: '14:00',
      endTime: '16:00',
      location: 'Office 305',
      color: 'bg-green-500',
    },
  ],
  Friday: [
    {
      id: '9',
      title: 'Programming I - Lab',
      type: 'class',
      time: '10:00',
      endTime: '12:00',
      location: 'Lab 1',
      color: 'bg-red-500',
      students: 25,
    },
  ],
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function InstructorSchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const getWeekRange = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 4);

    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getTypeVariant = (type: string): 'info' | 'success' | 'warning' => {
    switch (type) {
      case 'class':
        return 'info';
      case 'office_hours':
        return 'success';
      case 'meeting':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teaching Schedule</h1>
          <p className="text-gray-500 mt-1">View your weekly teaching schedule</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium text-gray-900 min-w-[200px] text-center">
            {getWeekRange()}
          </span>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekly View */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((day) => (
          <Card key={day} padding="none">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">{day}</h3>
            </div>
            <div className="p-3 space-y-2 min-h-[300px]">
              {mockSchedule[day]?.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg text-white ${event.color}`}
                >
                  <p className="font-medium text-sm truncate">{event.title}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs opacity-90">
                    <Clock size={12} />
                    <span>{event.time} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs opacity-90">
                    <MapPin size={12} />
                    <span>{event.location}</span>
                  </div>
                  {event.students && (
                    <div className="flex items-center gap-1 mt-1 text-xs opacity-90">
                      <Users size={12} />
                      <span>{event.students} students</span>
                    </div>
                  )}
                </div>
              )) || (
                <p className="text-sm text-gray-400 text-center py-8">No classes</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Today's Detail */}
      <Card>
        <CardHeader title="Today's Schedule" subtitle="Detailed view of today's activities" />
        <div className="space-y-3">
          {mockSchedule.Monday?.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className={`w-1 h-16 rounded-full ${event.color}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <Badge variant={getTypeVariant(event.type)}>
                    {event.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{event.time} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                  {event.students && (
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{event.students} students</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
