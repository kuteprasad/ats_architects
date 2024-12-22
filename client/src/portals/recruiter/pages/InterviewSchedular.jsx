import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../services/api';
import Button from '../../../components/common/Button';
import { InterviewersList } from '../components/InterviewScheduler/InterviewersList';
import { CandidatesList } from '../components/InterviewScheduler/CandidatesList';
import { ScheduleParametersModal } from '../components/InterviewScheduler/ScheduleParametersModal';
import { ConfirmationModal } from '../components/InterviewScheduler/ConfirmationModal';
import { EditableSchedule } from '../components/InterviewScheduler/EditableSchedule';
import { GeneratedSchedule } from '../components/InterviewScheduler/GeneratedSchedule';
import { generateInterviewSchedule } from '../components/InterviewScheduler/scheduleGenerator';

const InterviewScheduler = () => {
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

  const handleScheduleEdit = (dayIndex, interviewIndex, updatedInterview) => {
    const newSchedule = [...editableSchedule];
    const startTime = new Date(updatedInterview.startTime);
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
        <InterviewersList 
          interviewers={interviewers}
          selectedInterviewers={selectedInterviewers}
          toggleInterviewer={toggleInterviewer}
        />
        <CandidatesList selectedApplications={selectedApplications} />
      </div>

      <Button
        onClick={() => setShowModal(true)}
        variant="primary"
        className="mt-6"
      >
        Generate Schedule
      </Button>

      {showModal && (
        <ScheduleParametersModal
          scheduleParams={scheduleParams}
          setScheduleParams={setScheduleParams}
          onClose={() => setShowModal(false)}
          onGenerate={() => {
            handleScheduleGeneration();
            setShowModal(false);
          }}
        />
      )}

      {editableSchedule && (
        <EditableSchedule
         
            editableSchedule={editableSchedule}
          interviewers={interviewers}
          handleScheduleEdit={handleScheduleEdit}
          onConfirm={() => setShowConfirmation(true)}
        />
      )}

      {showConfirmation && (
        <ConfirmationModal
          onConfirm={handleConfirmSchedule}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {generatedSchedule && (
        <GeneratedSchedule schedule={generatedSchedule} />
      )}
    </div>
  );
};

export default InterviewScheduler;