import React from 'react';
import Button from '../../../../components/common/Button';

export const EditableSchedule = ({ 
  editableSchedule, 
  interviewers, 
  handleScheduleEdit, 
  onConfirm 
}) => {
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Edit Schedule</h3>
      {editableSchedule.map((day, dayIndex) => (
        <div key={dayIndex} className="mb-6">
          <h4 className="font-medium mb-2">
            {day.date.toLocaleDateString()}
          </h4>
          <div className="space-y-2">
            {day.interviews.map((interview, interviewIndex) => (
              <div key={interviewIndex} className="flex items-center justify-between border p-3 rounded">
                <div>
                  <input
                    type="time"
                    value={interview.startTime.toTimeString().slice(0,5)}
                    onChange={e => {
                      const [hours, minutes] = e.target.value.split(':');
                      const newStartTime = new Date(interview.startTime);
                      newStartTime.setHours(hours, minutes);
                      handleScheduleEdit(dayIndex, interviewIndex, {
                        ...interview,
                        startTime: newStartTime
                      });
                    }}
                    className="border rounded p-2"
                  />
                  <select
                    value={interview.interviewer}
                    onChange={e => handleScheduleEdit(dayIndex, interviewIndex, {
                      ...interview,
                      interviewer: e.target.value
                    })}
                    className="ml-2 border rounded p-1"
                  >
                    {interviewers.map(int => (
                      <option key={int.id} value={int.id}>
                        {int.name}
                      </option>
                    ))}
                  </select>
                  <span className="ml-2">Candidate: {interview.candidate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-4 flex justify-end">
        <Button
          onClick={onConfirm}
          variant="primary"
        >
          Confirm Schedule
        </Button>
      </div>
    </div>
  );
};
