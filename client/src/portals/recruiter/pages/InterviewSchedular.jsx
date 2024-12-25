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
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { sendInterviewScheduledEmail } from '../../../services/emailService';

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
    skipWeekends: true,

    includeLunchBreak: true,
  lunchStartTime: '13:00',
  lunchEndTime: '14:00'

  });
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [editableSchedule, setEditableSchedule] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedApplications = location.state?.selectedApplications || [];
  const jobPostingId = location.state?.jobPostingId || 1;

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

  const handleScheduleGeneration = async () => {
    setIsGenerating(true);
    try {
      const selectedInterviewerIds = Object.keys(selectedInterviewers)
        .filter(id => selectedInterviewers[id]);

      console.log("requesting schedule generation");

      if (!selectedInterviewerIds.length) {
        alert('Please select at least one interviewer');
        return;
      }
      
      // console.log("2");
      const schedule = await generateInterviewSchedule(
        selectedInterviewerIds,
        selectedApplications,
        scheduleParams
      );
      // console.log("3");

      setGeneratedSchedule(schedule);
      // console.log("4");
      setEditableSchedule(schedule);
      // console.log("5");
      setShowModal(false);
    } catch (error) {
      console.error("Schedule generation error:", error);
    } finally {
      setIsGenerating(false);
    }
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

  const handleConfirmSchedule = async (sendEmail) => {
    try {
      const schedules = editableSchedule[0].interviews.map(schedule => ({
        applicationId: schedule.candidate,
        jobPostingId: jobPostingId,
        interviewerId: schedule.interviewer,
        startDateTime: schedule.startTime,
        endDateTime: schedule.endTime,
        meetingId: schedule.meetingId,
        joinUrl: schedule.joinUrl
      }));
  
      const response = await api.post('/interviews/schedule', { schedules });
      console.log("response from save interviews: ", response.data);
  
      if (sendEmail && response.data.success) {
        
        const emailDataArray = response.data.schedules.map(schedule => {
          // Format interviewDate
          const formattedDate = new Date(schedule.interviewDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        
          // Format interviewStartTime
          const [startHours, startMinutes, startSeconds] = schedule.interviewStartTime.split(':');
          const startTime = new Date();
          startTime.setHours(startHours, startMinutes, startSeconds);
          const formattedStartTime = startTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          });
        
          // Format interviewEndTime
          const [endHours, endMinutes, endSeconds] = schedule.interviewEndTime.split(':');
          const endTime = new Date();
          endTime.setHours(endHours, endMinutes, endSeconds);
          const formattedEndTime = endTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          });
        
          // Combine start and end times
          const formattedTimeRange = `${formattedStartTime} to ${formattedEndTime}`;
        
          return {
            candidateName: schedule.candidateName,
            email: schedule.candidateEmail,
            jobTitle: schedule.jobTitle,
            interviewDate: formattedDate,
            interviewTime: formattedTimeRange,
            meetingLink: schedule.joinUrl,
            meetingId: schedule.meetingId,
          };
        });
        
       const result = await sendInterviewScheduledEmail(emailDataArray);
       console.log("email sent: ", result);

       if (result.results.some(r => r.status === "invalid email")) {
        result.results
          .filter(r => r.status === "invalid email")
          .forEach(r => console.log("Invalid email address:", r.email));
      }}
  
      console.log('Interviews created:', response.data);
    } catch (error) {
      console.error('Error saving interviews:', error);
      alert('Failed to save interviews');
    } finally {
      setShowConfirmation(false);
    }
  };

  if (loading) return <Loading size="lg" text="Please wait..." />;
  if (error) {
    return <ErrorMessage message={error} />;
  }

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
          onGenerate={async () => {  // Add async here
            await handleScheduleGeneration();  // Add await here
            setShowModal(false);
          }}
          isGenerating={isGenerating}

        />
      )}

{editableSchedule && editableSchedule.length > 0 && (
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

{generatedSchedule && generatedSchedule.length > 0 && (
  <GeneratedSchedule 
    schedule={generatedSchedule} 
  />
)}
    </div>
  );
};

export default InterviewScheduler;