import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Card, CardHeader, Badge } from '../../components/ui';

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'class' | 'exam' | 'deadline';
  time: string;
  endTime: string;
  location: string;
  color: string;
}

const mockSchedule: Record<string, ScheduleEvent[]> = {
  Monday: [
    {
      id: '1',
      title: 'Mathematics I',
      type: 'class',
      time: '09:00',
      endTime: '10:30',
      location: 'Room 101',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      title: 'Physics I',
      type: 'class',
      time: '11:00',
      endTime: '12:30',
      location: 'Room 203',
      color: 'bg-green-500',
    },
    {
      id: '3',
      title: 'Programming Lab',
      type: 'class',
      time: '14:00',
      endTime: '16:00',
      location: 'Lab 1',
      color: 'bg-purple-500',
    },
  ],
  Tuesday: [
    {
      id: '4',
      title: 'English II',
      type: 'class',
      time: '10:00',
      endTime: '11:30',
      location: 'Room 105',
      color: 'bg-orange-500',
    },
    {
      id: '5',
      title: 'Chemistry I',
      type: 'class',
      time: '13:00',
      endTime: '14:30',
      location: 'Room 302',
      color: 'bg-red-500',
    },
  ],
  Wednesday: [
    {
      id: '6',
      title: 'Mathematics I',
      type: 'class',
      time: '09:00',
      endTime: '10:30',
      location: 'Room 101',
      color: 'bg-blue-500',
    },
    {
      id: '7',
      title: 'Physics Lab',
      type: 'class',
      time: '14:00',
      endTime: '16:00',
      location: 'Lab 2',
      color: 'bg-green-500',
    },
  ],
  Thursday: [
    {
      id: '8',
      title: 'Programming I',
      type: 'class',
      time: '09:00',
      endTime: '10:30',
      location: 'Room 201',
      color: 'bg-purple-500',
    },
    {
      id: '9',
      title: 'English II',
      type: 'class',
      time: '11:00',
      endTime: '12:30',
      location: 'Room 105',
      color: 'bg-orange-500',
    },
  ],
  Friday: [
    {
      id: '10',
      title: 'Chemistry Lab',
      type: 'class',
      time: '10:00',
      endTime: '12:00',
      location: 'Lab 3',
      color: 'bg-red-500',
    },
  ],
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export function StudentSchedule() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Schedule</h1>
          <p className="text-gray-500 mt-1">View your weekly class schedule</p>
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

      {/* Calendar View */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-6 border-b border-gray-200">
              <div className="p-4 bg-gray-50 border-r border-gray-200">
                <span className="text-sm font-medium text-gray-500">Time</span>
              </div>
              {days.map((day) => (
                <div key={day} className="p-4 bg-gray-50 border-r border-gray-200 last:border-r-0">
                  <span className="text-sm font-medium text-gray-900">{day}</span>
                </div>
              ))}
            </div>

            {/* Time slots */}
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-6 border-b border-gray-100 last:border-b-0">
                <div className="p-3 border-r border-gray-100 text-sm text-gray-500">
                  {time}
                </div>
                {days.map((day) => {
                  const events = mockSchedule[day]?.filter((e) => e.time === time) || [];
                  return (
                    <div key={day} className="p-1 border-r border-gray-100 last:border-r-0 min-h-[60px]">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className={`
                            p-2 rounded-lg text-white text-xs
                            ${event.color}
                          `}
                        >
                          <p className="font-medium truncate">{event.title}</p>
                          <p className="opacity-80">{event.time} - {event.endTime}</p>
                          <p className="opacity-80">{event.location}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader title="Today's Classes" subtitle="Your schedule for today" />
        <div className="space-y-3">
          {mockSchedule.Monday?.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className={`w-1 h-16 rounded-full ${event.color}`} />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{event.time} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              <Badge variant="info">{event.type}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
