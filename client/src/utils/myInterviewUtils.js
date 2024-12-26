
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

export const isInterviewPast = (date, endTime) => {
  const interviewEnd = new Date(`${date} ${endTime}`);
  return interviewEnd < new Date();
};

export const filterInterviews = (interviews) => {
  const current = interviews.filter(
    interview => !isInterviewPast(interview.interviewDate, interview.interviewEndTime)
  );
  
  const past = interviews.filter(
    interview => isInterviewPast(interview.interviewDate, interview.interviewEndTime)
  );

  return { current, past };
};

export const calculateCumulativeScore = (ratings) => {
  return Object.values(ratings)
    .filter(score => typeof score === 'number')
    .reduce((sum, score) => sum + score, 0);
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