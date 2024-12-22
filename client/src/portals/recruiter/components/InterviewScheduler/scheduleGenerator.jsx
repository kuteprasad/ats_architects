export const generateInterviewSchedule = (interviewers, candidates, params) => {
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
  