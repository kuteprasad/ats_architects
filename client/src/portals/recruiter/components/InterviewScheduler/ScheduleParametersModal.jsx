import React from "react";
import Button from "../../../../components/common/Button";

export const ScheduleParametersModal = ({
  scheduleParams,
  setScheduleParams,
  onClose,
  onGenerate,
  isGenerating,
}) => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 1);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setScheduleParams((prev) => {
      if (prev.endDate && prev.endDate < newStartDate) {
        return {
          ...prev,
          startDate: newStartDate,
          endDate: newStartDate,
        };
      }
      return {
        ...prev,
        startDate: newStartDate,
      };
    });
    e.target.blur();
  };

  return (
    <div className="fixed top-16 right-0 bottom-0 z-50 flex justify-end bg-black bg-opacity-30">
      {/* Sidebar Drawer */}
      <div className="w-full sm:w-[450px] bg-white h-full shadow-lg overflow-y-auto p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl font-bold"
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold mb-6">Schedule Parameters</h3>

        <div className="space-y-5">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={scheduleParams.startDate}
              min={today.toISOString().split("T")[0]}
              max={maxDate.toISOString().split("T")[0]}
              onChange={handleStartDateChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={scheduleParams.endDate}
              min={scheduleParams.startDate || today.toISOString().split("T")[0]}
              max={maxDate.toISOString().split("T")[0]}
              onChange={(e) =>
                setScheduleParams((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
              className="w-full border rounded p-2"
            />
          </div>

          {/* Daily Start Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Daily Start Time</label>
            <input
              type="time"
              value={scheduleParams.dailyStartTime}
              onChange={(e) =>
                setScheduleParams((prev) => ({
                  ...prev,
                  dailyStartTime: e.target.value,
                }))
              }
              className="w-full border rounded p-2"
            />
          </div>

          {/* Daily End Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Daily End Time</label>
            <input
              type="time"
              value={scheduleParams.dailyEndTime}
              onChange={(e) =>
                setScheduleParams((prev) => ({
                  ...prev,
                  dailyEndTime: e.target.value,
                }))
              }
              className="w-full border rounded p-2"
            />
          </div>

          {/* Interview Duration */}
          <div>
            <label className="block text-sm font-medium mb-1">Interview Duration (minutes)</label>
            <input
              type="number"
              value={scheduleParams.interviewDuration}
              onChange={(e) =>
                setScheduleParams((prev) => ({
                  ...prev,
                  interviewDuration: parseInt(e.target.value),
                }))
              }
              className="w-full border rounded p-2"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={scheduleParams.skipWeekends}
              onChange={(e) =>
                setScheduleParams((prev) => ({
                  ...prev,
                  skipWeekends: e.target.checked,
                }))
              }
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium">Skip Weekends</span>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={scheduleParams.includeLunchBreak}
              onChange={(e) =>
                setScheduleParams((prev) => ({
                  ...prev,
                  includeLunchBreak: e.target.checked,
                }))
              }
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium">Include Lunch Break</span>
          </div>

          {/* Lunch Break Times */}
          {scheduleParams.includeLunchBreak && (
            <div className="ml-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Lunch Start Time</label>
                <input
                  type="time"
                  value={scheduleParams.lunchStartTime}
                  onChange={(e) =>
                    setScheduleParams((prev) => ({
                      ...prev,
                      lunchStartTime: e.target.value,
                    }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lunch End Time</label>
                <input
                  type="time"
                  value={scheduleParams.lunchEndTime}
                  onChange={(e) =>
                    setScheduleParams((prev) => ({
                      ...prev,
                      lunchEndTime: e.target.value,
                    }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={onGenerate}
            variant="primary"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </div>
            ) : (
              "Generate Schedule"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
