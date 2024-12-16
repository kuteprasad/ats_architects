import sequelize from '../config/db.js';
import Candidate from '../models/candidate.js';
import Recruiter from '../models/recruiter.js';
import Interviewer from '../models/interviewer.js';
import JobPosting from '../models/job_posting.js';
import Application from '../models/application.js';
import Interview from '../models/interview.js';
import Notification from '../models/notification.js';

// Relationships (if needed)
Recruiter.hasMany(Interviewer, { foreignKey: 'Recruiter_ID' });
Interviewer.belongsTo(Recruiter);

Candidate.hasMany(Application, { foreignKey: 'Candidate_ID' });
Application.belongsTo(Candidate);

JobPosting.hasMany(Application, { foreignKey: 'Job_Posting_ID' });
Application.belongsTo(JobPosting);

sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!');
  process.exit();
}).catch((err) => {
  console.error('Error creating database:', err);
  process.exit(1);
});

// node scripts/syncModels.js