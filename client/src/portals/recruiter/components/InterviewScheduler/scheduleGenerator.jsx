import api from "../../../../services/api";

export const generateInterviewSchedule = async (interviewers, candidates, params) => {
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
        // Format dates for Google Meet API
        const startDateTime = currentTime.toISOString();
        const endDateTime = new Date(currentTime.getTime() + params.interviewDuration * 60000).toISOString();
        
        // Create meeting for this interview slot
        try {
          const meetingResponse = await api.post('/google/create-meeting', {
            startDateTime,
            endDateTime,
            summary: `Interview with Candidate ${candidates[candidateIndex]}`
          });
  
          daySchedule.push({
            startTime: new Date(currentTime),
            endTime: new Date(currentTime.getTime() + params.interviewDuration * 60000),
            interviewer: interviewers[interviewerIndex],
            candidate: candidates[candidateIndex],
            meetingId: meetingResponse.data.meetingId,
            joinUrl: meetingResponse.data.joinUrl
          });
        } catch (error) {
          console.error('Failed to create meeting:', error);
          // Still add the interview slot without meeting details
          daySchedule.push({
            startTime: new Date(currentTime),
            endTime: new Date(currentTime.getTime() + params.interviewDuration * 60000),
            interviewer: interviewers[interviewerIndex],
            candidate: candidates[candidateIndex],
            meetingError: 'Failed to create meeting'
          });
        }
  
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