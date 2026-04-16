"use client";

import React from "react";
import { Resume } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/Buttons/button";
import { Plus, Trash2, User, Briefcase, GraduationCap, Code, Award } from "lucide-react";

interface ResumeFormProps {
  data: Resume;
  onChange: (data: Resume) => void;
}

const FormSection = ({ title, icon: Icon, children, action }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 transition-colors duration-300">
      <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-200">
        <Icon className="w-5 h-5 text-[#1C4ED6] dark:text-blue-500" />
        <h3 className="font-semibold text-lg font-manrope">{title}</h3>
      </div>
      {action && action}
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const updateCareerDetails = (value: string) => {
    onChange({
      ...data,
      careerDetails: { objective: value },
    });
  };

  const addItem = (section: keyof Resume, newItem: any) => {
    const currentItems = data[section] as any[];
    onChange({
      ...data,
      [section]: [...currentItems, { ...newItem, id: Math.random().toString(36).substr(2, 9) }],
    });
  };

  const removeItem = (section: keyof Resume, id: string) => {
    const currentItems = data[section] as any[];
    onChange({
      ...data,
      [section]: currentItems.filter((item) => item.id !== id),
    });
  };

  const updateItem = (section: keyof Resume, id: string, field: string, value: string) => {
    const currentItems = data[section] as any[];
    onChange({
      ...data,
      [section]: currentItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    });
  };

  // Adaptive Styles
  const inputClass = "bg-white dark:bg-black border-neutral-300 dark:border-neutral-800 focus-visible:ring-1 focus-visible:ring-[#1C4ED6] dark:focus-visible:ring-blue-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 rounded-lg min-h-[44px] transition-colors duration-300";
  const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1.5 block font-inter";
  const dashedBtnClass = "w-full border-dashed border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-600 dark:text-neutral-400 transition-all py-6 text-sm font-medium rounded-xl";
  const entryCardClass = "space-y-4 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/50 relative group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700";

  return (
    <div className="space-y-12 pb-10 font-inter">

      {/* 1. Personal Information */}
      <FormSection title="Personal Information" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-6">
          <div>
            <Label className={labelClass}>Full Name</Label>
            <Input
              value={data.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
              placeholder="e.g. John Doe"
              className={inputClass}
            />
          </div>
          <div>
            <Label className={labelClass}>Email Address</Label>
            <Input
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
              placeholder="john@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <Label className={labelClass}>Phone Number</Label>
            <Input
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={inputClass}
            />
          </div>
          <div>
            <Label className={labelClass}>Personal Portfolio</Label>
            <Input
              value={data.personalInfo.portfolio}
              onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
              placeholder="https://portfolio.com"
              className={inputClass}
            />
          </div>
          <div>
            <Label className={labelClass}>LinkedIn Username</Label>
            <Input
              value={data.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
              placeholder="johndoe"
              className={inputClass}
            />
          </div>
          <div>
            <Label className={labelClass}>GitHub Username</Label>
            <Input
              value={data.personalInfo.github}
              onChange={(e) => updatePersonalInfo("github", e.target.value)}
              placeholder="johndoe"
              className={inputClass}
            />
          </div>
          <div>
            <Label className={labelClass}>Twitter / X</Label>
            <Input
              value={data.personalInfo.twitter}
              onChange={(e) => updatePersonalInfo("twitter", e.target.value)}
              placeholder="@johndoe"
              className={inputClass}
            />
          </div>
          <div>
            <Label className={labelClass}>LeetCode Profile</Label>
            <Input
              value={data.personalInfo.leetcode}
              onChange={(e) => updatePersonalInfo("leetcode", e.target.value)}
              placeholder="leetcode.com/johndoe"
              className={inputClass}
            />
          </div>
        </div>
      </FormSection>

      {/* 2. Career Details */}
      <FormSection title="Professional Summary" icon={Code}>
        <div>
          <Label className={labelClass}>Objective / Summary</Label>
          <Textarea
            value={data.careerDetails.objective}
            onChange={(e) => updateCareerDetails(e.target.value)}
            placeholder="A brief overview of your professional background and goals..."
            className={`${inputClass} min-h-[140px] resize-y`}
          />
        </div>
      </FormSection>

      {/* 3. Work Experience */}
      <FormSection title="Work Experience" icon={Briefcase}>
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id} className={entryCardClass}>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-400/10"
                onClick={() => removeItem("experience", exp.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 pr-8">
                <div>
                  <Label className={labelClass}>Job Title</Label>
                  <Input
                    value={exp.jobTitle}
                    onChange={(e) => updateItem("experience", exp.id, "jobTitle", e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label className={labelClass}>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateItem("experience", exp.id, "company", e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className={labelClass}>Duration</Label>
                  <Input
                    value={exp.duration}
                    onChange={(e) => updateItem("experience", exp.id, "duration", e.target.value)}
                    placeholder="e.g. Jan 2021 - Present"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className={labelClass}>Description & Achievements</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateItem("experience", exp.id, "description", e.target.value)}
                    placeholder="Describe your impact..."
                    className={`${inputClass} min-h-[120px]`}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => addItem("experience", { jobTitle: "", company: "", duration: "", description: "" })}
            className={dashedBtnClass}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Work Experience
          </Button>
        </div>
      </FormSection>

      {/* 4. Academic Qualifications */}
      <FormSection title="Education" icon={GraduationCap}>
        <div className="space-y-6">
          {data.education.map((edu) => (
            <div key={edu.id} className={entryCardClass}>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-400/10"
                onClick={() => removeItem("education", edu.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 pr-8">
                <div>
                  <Label className={labelClass}>Degree / Program</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateItem("education", edu.id, "degree", e.target.value)}
                    placeholder="e.g. B.S. Computer Science"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label className={labelClass}>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateItem("education", edu.id, "institution", e.target.value)}
                    placeholder="e.g. Stanford University"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className={labelClass}>Graduation Year</Label>
                  <Input
                    value={edu.year}
                    onChange={(e) => updateItem("education", edu.id, "year", e.target.value)}
                    placeholder="e.g. 2024"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => addItem("education", { degree: "", institution: "", year: "" })}
            className={dashedBtnClass}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Education
          </Button>
        </div>
      </FormSection>

      {/* 5. Projects */}
      <FormSection title="Projects" icon={Code}>
        <div className="space-y-6">
          {data.projects.map((proj) => (
            <div key={proj.id} className={entryCardClass}>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-400/10"
                onClick={() => removeItem("projects", proj.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 pr-8">
                <div>
                  <Label className={labelClass}>Project Name</Label>
                  <Input
                    value={proj.name}
                    onChange={(e) => updateItem("projects", proj.id, "name", e.target.value)}
                    placeholder="e.g. E-Commerce Platform"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label className={labelClass}>Duration / Date</Label>
                  <Input
                    value={proj.date}
                    onChange={(e) => updateItem("projects", proj.id, "date", e.target.value)}
                    placeholder="e.g. Fall 2023"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className={labelClass}>Project Description</Label>
                  <Textarea
                    value={proj.description}
                    onChange={(e) => updateItem("projects", proj.id, "description", e.target.value)}
                    placeholder="Describe technologies used and problems solved..."
                    className={`${inputClass} min-h-[100px]`}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => addItem("projects", { name: "", date: "", description: "" })}
            className={dashedBtnClass}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        </div>
      </FormSection>

      {/* 6. Certifications */}
      <FormSection title="Licenses & Certifications" icon={Award}>
        <div className="space-y-6">
          {data.certifications.map((cert) => (
            <div key={cert.id} className={entryCardClass}>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-400/10"
                onClick={() => removeItem("certifications", cert.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 pr-8">
                <div>
                  <Label className={labelClass}>Certification Title</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateItem("certifications", cert.id, "name", e.target.value)}
                    placeholder="e.g. AWS Certified Developer"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label className={labelClass}>Issuing Organization</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateItem("certifications", cert.id, "issuer", e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className={labelClass}>Issue Date</Label>
                  <Input
                    value={cert.date}
                    onChange={(e) => updateItem("certifications", cert.id, "date", e.target.value)}
                    placeholder="e.g. August 2023"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => addItem("certifications", { name: "", issuer: "", date: "" })}
            className={dashedBtnClass}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Certification
          </Button>
        </div>
      </FormSection>
    </div>
  );
}
