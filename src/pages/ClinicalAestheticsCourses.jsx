import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import CourseGrid from '@/components/CourseGrid.jsx';
import { clinicalAestheticsCourses } from '@/data/coursesData.js';
import { useCourses } from '@/lib/coursesApi.js';
import { useAcademicStatus } from '@/lib/academicStatus.js';
import { coursesForStatus } from '@/lib/courseAccess.js';

const ClinicalAestheticsCourses = () => {
  const [academicStatus] = useAcademicStatus();
  const { courses, connected } = useCourses('clinical_aesthetics', clinicalAestheticsCourses);
  const visibleCourses = coursesForStatus(courses, academicStatus);
  return (
    <>
      <Helmet><title>Laser Certification Program - ISATS</title><meta name="description" content="Laser Certification Program covering laser fundamentals, photo facial, Q-Switch, hair removal, machine knowledge and practical laser protocols." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="isats-programme-page">
          <section className="isats-programme-hero">
            <div className="isats-programme-hero-orb" />
            <div className="isats-programme-hero-inner">
              <motion.div className="isats-programme-hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: [.22,1,.36,1] }}>
                <span className="isats-section-kicker">LASER SCIENCE & TECHNOLOGY</span>
                <h1>Laser Certification<br /><em>Program</em></h1>
                <p>Build knowledge of laser fundamentals, equipment, treatment protocols and safety through a focused programme.</p>
                <div className="isats-programme-hero-points"><span><BookOpen size={16}/> Structured curriculum</span><span><GraduationCap size={16}/> Skill-based learning</span></div>
                <a className="isats-programme-scroll" href="#programme-modules">Explore programme <ArrowDown size={15}/></a>
              </motion.div>
              <motion.div className="isats-programme-hero-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .12 }}>
                <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1100&q=85" alt="Laser Certification Program practical training" />
                <div className="isats-programme-image-caption"><Sparkles size={17}/><span>Learn with purpose. Practice with confidence.</span></div>
              </motion.div>
            </div>
          </section>
          <section id="programme-modules" className="isats-programme-modules">
            <div className="isats-programme-overline"><span className="isats-section-kicker">ISATS LEARNING PATHWAY</span><span>{connected ? 'LIVE COURSE CATALOGUE' : 'COURSE CATALOGUE'}</span></div>
            <CourseGrid courses={visibleCourses} category="clinical-aesthetics" />
            <div className="isats-programme-footnote"><span>Have questions about eligibility or course content?</span><a href="/contact">Talk to admissions <ArrowRight size={15}/></a></div>
          </section>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};
export default ClinicalAestheticsCourses;
