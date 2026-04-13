import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flexDirection: 'row',
    fontSize: 8,
    color: '#444',
    marginTop: 2,
    gap: 8,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: '#f1f5f9',
    padding: 2,
    marginBottom: 4,
  },
  entry: {
    marginBottom: 6,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryTitle: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  entrySubtitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#666',
  },
  entryDate: {
    fontSize: 8,
    color: '#666',
  },
  entryDescription: {
    fontSize: 8,
    marginTop: 1,
    lineHeight: 1.2,
  },
  text: {
    fontSize: 8,
    lineHeight: 1.2,
  }
});

const CompactTheme = ({ data }: { data: Resume }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.fullName || 'Your Name'}</Text>
        <View style={styles.contactInfo}>
          {data.personalInfo.email && <Text>{data.personalInfo.email}</Text>}
          {data.personalInfo.phone && <Text>{data.personalInfo.phone}</Text>}
          {data.personalInfo.linkedin && <Text>{data.personalInfo.linkedin}</Text>}
          {data.personalInfo.github && <Text>{data.personalInfo.github}</Text>}
        </View>
        <View style={styles.contactInfo}>
          {data.personalInfo.twitter && <Text>{data.personalInfo.twitter}</Text>}
          {data.personalInfo.leetcode && <Text>{data.personalInfo.leetcode}</Text>}
          {data.personalInfo.codeforces && <Text>{data.personalInfo.codeforces}</Text>}
        </View>
      </View>

      {data.careerDetails.objective && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
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

export default CompactTheme;
