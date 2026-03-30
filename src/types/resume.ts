export type ResumeContent = {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }>;
  education: Array<{
    school: string;
    program: string;
    startDate: string;
    endDate: string;
    details: string;
  }>;
  skills: string[];
};

export type ResumeRecord = {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  language: string;
  content_json: ResumeContent;
  created_at: string;
  updated_at: string;
};
