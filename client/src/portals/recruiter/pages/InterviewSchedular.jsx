import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../services/api';
import Button from '../../../components/common/Button';

const InterviewSchedular = () => {
  const location = useLocation();
  const [interviewers, setInterviewers] = useState([]);
  const [selectedInterviewers, setSelectedInterviewers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [scheduleParams, setScheduleParams] = useState({
    startDate: '',
    endDate: '',
    dailyStartTime: '10:00',
    dailyEndTime: '17:00',
    interviewDuration: 45,
    skipWeekends: true
  });
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [editableSchedule, setEditableSchedule] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const selectedApplications = location.state?.selectedApplications || [];

  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await api.get('/auth/interviewers');
        const fetchedInterviewers = response.data.interviewers;
        setInterviewers(fetchedInterviewers);
        
        // Initialize all interviewers as selected
        const initialSelected = fetchedInterviewers.reduce((acc, interviewer) => {
          acc[interviewer.id] = true;
          return acc;
        }, {});
        setSelectedInterviewers(initialSelected);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch interviewers');
        setLoading(false);
      }
    };
    fetchInterviewers();
  }, []);

  const toggleInterviewer = (interviewerId) => {
    setSelectedInterviewers(prev => ({
      ...prev,
      [interviewerId]: !prev[interviewerId]
    }));
  };

  const handleScheduleGeneration = () => {
    const selectedInterviewerIds = Object.keys(selectedInterviewers)
      .filter(id => selectedInterviewers[id]);

    if (!selectedInterviewerIds.length) {
      alert('Please select at least one interviewer');
      return;
    }

    const schedule = generateInterviewSchedule(
      selectedInterviewerIds,
      selectedApplications,
      scheduleParams
    );
    
    setGeneratedSchedule(schedule);
    setEditableSchedule(schedule);
  };

  const generateInterviewSchedule = (interviewers, candidates, params) => {
    const schedule = [];
    let currentDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    let candidateIndex = 0;
    let interviewerIndex = 0;

    while (currentDate <= endDate && candidateIndex < candidates.length) {
      if (params.skipWeekends && (currentDate.getDay() === 0 || currentDate.getDay() === 6)) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      const daySchedule = [];
      const [startHour, startMinute] = params.dailyStartTime.split(':');
      const [endHour, endMinute] = params.dailyEndTime.split(':');
      
      let currentTime = new Date(currentDate.setHours(startHour, startMinute));
      const endTime = new Date(currentDate.setHours(endHour, endMinute));

      while (currentTime < endTime && candidateIndex < candidates.length) {
        daySchedule.push({
          startTime: new Date(currentTime),
          endTime: new Date(currentTime.getTime() + params.interviewDuration * 60000),
          interviewer: interviewers[interviewerIndex],
          candidate: candidates[candidateIndex]
        });

        currentTime = new Date(currentTime.getTime() + params.interviewDuration * 60000);
        candidateIndex++;
        interviewerIndex = (interviewerIndex + 1) % interviewers.length;
      }

      if (daySchedule.length > 0) {
        schedule.push({ date: new Date(currentDate), interviews: daySchedule });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedule;
  };

  const handleScheduleEdit = (dayIndex, interviewIndex, updatedInterview) => {
    const newSchedule = [...editableSchedule];
    const startTime = new Date(updatedInterview.startTime);
    
    // Calculate end time based on interview duration
    const endTime = new Date(startTime.getTime() + scheduleParams.interviewDuration * 60000);
    
    newSchedule[dayIndex].interviews[interviewIndex] = {
      ...updatedInterview,
      startTime: startTime,
      endTime: endTime
    };
    
    setEditableSchedule(newSchedule);
  };

  const handleConfirmSchedule = () => {
    console.log('Final Schedule:', editableSchedule);
    // TODO: Send to backend
    setShowConfirmation(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Schedule Interviews</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel - Interviewers */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Available Interviewers</h2>
          <div className="space-y-2">
            {interviewers.map(interviewer => (
              <div 
                key={interviewer.id}
                className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{interviewer.name}</p>
                  <p className="text-sm text-gray-600">{interviewer.email}</p>
                </div>
                <Button
                  onClick={() => toggleInterviewer(interviewer.id)}
                  variant={selectedInterviewers[interviewer.id] ? "primary" : "secondary"}
                  size="sm"
                >
                  {selectedInterviewers[interviewer.id] ? 'Selected' : 'Select'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Selected Candidates */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Selected Candidates</h2>
          <div className="space-y-2">
            {selectedApplications.map(appId => (
              <div 
                key={appId}
                className="p-3 border rounded"
              >
                <p className="font-medium">Application ID: {appId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={() => setShowModal(true)}
        variant="primary"
        className="mt-6"
      >
        Generate Schedule
      </Button>

      {showModal && (
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
                onClick={() => setShowModal(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleScheduleGeneration();
                  setShowModal(false);
                }}
                variant="primary"
              >
                Generate
              </Button>
            </div>
          </div>
        </div>
      )}

      {editableSchedule && (
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
              onClick={() => setShowConfirmation(true)}
              variant="primary"
            >
              Confirm Schedule
            </Button>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Schedule</h3>
            <p>Are you sure you want to confirm this interview schedule?</p>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSchedule}
                variant="primary"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {generatedSchedule && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Generated Schedule</h3>
          {generatedSchedule.map((day, index) => (
            <div key={index} className="mb-6">
              <h4 className="font-medium mb-2">
                {day.date.toLocaleDateString()}
              </h4>
              <div className="space-y-2">
                {day.interviews.map((interview, idx) => (
                  <div key={idx} className="flex items-center justify-between border p-3 rounded">
                    <div>
                      <p>Time: {interview.startTime.toLocaleTimeString()} - {interview.endTime.toLocaleTimeString()}</p>
                      <p>Interviewer ID: {interview.interviewer}</p>
                      <p>Candidate ID: {interview.candidate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewSchedular;