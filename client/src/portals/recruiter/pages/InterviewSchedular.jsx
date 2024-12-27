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
import { 
  toggleInterviewer, 
  handleScheduleEdit, 
  formatScheduleForAPI, 
  formatEmailData 
} from '../../../utils/InterviewSchedularUtils';
import { toast } from 'react-hot-toast';

const InterviewScheduler = () => {
  const location = useLocation();
  const [interviewers, setInterviewers] = useState([]);
  const [selectedInterviewers, setSelectedInterviewers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
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

  const handleInterviewerToggle = (interviewerId) => {
    setSelectedInterviewers(prev => toggleInterviewer(prev, interviewerId));
  };

  const handleScheduleGeneration = async () => {
    console.log("generate shedule clicked ")
    setIsGenerating(true);
    try {
      const selectedInterviewerIds = Object.keys(selectedInterviewers)
        .filter(id => selectedInterviewers[id]);

      if (!selectedInterviewerIds.length) {
        alert('Please select at least one interviewer');
        return;
      }
      
      const schedule = await generateInterviewSchedule(
        selectedInterviewerIds,
        selectedApplications,
        scheduleParams
      );

      setGeneratedSchedule(schedule);
      setEditableSchedule(schedule);
      setShowModal(false);
    } catch (error) {
      console.error("Schedule generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScheduleEditWrapper = (dayIndex, interviewIndex, updatedInterview) => {
    const newSchedule = handleScheduleEdit(
      editableSchedule, 
      dayIndex, 
      interviewIndex, 
      updatedInterview, 
      scheduleParams.interviewDuration
    );
    setEditableSchedule(newSchedule);
  };

  const handleConfirmSchedule = async (sendEmail) => {
    try {
      setConfirmLoading(true);
      const schedules = formatScheduleForAPI(editableSchedule, jobPostingId);
      const response = await api.post('/interviews/schedule', { schedules });
      
      if (sendEmail && response.data.success) {
        const emailDataArray = formatEmailData(response.data.schedules);
        const result = await sendInterviewScheduledEmail(emailDataArray);
        
        if (result.results.some(r => r.status === "invalid email")) {
          result.results
            .filter(r => r.status === "invalid email")
            .forEach(r => {
              console.log("Invalid email address:", r.email);
              toast.error(`Invalid email: ${r.email}`, {
                duration: 5000,
                position: 'top-right',
              });
            });
        } else {
          toast.success('Interviews scheduled and emails sent successfully', {
            duration: 5000,
            position: 'top-right',
          });
        }
      } else {
        toast.success('Interviews scheduled successfully', {
          duration: 5000,
          position: 'top-right',
        });
      }
      
      console.log('Interviews created:', response.data);
    } catch (error) {
      console.error('Error saving interviews:', error);
      toast.error('Failed to save interviews', {
        duration: 5000,
        position: 'top-right',
      });
    } finally {
      setConfirmLoading(false);
      setShowConfirmation(false);
    }
  };

  if (loading) return <Loading size="lg" text="Please wait..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Schedule Interviews</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <InterviewersList 
          interviewers={interviewers}
          selectedInterviewers={selectedInterviewers}
          toggleInterviewer={handleInterviewerToggle}
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
          onGenerate={handleScheduleGeneration}
          isGenerating={isGenerating}
        />
      )}

      {editableSchedule && editableSchedule.length > 0 && (
        <EditableSchedule
          editableSchedule={editableSchedule}
          interviewers={interviewers}
          handleScheduleEdit={handleScheduleEditWrapper}
          onConfirm={() => setShowConfirmation(true)}
        />
      )}

      {showConfirmation && (
        <ConfirmationModal
          onConfirm={handleConfirmSchedule}
          onCancel={() => setShowConfirmation(false)}
          confirmLoading={confirmLoading}
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