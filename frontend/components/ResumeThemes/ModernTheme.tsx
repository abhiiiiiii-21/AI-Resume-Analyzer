import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 25,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af', // Blue accent
  },
  contactInfo: {
    flexDirection: 'row',
    fontSize: 9,
    marginTop: 5,
    color: '#64748b',
    gap: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 10,
    paddingBottom: 4,
  },
  entry: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  entryDate: {
    fontSize: 9,
    color: '#64748b',
  },
  entryDescription: {
    fontSize: 9,
    marginTop: 4,
    color: '#475569',
    lineHeight: 1.5,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#475569',
  }
});

const ModernTheme = ({ data }: { data: Resume }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.fullName || 'Your Name'}</Text>
        <View style={styles.contactInfo}>
          {data.personalInfo.email && <Text>{data.personalInfo.email}</Text>}
          {data.personalInfo.phone && <Text>{data.personalInfo.phone}</Text>}
          {data.personalInfo.linkedin && <Text>{data.personalInfo.linkedin}</Text>}
          {data.personalInfo.github && <Text>{data.personalInfo.github}</Text>}
          {data.personalInfo.twitter && <Text>{data.personalInfo.twitter}</Text>}
          {data.personalInfo.leetcode && <Text>{data.personalInfo.leetcode}</Text>}
        </View>
      </View>

      {data.careerDetails.objective && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.text}>{data.careerDetails.objective}</Text>
        </View>
      )}

      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{exp.jobTitle}</Text>
                <Text style={styles.entryDate}>{exp.duration}</Text>
              </View>
              <Text style={styles.entrySubtitle}>{exp.company}</Text>
              <Text style={styles.entryDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{edu.degree}</Text>
                <Text style={styles.entryDate}>{edu.year}</Text>
              </View>
              <Text style={styles.entrySubtitle}>{edu.institution}</Text>
            </View>
          ))}
        </View>
      )}

      {data.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Side Projects</Text>
          {data.projects.map((proj) => (
            <View key={proj.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{proj.name}</Text>
                <Text style={styles.entryDate}>{proj.date}</Text>
              </View>
              <Text style={styles.entryDescription}>{proj.description}</Text>
            </View>
          ))}
        </View>
      )}

      {data.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {data.certifications.map((cert) => (
            <View key={cert.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{cert.name}</Text>
                <Text style={styles.entryDate}>{cert.date}</Text>
              </View>
              <Text style={styles.entrySubtitle}>{cert.issuer}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export default ModernTheme;
