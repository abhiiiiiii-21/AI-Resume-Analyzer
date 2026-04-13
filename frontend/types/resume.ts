export interface Resume {
  id: string;
  personalInfo: PersonalInfo;
  careerDetails: CareerDetails;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  portfolio: string;
  linkedin: string;
  github: string;
  twitter: string;
  leetcode: string;
  codeforces: string;
}

export interface CareerDetails {
  objective: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface Project {
  id: string;
  name: string;
  date: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}
