// interviewSchedulerUtils.js

export const toggleInterviewer = (prevSelected, interviewerId) => ({
  ...prevSelected,
  [interviewerId]: !prevSelected[interviewerId]
});

export const handleScheduleEdit = (editableSchedule, dayIndex, interviewIndex, updatedInterview, interviewDuration) => {
  const newSchedule = [...editableSchedule];
  const startTime = new Date(updatedInterview.startTime);
  const endTime = new Date(startTime.getTime() + interviewDuration * 60000);
  
  newSchedule[dayIndex].interviews[interviewIndex] = {
    ...updatedInterview,
    startTime: startTime,
    endTime: endTime
  };
  
  return newSchedule;
};

export const formatScheduleForAPI = (editableSchedule, jobPostingId) => {
  return editableSchedule[0].interviews.map(schedule => ({
    applicationId: schedule.candidate,
    jobPostingId: jobPostingId,
    interviewerId: schedule.interviewer,
    startDateTime: schedule.startTime,
    endDateTime: schedule.endTime,
    meetingId: schedule.meetingId,
    joinUrl: schedule.joinUrl
  }));
};

export const formatEmailData = (schedules) => {
  return schedules.map(schedule => {
    const formattedDate = new Date(schedule.interviewDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  
    const [startHours, startMinutes, startSeconds] = schedule.interviewStartTime.split(':');
    const startTime = new Date();
    startTime.setHours(startHours, startMinutes, startSeconds);
    const formattedStartTime = startTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  
    const [endHours, endMinutes, endSeconds] = schedule.interviewEndTime.split(':');
    const endTime = new Date();
    endTime.setHours(endHours, endMinutes, endSeconds);
    const formattedEndTime = endTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  
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
};