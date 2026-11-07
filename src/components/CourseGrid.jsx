import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, BookOpen, CheckCircle2, Clock3, GraduationCap, Layers3, MessageCircle, Sparkles, Target, Users } from 'lucide-react';
import CourseEnquiryModal from '@/components/CourseEnquiryModal.jsx';

const list = (items) => Array.isArray(items) ? items : [];

function DetailList({ title, items, icon: Icon }) {
  if (!list(items).length) return null;
  return <section className="isats-module-detail-block"><h4><Icon size={17} />{title}</h4><ul>{items.map((item, index) => <li key={index}><span />{item}</li>)}</ul></section>;
}

function Curriculum({ curriculum }) {
  if (!curriculum || typeof curriculum !== 'object') return null;
  return <div className="isats-module-curriculum"><div className="isats-module-detail-heading"><Layers3 size={18} /><h4>Curriculum breakdown</h4></div><div className="isats-module-curriculum-grid">{Object.entries(curriculum).map(([section, value]) => {
    const entries = section === 'basic_vs_advanced' && value && typeof value === 'object' ? Object.entries(value).map(([label, items]) => ({ label, items })) : [{ label: section, items: value }];
    return entries.map(({ label, items }) => <div className="isats-module-curriculum-card" key={label}><span>{label.replaceAll('_', ' ')}</span>{Array.isArray(items) && <ul>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>}</div>);
  })}</div></div>;
}

export default function CourseGrid({ courses = [], category = 'programme' }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const safeCourses = Array.isArray(courses) ? courses : [];
  if (!safeCourses.length) return <div className="isats-module-empty"><BookOpen size={26} /><h3>Course details are being updated</h3><p>Please contact our admissions team for the latest programme information.</p></div>;

  return <>
    <div className="isats-module-section-heading"><div><span className="isats-section-kicker">EXPLORE THE PROGRAMME</span><h2>Built around <em>what you learn.</em></h2></div><p>Explore the topics, practical learning areas and outcomes included in this programme.</p></div>
    <div className="isats-module-card-list">
      {safeCourses.map((course, index) => {
        const id = course.id || `${category}-${index}`;
        const title = course.title || course.name || 'ISATS course';
        const expanded = expandedId === id;
        const syllabus = list(course.syllabus);
        const outcomes = list(course.outcomes);
        const eligibility = list(course.who_can_enroll);
        const highlights = list(course.highlights);
        return <motion.article className={`isats-module-card ${expanded ? 'is-expanded' : ''}`} key={id} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .55, delay: Math.min(index * .08, .24), ease: [.22, 1, .36, 1] }} whileHover={{ y: -4 }}>
          <div className="isats-module-card-topline"><span>MODULE {String(index + 1).padStart(2, '0')}</span><span>{category.toUpperCase()}</span></div>
          <div className="isats-module-card-main">
            <div className="isats-module-card-symbol"><BookOpen size={23} /></div>
            <div className="isats-module-card-title"><h3>{title}</h3><p>{course.description || 'Explore the key learning areas and practical topics covered in this programme.'}</p></div>
            <div className="isats-module-card-meta">{course.duration && <span><Clock3 size={14} />{course.duration}</span>}{course.eligibility && <span><GraduationCap size={14} />{course.eligibility}</span>}<span><Layers3 size={14} />{syllabus.length} topics</span></div>
          </div>
          <div className="isats-module-card-bottom"><span><Sparkles size={15} /> Practical learning pathway</span><div>
            <button type="button" className="isats-module-expand" aria-expanded={expanded} onClick={() => setExpandedId(expanded ? null : id)}>{expanded ? 'Hide details' : 'View modules'} {expanded ? <ArrowUpRight size={16} /> : <ArrowDown size={16} />}</button>
            <button type="button" className="isats-module-enquire" onClick={() => setSelectedCourse(course)}><MessageCircle size={16} /> Enquire</button>
          </div></div>
          <AnimatePresence initial={false}>{expanded && <motion.div className="isats-module-expanded" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .42, ease: [.22, 1, .36, 1] }}><div className="isats-module-expanded-inner">
            <DetailList title="Topics covered" items={syllabus} icon={BookOpen} /><DetailList title="Learning outcomes" items={outcomes} icon={Target} /><DetailList title="Who can enrol" items={eligibility} icon={Users} /><DetailList title="Training highlights" items={highlights} icon={Sparkles} /><Curriculum curriculum={course.curriculum} /><DetailList title="Career pathways" items={course.career_options || course.careerOptions} icon={CheckCircle2} />
            <button type="button" className="isats-module-expanded-cta" onClick={() => setSelectedCourse(course)}>Ask about this programme <ArrowUpRight size={16} /></button>
          </div></motion.div>}</AnimatePresence>
        </motion.article>;
      })}
    </div>
    <CourseEnquiryModal course={selectedCourse} open={Boolean(selectedCourse)} onClose={() => setSelectedCourse(null)} />
  </>;
}
