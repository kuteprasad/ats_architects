import React from 'react';
import Button from '../../../../components/common/Button';

export const ScheduleParametersModal = ({ 
  scheduleParams, 
  setScheduleParams, 
  onClose, 
  onGenerate 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Schedule Parameters</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={scheduleParams.startDate}
              onChange={e => setScheduleParams(prev => ({
                ...prev,
                startDate: e.target.value
              }))}
              className="w-full border rounded p-2"
            />
          </div>


          <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={scheduleParams.endDate}
                  onChange={e => setScheduleParams(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Daily Start Time</label>
                <input
                  type="time"
                  value={scheduleParams.dailyStartTime}
                  onChange={e => setScheduleParams(prev => ({
                    ...prev,
                    dailyStartTime: e.target.value
                  }))}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Daily End Time</label>
                <input
                  type="time"
                  value={scheduleParams.dailyEndTime}
                  onChange={e => setScheduleParams(prev => ({
                    ...prev,
                    dailyEndTime: e.target.value
                  }))}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Interview Duration (minutes)</label>
                <input
                  type="number"
                  value={scheduleParams.interviewDuration}
                  onChange={e => setScheduleParams(prev => ({
                    ...prev,
                    interviewDuration: parseInt(e.target.value)
                  }))}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={scheduleParams.skipWeekends}
                onChange={e => setScheduleParams(prev => ({
                  ...prev,
                  skipWeekends: e.target.checked
                }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium">Skip Weekends</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={onGenerate}
            variant="primary"
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
};