import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Resume } from '@/types/resume';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 10,
    marginTop: 5,
    color: '#333',
  },
  contactItem: {
    marginRight: 10,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 8,
    paddingBottom: 2,
  },
  entry: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  entrySubtitle: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#444',
  },
  entryDate: {
    fontSize: 10,
  },
  entryDescription: {
    fontSize: 10,
    marginTop: 3,
    lineHeight: 1.4,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  skillList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    fontSize: 10,
    marginRight: 8,
    marginBottom: 4,
  }
});

const DefaultTheme = ({ data }: { data: Resume }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.fullName || 'Your Name'}</Text>
        <View style={styles.contactInfo}>
          {data.personalInfo.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
          {data.personalInfo.phone && <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>}
          {data.personalInfo.linkedin && <Text style={styles.contactItem}>LinkedIn: {data.personalInfo.linkedin}</Text>}
          {data.personalInfo.github && <Text style={styles.contactItem}>GitHub: {data.personalInfo.github}</Text>}
          {data.personalInfo.twitter && <Text style={styles.contactItem}>Twitter: {data.personalInfo.twitter}</Text>}
          {data.personalInfo.leetcode && <Text style={styles.contactItem}>LeetCode: {data.personalInfo.leetcode}</Text>}
          {data.personalInfo.codeforces && <Text style={styles.contactItem}>CodeForces: {data.personalInfo.codeforces}</Text>}
          {data.personalInfo.portfolio && <Text style={styles.contactItem}>{data.personalInfo.portfolio}</Text>}
        </View>
      </View>

      {/* Professional Summary */}
      {data.careerDetails.objective && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.text}>{data.careerDetails.objective}</Text>
        </View>
      )}

      {/* Experience */}
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

      {/* Education */}
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

      {/* Projects */}
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

      {/* Certifications */}
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

export default DefaultTheme;
