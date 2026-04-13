import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Times-Roman',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 10,
    color: '#333',
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 6,
    paddingBottom: 2,
  },
  entry: {
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  entrySubtitle: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  entryDate: {
    fontSize: 10,
  },
  entryDescription: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'justify',
  },
  text: {
    fontSize: 10,
    textAlign: 'justify',
  }
});

const ProfessionalTheme = ({ data }: { data: Resume }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.fullName || 'Your Name'}</Text>
        <Text style={styles.contactInfo}>
          {data.personalInfo.email && `${data.personalInfo.email} | `}
          {data.personalInfo.phone && `${data.personalInfo.phone} | `}
          {data.personalInfo.linkedin && `${data.personalInfo.linkedin} | `}
          {data.personalInfo.github && `${data.personalInfo.github}`}
        </Text>
        <Text style={styles.contactInfo}>
          {data.personalInfo.leetcode && `LeetCode: ${data.personalInfo.leetcode} | `}
          {data.personalInfo.codeforces && `CodeForces: ${data.personalInfo.codeforces}`}
        </Text>
      </View>

      {data.careerDetails.objective && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.text}>{data.careerDetails.objective}</Text>
        </View>
      )}

      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
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
          <Text style={styles.sectionTitle}>Projects</Text>
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

export default ProfessionalTheme;
