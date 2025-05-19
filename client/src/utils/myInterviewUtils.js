
export const DEFAULT_RATINGS = {
  communicationScore: 0,
  technicalScore: 0,
  experienceScore: 0,
  problemSolvingScore: 0,
  culturalFitScore: 0,
  timeManagementScore: 0,
  overallScore: 0,
  cumulativeScore: 0
};

export const sortInterviews = (interviews) => {
  return interviews.sort((a, b) => {
    const dateA = new Date(`${a.interviewDate} ${a.interviewStartTime}`);
    const dateB = new Date(`${b.interviewDate} ${b.interviewStartTime}`);
    return dateA - dateB;
  });
};

export const getStatusColor = (status) => {
  const colors = {
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// export const isInterviewPast = (date, endTime) => {
//   try {
//     // Extract date part if it's in ISO format
//     const datePart = date.includes('T') ? date.split('T')[0] : date;
    
//     // Properly format date and time for consistent parsing
//     const dateTimeString = `${datePart}T${endTime}`;
//     const interviewEnd = new Date(dateTimeString);
    
//     // Check if the date is valid
//     if (isNaN(interviewEnd.getTime())) {
//       console.error('Invalid date created:', dateTimeString);
//       return false;
//     }
    
//     return interviewEnd < new Date();
//   } catch (err) {
//     console.error('Error comparing interview dates:', err);
//     return false;
//   }
// };

export const isInterviewPast = (interview) => {
  try {
    // Check if status is ACCEPTED or REJECTED
    if (interview.status === 'ACCEPTED' || interview.status === 'REJECTED') {
      return true;
    };

    // Extract date part if it's in ISO format
    const datePart = interview.interviewDate.includes('T') 
      ? interview.interviewDate.split('T')[0] 
      : interview.interviewDate;
    
    // Properly format date and time for consistent parsing
    const dateTimeString = `${datePart}T${interview.interviewEndTime}`;
    const interviewEnd = new Date(dateTimeString);
    
    // Check if the date is valid
    if (isNaN(interviewEnd.getTime())) {
      console.error('Invalid date created:', dateTimeString);
      return false;
    }
    
    return interviewEnd < new Date();
  } catch (err) {
    console.error('Error comparing interview dates:', err);
    return false;
  }
};

// export const filterInterviews = (interviews) => {
//   const current = interviews.filter(
//     interview => !isInterviewPast(interview.interviewDate, interview.interviewEndTime)
//   );
  
//   const past = interviews.filter(
//     interview => isInterviewPast(interview.interviewDate, interview.interviewEndTime)
//   );

//   return { current, past };
// };

export const calculateCumulativeScore = (ratings) => {
  return Object.values(ratings)
    .filter(score => typeof score === 'number')
    .reduce((sum, score) => sum + score, 0);
};

export const filterInterviews = (interviews) => {
  if (!Array.isArray(interviews) || interviews.length === 0) {
    return { current: [], past: [] };
  }

  const current = interviews.filter(interview => !isInterviewPast(interview));
  const past = interviews.filter(interview => isInterviewPast(interview));

  console.log('Filtering interviews:', {
    total: interviews.length,
    current: current.length,
    past: past.length,
    currentStatuses: current.map(i => i.status),
    pastStatuses: past.map(i => i.status)
  });

  return { current, past };
};

export const prepareInterviewFeedback = (interviewId, ratings, comments, userId) => {
  const cumulativeScore = calculateCumulativeScore(ratings);
  return {
    interviewId,
    ...ratings,
    cumulativeScore,
    comments,
    interviewerId: userId
  };
};

export const parseInterviewScores = (interview) => {
  return {
    communicationScore: Number(interview.scores.communicationScore) || 0,
    technicalScore: Number(interview.scores.technicalScore) || 0,
    experienceScore: Number(interview.scores.experienceScore) || 0,
    problemSolvingScore: Number(interview.scores.problemSolvingScore) || 0,
    culturalFitScore: Number(interview.scores.culturalFitScore) || 0,
    timeManagementScore: Number(interview.scores.timeManagementScore) || 0,
    overallScore: Number(interview.scores.overallScore) || 0,
    cumulativeScore: Number(interview.scores.cumulativeScore) || 0
  };
};