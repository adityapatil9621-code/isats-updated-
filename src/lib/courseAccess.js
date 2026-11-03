// Topics a 10th-pass student may see in the Laser program.
// Add more exact syllabus names here (e.g. 'Pre / Post Care') to widen it.
const TENTH_LASER_TOPICS = ['Laser Hair Removal'];

export function coursesForStatus(courses, status) {
  if (status !== 'tenth') return courses;
  return courses.map((course) =>
    course.category === 'clinical_aesthetics'
      ? {
          ...course,
          name: 'Laser Hair Reduction Course',
          title: 'Laser Hair Reduction Course',
          syllabus: (course.syllabus || []).filter((topic) => TENTH_LASER_TOPICS.includes(topic)),
          outcomes: [
            'Understand laser hair reduction and safety protocols',
            'Perform laser hair reduction with confidence',
            'Ensure client safety & satisfaction',
          ],
        }
      : course,
  );
}