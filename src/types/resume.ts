export type ResumePersonal = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
};

export type ResumeExperienceItem = {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type ResumeEducationItem = {
  school: string;
  program: string;
  startDate: string;
  endDate: string;
  details: string;
};

export type ResumeLanguageItem = {
  name: string;
  level: string;
};

export type ResumeCertificationItem = {
  name: string;
  issuer: string;
  year: string;
};

export type ResumeContent = {
  personal: ResumePersonal;
  summary: string;
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  skills: string[];
  languages: ResumeLanguageItem[];
  certifications: ResumeCertificationItem[];
};

export type ResumeRecord = {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  content_json: ResumeContent;
  created_at?: string;
  updated_at?: string;
};
