import React from 'react'
import { sortByDuration } from '../lib/chrono'
import { Timeline, TimelineItem } from './Timeline'
import './Education.css'

interface ExtracurricularActivity {
  organization: string
  role: string
  duration: string
  details?: string[]
}

interface Semester {
  term: string
  courses?: string[]
  note?: string
}

interface EducationData {
  institution: string
  location: string
  degree: string
  marks: string
  duration: string
  coursework?: string[]
  notes?: string[]
  semesters?: Semester[]
  extracurriculars?: ExtracurricularActivity[]
  art?: string
}

interface EducationProps {
  data: EducationData[]
}

const Education: React.FC<EducationProps> = ({ data }) => {
  const schools = sortByDuration(data, (school) => school.duration)

  return (
    <Timeline>
      {schools.map((education) => {
        const semesters = education.semesters
          ? sortByDuration(education.semesters, (semester) => semester.term)
          : []
        const extras = education.extracurriculars
          ? sortByDuration(education.extracurriculars, (activity) => activity.duration)
          : []

        return (
          <TimelineItem
            key={education.institution}
            when={education.duration.replace(' - ', '\n')}
            kind="school"
            art={education.art}
          >
            <h3 className="timeline-title">{education.institution}</h3>
            <p className="timeline-kicker">
              {education.degree} <span className="marks">· {education.marks}</span>
            </p>
            <p className="timeline-meta">{education.location}</p>

            {education.notes && education.notes.length > 0 && (
              <ul className="timeline-bullets">
                {education.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}

            {semesters.length > 0 && (
              <ol className="term-list">
                {semesters.map((semester) => (
                  <li key={semester.term} className="term-block">
                    <span className="term-name">{semester.term}</span>
                    {semester.note ? <p className="term-note">{semester.note}</p> : null}
                    {semester.courses && semester.courses.length > 0 && (
                      <ul className="term-courses">
                        {semester.courses.map((course) => (
                          <li key={course}>{course}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            )}

            {education.coursework && education.coursework.length > 0 && (
              <div className="coursework-section">
                <h4 className="coursework-heading">Coursework</h4>
                <ul className="term-courses">
                  {education.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </div>
            )}

            {extras.length > 0 && (
              <div className="extracurricular-section">
                <h4 className="extracurricular-heading">Extracurriculars</h4>
                <ol className="term-list">
                  {extras.map((activity) => (
                    <li key={`${activity.organization}-${activity.role}`} className="term-block">
                      <span className="term-name">{activity.duration}</span>
                      <p className="term-note">
                        <strong>{activity.role}</strong>
                        {activity.organization ? ` · ${activity.organization}` : ''}
                      </p>
                      {activity.details && activity.details.length > 0 && (
                        <ul className="timeline-bullets">
                          {activity.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </TimelineItem>
        )
      })}
    </Timeline>
  )
}

export default Education
