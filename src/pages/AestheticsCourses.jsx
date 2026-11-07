import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import CourseGrid from '@/components/CourseGrid.jsx';
import { aestheticsCourses } from '@/data/coursesData.js';
import { useCourses } from '@/lib/coursesApi.js';

const AestheticsCourses = () => {
  const { courses, connected } = useCourses('aesthetics', aestheticsCourses);
  return (
    <>
      <Helmet><title>Advanced CTL Program - ISATS</title><meta name="description" content="Advanced cosmetology, trichology, skin aesthetics and laser training with practical exposure, clinic setup support and business guidance." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="isats-programme-page">
          <section className="isats-programme-hero">
            <div className="isats-programme-hero-orb" />
            <div className="isats-programme-hero-inner">
              <motion.div className="isats-programme-hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: [.22,1,.36,1] }}>
                <span className="isats-section-kicker">AESTHETICS · COSMETOLOGY · TRICHOLOGY</span>
                <h1>Advanced CTL<br /><em>Program</em></h1>
                <p>Explore a broad learning pathway across cosmetology, skin aesthetics, trichology and laser technologies, supported by practical training.</p>
                <div className="isats-programme-hero-points"><span><BookOpen size={16}/> Structured curriculum</span><span><GraduationCap size={16}/> Skill-based learning</span></div>
                <a className="isats-programme-scroll" href="#programme-modules">Explore programme <ArrowDown size={15}/></a>
              </motion.div>
              <motion.div className="isats-programme-hero-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .12 }}>
                <img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1100&q=85" alt="Advanced CTL Program practical training" />
                <div className="isats-programme-image-caption"><Sparkles size={17}/><span>Learn with purpose. Practice with confidence.</span></div>
              </motion.div>
            </div>
          </section>
          <section id="programme-modules" className="isats-programme-modules">
            <div className="isats-programme-overline"><span className="isats-section-kicker">ISATS LEARNING PATHWAY</span><span>{connected ? 'LIVE COURSE CATALOGUE' : 'COURSE CATALOGUE'}</span></div>
            <CourseGrid courses={courses} category="aesthetics" />
            <div className="isats-programme-footnote"><span>Have questions about eligibility or course content?</span><a href="/contact">Talk to admissions <ArrowRight size={15}/></a></div>
          </section>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};
export default AestheticsCourses;
