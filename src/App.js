import React, { useState, useEffect } from 'react';
import './App.css';

// Course catalog with all courses from handbook
const COURSE_CATALOG = [
  // THEOLOGY
  { id: 'THEO1', name: 'Theology I', code: 'THEO1', credits: 10, subject: 'Theology', grade: 9, prereqs: [], semesters: 2 },
  { id: 'THEO2', name: 'Theology II', code: 'THEO2', credits: 10, subject: 'Theology', grade: 10, prereqs: ['THEO1'], semesters: 2 },
  { id: 'THEO3', name: 'Theology III', code: 'THEO3', credits: 10, subject: 'Theology', grade: 11, prereqs: ['THEO2'], semesters: 2 },
  { id: 'THEO4', name: 'Theology IV', code: 'THEO4', credits: 10, subject: 'Theology', grade: 12, prereqs: ['THEO3'], semesters: 2 },
  
  // ENGLISH
  { id: 'ENG1', name: 'English I', code: 'ENG1', credits: 10, subject: 'English', grade: 9, prereqs: [], semesters: 2 },
  { id: 'ENG2', name: 'English II', code: 'ENG2', credits: 10, subject: 'English', grade: 10, prereqs: ['ENG1'], semesters: 2 },
  { id: 'ENG3', name: 'English III', code: 'ENG3', credits: 10, subject: 'English', grade: 11, prereqs: ['ENG2'], semesters: 2 },
  { id: 'COLPREPWRITE', name: 'College Prep Writing', code: 'ENG205', credits: 5, subject: 'English', grade: 11, prereqs: [], semesters: 1 },
  { id: 'CREWRITE', name: 'Creative Writing', code: 'ENG100', credits: 5, subject: 'English', grade: 11, prereqs: [], semesters: 1 },
  { id: 'CLASSLIT1', name: 'Classic Literature I', code: 'ENG210', credits: 10, subject: 'English', grade: 11, prereqs: ['ENG2'], semesters: 2 },
  { id: 'CLASSLIT2', name: 'Classic Literature II', code: 'ENG220', credits: 10, subject: 'English', grade: 12, prereqs: ['CLASSLIT1'], semesters: 2 },
  { id: 'ENG4', name: 'English IV', code: 'ENG035', credits: 5, subject: 'English', grade: 12, prereqs: [], semesters: 1 },
  { id: 'APENGLIT', name: 'AP English Literature', code: 'ENG110', credits: 10, subject: 'English', grade: 12, prereqs: [], semesters: 2 },
  { id: 'JOURN1', name: 'Journalism I', code: 'ENG190', credits: 10, subject: 'English', grade: 9, prereqs: [], semesters: 2 },
  { id: 'JOURN2', name: 'Journalism II', code: 'ENG195', credits: 10, subject: 'English', grade: 10, prereqs: ['JOURN1'], semesters: 2 },
  { id: 'YEARBOOK', name: 'Yearbook', code: 'ENG200', credits: 10, subject: 'English', grade: 10, prereqs: [], semesters: 2 },
  
  // MATH
  { id: 'ALGESS', name: 'Algebra Essentials', code: 'MATH075', credits: 10, subject: 'Math', grade: 9, prereqs: [], semesters: 2 },
  { id: 'ALG1', name: 'Algebra I', code: 'MATH070', credits: 10, subject: 'Math', grade: 9, prereqs: [], semesters: 2 },
  { id: 'DIFFALG1', name: 'Differentiated Algebra I', code: 'MATH000', credits: 10, subject: 'Math', grade: 9, prereqs: [], semesters: 2 },
  { id: 'GEOM', name: 'Geometry', code: 'MATH090', credits: 10, subject: 'Math', grade: 10, prereqs: ['ALG1', 'DIFFALG1'], semesters: 2 },
  { id: 'DIFFGEOM', name: 'Differentiated Geometry', code: 'MATH010', credits: 10, subject: 'Math', grade: 9, prereqs: ['DIFFALG1'], semesters: 2 },
  { id: 'ALG2', name: 'Algebra II', code: 'MATH100', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG1', 'DIFFALG1'], semesters: 2 },
  { id: 'DIFFALG2', name: 'Differentiated Algebra II', code: 'MATH020', credits: 10, subject: 'Math', grade: 10, prereqs: ['DIFFGEOM', 'GEOM'], semesters: 2 },
  { id: 'APSTATS', name: 'AP Statistics', code: 'MATH040', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG2'], semesters: 2 },
  { id: 'STATS', name: 'Statistics', code: 'MATH135', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG2'], semesters: 2 },
  { id: 'TRIG', name: 'Trigonometry', code: 'MATH136', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG2'], semesters: 2 },
  { id: 'PRECALC', name: 'Pre-Calculus', code: 'MATH030', credits: 10, subject: 'Math', grade: 11, prereqs: ['DIFFALG2'], semesters: 2 },
  { id: 'ADVMATH', name: 'Advanced Math', code: 'MATH110', credits: 10, subject: 'Math', grade: 12, prereqs: ['ALG2'], semesters: 2 },
  { id: 'APPRECALC', name: 'AP Pre-Calculus', code: 'MATH035', credits: 10, subject: 'Math', grade: 11, prereqs: ['DIFFALG2'], semesters: 2 },
  { id: 'APCALC', name: 'AP Calculus', code: 'MATH050', credits: 10, subject: 'Math', grade: 12, prereqs: ['PRECALC'], semesters: 2 },
  { id: 'APCALCPACE', name: 'AP Calculus (PACE)', code: 'MATH060', credits: 10, subject: 'Math', grade: 12, prereqs: ['PRECALC'], semesters: 2 },
  
  // SCIENCE
  { id: 'PHYSCI', name: 'Physical Science', code: 'SCI000', credits: 10, subject: 'Science', grade: 9, prereqs: [], semesters: 2 },
  { id: 'BIO', name: 'Biology', code: 'SCI010', credits: 10, subject: 'Science', grade: 9, prereqs: [], semesters: 2 },
  { id: 'CHEM', name: 'Chemistry', code: 'SCI020', credits: 10, subject: 'Science', grade: 10, prereqs: ['BIO'], semesters: 2 },
  { id: 'EARTHSCI', name: 'Earth, Energy, and Environment', code: 'SCI090', credits: 10, subject: 'Science', grade: 11, prereqs: ['BIO'], semesters: 2 },
  { id: 'PHYSICS', name: 'Physics', code: 'SCI030', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM', 'GEOM'], semesters: 2 },
  { id: 'ACCPHYS', name: 'Accelerated Physics', code: 'SCI070', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM', 'PRECALC'], semesters: 2 },
  { id: 'ANATPHYS', name: 'Anatomy and Physiology', code: 'SCI050', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM'], semesters: 2 },
  { id: 'APENVSCI', name: 'AP Environmental Science', code: 'SCI100', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM', 'ALG2'], semesters: 2 },
  { id: 'ADVCHEM', name: 'Advanced Chemistry', code: 'SCI060', credits: 10, subject: 'Science', grade: 12, prereqs: ['PHYSICS'], semesters: 2 },
  { id: 'APBIO', name: 'AP Biology', code: 'SCI040', credits: 10, subject: 'Science', grade: 12, prereqs: [], semesters: 2 },
  { id: 'APPHYSPACE', name: 'AP Physics (PACE)', code: 'SCI080', credits: 10, subject: 'Science', grade: 12, prereqs: ['PHYSICS', 'PRECALC'], semesters: 2 },
  
  // SOCIAL STUDIES
  { id: 'WORLDGEO', name: 'World Geography', code: 'SS000', credits: 5, subject: 'Social Studies', grade: 9, prereqs: [], semesters: 1 },
  { id: 'APHUMANGEO', name: 'AP Human Geography', code: 'SS090', credits: 10, subject: 'Social Studies', grade: 10, prereqs: ['WORLDHIST'], semesters: 2 },
  { id: 'WORLDHIST', name: 'World History', code: 'SS010', credits: 10, subject: 'Social Studies', grade: 9, prereqs: [], semesters: 2 },
  { id: 'USHIST', name: 'United States History', code: 'SS020', credits: 10, subject: 'Social Studies', grade: 11, prereqs: [], semesters: 2 },
  { id: 'AMGOV', name: 'American Government', code: 'SS040', credits: 5, subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'PSYCH', name: 'Psychology', code: 'SS050', credits: 5, subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'CONTEMPHIST', name: 'Contemporary History', code: 'SS060', credits: 5, subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'INTROPHIL', name: 'Introduction to Philosophy', code: 'SS100', credits: 5, subject: 'Social Studies', grade: 10, prereqs: [], semesters: 1 },
  { id: 'APAMGOV', name: 'AP American Government', code: 'SS070', credits: 5, subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'ECON', name: 'Economics', code: 'SS080', credits: 5, subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'HUMANREL', name: 'Human Relations', code: 'FCS830', credits: 5, subject: 'Social Studies', grade: 11, prereqs: [], semesters: 1 },
  { id: 'FAMISSUES', name: 'Family Issues', code: 'FCS850', credits: 5, subject: 'Social Studies', grade: 11, prereqs: [], semesters: 1 },
  
  // SPEECH
  { id: 'SPEECHCOM', name: 'Speech Communication', code: 'SPE520', credits: 5, subject: 'Speech', grade: 10, prereqs: [], semesters: 1 },
  { id: 'COMPPUBSPEAK', name: 'Competitive Public Speaking', code: 'SPE523', credits: 5, subject: 'Speech', grade: 9, prereqs: [], semesters: 1 },
  
  // PE
  { id: 'GIRLSPEHEALTH', name: 'Girls Physical Education & Health', code: 'PE000', credits: 10, subject: 'PE', grade: 9, prereqs: [], semesters: 2 },
  { id: 'BOYSPEHEALTH', name: 'Boys Physical Education & Health', code: 'PE010', credits: 10, subject: 'PE', grade: 9, prereqs: [], semesters: 2 },
  { id: 'STRENGTH1', name: 'Strength and Performance Sem. 1', code: 'PE020', credits: 5, subject: 'PE', grade: 10, prereqs: [], semesters: 1 },
  { id: 'STRENGTH2', name: 'Strength and Performance Sem. 2', code: 'PE030', credits: 5, subject: 'PE', grade: 10, prereqs: [], semesters: 1 },
  { id: 'BOYSFITNESS', name: 'Boys Fitness, Recreation, and Sport', code: 'PE045', credits: 5, subject: 'PE', grade: 10, prereqs: [], semesters: 1 },
  { id: 'GIRLSFITNESS', name: 'Girls Fitness, Recreation, and Sport', code: 'PE055', credits: 5, subject: 'PE', grade: 10, prereqs: [], semesters: 1 },
  
  // FINE ARTS
  { id: 'ARTFUND', name: 'Art Fundamentals', code: 'ART000', credits: 5, subject: 'Fine Arts', grade: 9, prereqs: [], semesters: 1 },
  { id: 'ARTFUND2', name: 'Art Fundamentals II', code: 'ART250', credits: 5, subject: 'Fine Arts', grade: 9, prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'DRAWING', name: 'Drawing', code: 'ART010', credits: 5, subject: 'Fine Arts', grade: 9, prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVDRAW', name: 'Advanced Drawing', code: 'ART020', credits: 5, subject: 'Fine Arts', grade: 10, prereqs: ['DRAWING'], semesters: 1 },
  { id: 'PAINTING', name: 'Painting', code: 'ART030', credits: 5, subject: 'Fine Arts', grade: 9, prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVPAINT', name: 'Advanced Painting', code: 'ART040', credits: 5, subject: 'Fine Arts', grade: 10, prereqs: ['PAINTING'], semesters: 1 },
  { id: 'GRAPHICDES', name: 'Graphic Design', code: 'ART050', credits: 5, subject: 'Fine Arts', grade: 9, prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVGRAPHIC', name: 'Advanced Graphic Design', code: 'ART060', credits: 5, subject: 'Fine Arts', grade: 10, prereqs: ['GRAPHICDES'], semesters: 1 },
  { id: 'CERAMICS', name: 'Ceramics/Sculpture', code: 'ART070', credits: 5, subject: 'Fine Arts', grade: 9, prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVCERAMICS', name: 'Advanced Ceramics/Sculpture', code: 'ART080', credits: 5, subject: 'Fine Arts', grade: 10, prereqs: ['CERAMICS'], semesters: 1 },
  { id: 'DEVOTART', name: 'Devotional Art', code: 'ART095', credits: 5, subject: 'Fine Arts', grade: 9, prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVDEVOT', name: 'Advanced Devotional Art', code: 'ART150', credits: 5, subject: 'Fine Arts', grade: 10, prereqs: ['DEVOTART'], semesters: 1 },
  { id: 'PHOTO', name: 'Photography', code: 'ART200', credits: 5, subject: 'Fine Arts', grade: 11, prereqs: [], semesters: 1 },
  { id: 'ADVPHOTO', name: 'Advanced Photography', code: 'ART210', credits: 5, subject: 'Fine Arts', grade: 12, prereqs: ['PHOTO'], semesters: 1 },
  { id: 'MARCHBAND', name: 'Marching Band', code: 'MUS300', credits: 5, subject: 'Fine Arts', grade: 9, prereqs: [], semesters: 1 },
  { id: 'CONCERTBAND', name: 'Concert Band', code: 'MUS310', credits: 5, subject: 'Fine Arts', grade: 9, prereqs: [], semesters: 1 },
  { id: 'SYMPBAND', name: 'Symphonic Band', code: 'MUS320', credits: 5, subject: 'Fine Arts', grade: 9, prereqs: [], semesters: 1 },
  { id: 'ORCHESTRA', name: 'Orchestra', code: 'MUS325', credits: 5, subject: 'Fine Arts', grade: 9, prereqs: [], semesters: 1 },
  { id: 'WOMENCHOIR', name: "Women's Choir", code: 'MUS335', credits: 10, subject: 'Fine Arts', grade: 9, prereqs: [], semesters: 2 },
  { id: 'MENCHOIR', name: "Men's Choir", code: 'MUS345', credits: 10, subject: 'Fine Arts', grade: 9, prereqs: [], semesters: 2 },
  { id: 'SOTTOVOCE', name: 'Sotto Voce', code: 'MUS350', credits: 10, subject: 'Fine Arts', grade: 10, prereqs: [], semesters: 2 },
  { id: 'CONCERTCHOIR', name: 'Concert Choir', code: 'MUS380', credits: 10, subject: 'Fine Arts', grade: 10, prereqs: [], semesters: 2 },
  { id: 'MUSICAPP', name: 'Music Appreciation', code: 'MUS420', credits: 5, subject: 'Fine Arts', grade: 10, prereqs: [], semesters: 1 },
  
  // LIFE SKILLS
  { id: 'COMPAPP', name: 'Computer Applications', code: 'BUS600', credits: 5, subject: 'Life Skills', grade: 9, prereqs: [], semesters: 1 },
  { id: 'ACCT1', name: 'Accounting I', code: 'BUS630', credits: 5, subject: 'Life Skills', grade: 9, prereqs: [], semesters: 1 },
  { id: 'CAREERMGMT', name: 'Career and Life Management Skills', code: 'BUS800', credits: 5, subject: 'Life Skills', grade: 9, prereqs: [], semesters: 1 },
  { id: 'FOODNUT', name: 'Food & Nutrition', code: 'FCS810', credits: 5, subject: 'Life Skills', grade: 9, prereqs: [], semesters: 1 },
  { id: 'HOUSING', name: 'Housing and Interior Design', code: 'FCS820', credits: 5, subject: 'Life Skills', grade: 10, prereqs: [], semesters: 1 },
  { id: 'CHILDDEV', name: 'Child Development, Care, Guidance, & Parenthood Education', code: 'FCS840', credits: 5, subject: 'Life Skills', grade: 11, prereqs: [], semesters: 1 },
  { id: 'TEXTILES', name: 'Textiles, Clothing and Design', code: 'FCS860', credits: 5, subject: 'Life Skills', grade: 9, prereqs: [], semesters: 1 },
  { id: 'SMALLENG', name: 'Small Engines', code: 'IT900', credits: 5, subject: 'Life Skills', grade: 9, prereqs: [], semesters: 1 },
  { id: 'MACHINEWOOD', name: 'Machine Woodworking', code: 'IT910', credits: 10, subject: 'Life Skills', grade: 9, prereqs: [], semesters: 2 },
  
  // WORLD LANGUAGES
  { id: 'FRENCH1', name: 'French I', code: 'WL000', credits: 10, subject: 'World Languages', grade: 9, prereqs: [], semesters: 2 },
  { id: 'FRENCH2', name: 'French II', code: 'WL010', credits: 10, subject: 'World Languages', grade: 10, prereqs: ['FRENCH1'], semesters: 2 },
  { id: 'FRENCH3', name: 'French III', code: 'WL020', credits: 10, subject: 'World Languages', grade: 11, prereqs: ['FRENCH2'], semesters: 2 },
  { id: 'FRENCH4', name: 'French IV', code: 'WL030', credits: 10, subject: 'World Languages', grade: 12, prereqs: ['FRENCH3'], semesters: 2 },
  { id: 'SPANISH1', name: 'Spanish I', code: 'WL040', credits: 10, subject: 'World Languages', grade: 9, prereqs: [], semesters: 2 },
  { id: 'SPANISH2', name: 'Spanish II', code: 'WL050', credits: 10, subject: 'World Languages', grade: 10, prereqs: ['SPANISH1'], semesters: 2 },
  { id: 'SPANISH3', name: 'Spanish III', code: 'WL060', credits: 10, subject: 'World Languages', grade: 11, prereqs: ['SPANISH2'], semesters: 2 },
  { id: 'SPANISH4', name: 'Spanish IV', code: 'WL070', credits: 10, subject: 'World Languages', grade: 12, prereqs: ['SPANISH3'], semesters: 2 },
  { id: 'LATIN1', name: 'Latin I', code: 'WL100', credits: 10, subject: 'World Languages', grade: 9, prereqs: [], semesters: 2 },
  { id: 'LATIN3', name: 'Latin III', code: 'WL120', credits: 10, subject: 'World Languages', grade: 10, prereqs: [], semesters: 2 },
  { id: 'LATIN4', name: 'Latin IV', code: 'WL130', credits: 10, subject: 'World Languages', grade: 10, prereqs: [], semesters: 2 },
];

const GRADUATION_REQUIREMENTS = {
  'Theology': 40,
  'English': 40,
  'Social Studies': 35,
  'Math': 30,
  'Science': 30,
  'Speech': 5,
  'PE': 15,
  'Fine Arts': 5,
  'Life Skills': 5,
};

function App() {
  const [courses, setCourses] = useState([]);
  const [viewMode, setViewMode] = useState('semester'); // 'semester' or 'subject'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showPrereqModal, setShowPrereqModal] = useState(false);
  const [prereqError, setPrereqError] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('piusXCoursePlan');
    if (saved) {
      try {
        setCourses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved plan');
      }
    }
  }, []);

  // Save to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem('piusXCoursePlan', JSON.stringify(courses));
  }, [courses]);

  const addCourse = (catalogCourse) => {
    // Check prerequisites
    const missingPrereqs = catalogCourse.prereqs.filter(prereqId => {
      return !courses.some(c => c.id === prereqId);
    });

    if (missingPrereqs.length > 0) {
      const missingCourseNames = missingPrereqs.map(prereqId => {
        const course = COURSE_CATALOG.find(c => c.id === prereqId);
        return course ? course.name : prereqId;
      });
      
      setPrereqError({
        courseName: catalogCourse.name,
        missingPrereqs: missingPrereqs,
        missingNames: missingCourseNames
      });
      setShowPrereqModal(true);
      return;
    }

    // Determine year and semester based on existing courses
    const currentYear = determineYear(catalogCourse);
    const currentSemester = catalogCourse.semesters === 1 ? 'Fall' : 'Fall'; // Year-long starts in Fall
    
    const newCourse = {
      ...catalogCourse,
      uniqueId: Date.now(),
      year: currentYear,
      semester: currentSemester,
    };

    let newCourses = [...courses, newCourse];

    // Auto-add sequential theology courses
    if (catalogCourse.id === 'THEO1') {
      const theo2 = COURSE_CATALOG.find(c => c.id === 'THEO2');
      const theo3 = COURSE_CATALOG.find(c => c.id === 'THEO3');
      const theo4 = COURSE_CATALOG.find(c => c.id === 'THEO4');
      
      newCourses.push({
        ...theo2,
        uniqueId: Date.now() + 1,
        year: 10,
        semester: 'Fall'
      });
      newCourses.push({
        ...theo3,
        uniqueId: Date.now() + 2,
        year: 11,
        semester: 'Fall'
      });
      newCourses.push({
        ...theo4,
        uniqueId: Date.now() + 3,
        year: 12,
        semester: 'Fall'
      });
    }

    setCourses(newCourses);
  };

  const addMissingPrereq = (prereqId) => {
    const prereqCourse = COURSE_CATALOG.find(c => c.id === prereqId);
    if (prereqCourse) {
      addCourse(prereqCourse);
      setShowPrereqModal(false);
    }
  };

  const determineYear = (catalogCourse) => {
    // Find the highest year currently in the plan
    const yearsInPlan = courses.map(c => c.year);
    const maxYear = yearsInPlan.length > 0 ? Math.max(...yearsInPlan) : 9;
    
    // Use the catalog's suggested grade, or place after current max
    return catalogCourse.grade || Math.min(maxYear, 12);
  };

  const deleteCourse = (uniqueId) => {
    // Check if any other courses depend on this one
    const courseToDelete = courses.find(c => c.uniqueId === uniqueId);
    if (!courseToDelete) return;

    const dependentCourses = courses.filter(c => 
      c.prereqs && c.prereqs.includes(courseToDelete.id)
    );

    if (dependentCourses.length > 0) {
      if (!window.confirm(`Removing ${courseToDelete.name} will also remove courses that depend on it: ${dependentCourses.map(c => c.name).join(', ')}. Continue?`)) {
        return;
      }
      // Remove this course and all dependent courses
      const idsToRemove = [uniqueId, ...dependentCourses.map(c => c.uniqueId)];
      setCourses(courses.filter(c => !idsToRemove.includes(c.uniqueId)));
    } else {
      setCourses(courses.filter(c => c.uniqueId !== uniqueId));
    }
  };

  const updateCourseSemester = (uniqueId, semester, year) => {
    setCourses(courses.map(c => 
      c.uniqueId === uniqueId 
        ? { ...c, semester, year: year || c.year }
        : c
    ));
  };

  const getYearLabel = (year) => {
    const labels = { 9: 'FR', 10: 'SO', 11: 'JR', 12: 'SR' };
    return labels[year] || year;
  };

  const calculateProgress = () => {
    const progress = {};
    Object.keys(GRADUATION_REQUIREMENTS).forEach(subject => {
      const earned = courses
        .filter(c => c.subject === subject)
        .reduce((sum, c) => sum + c.credits, 0);
      progress[subject] = {
        earned,
        required: GRADUATION_REQUIREMENTS[subject],
        percentage: Math.min(100, (earned / GRADUATION_REQUIREMENTS[subject]) * 100)
      };
    });
    return progress;
  };

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const progress = calculateProgress();

  // Filter catalog for search
  const filteredCatalog = COURSE_CATALOG.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
    const notAlreadyAdded = !courses.some(c => c.id === course.id);
    return matchesSearch && matchesSubject && notAlreadyAdded;
  });

  // Group courses by semester
  const groupBySemester = () => {
    const groups = {
      9: { Fall: [], Spring: [] },
      10: { Fall: [], Spring: [] },
      11: { Fall: [], Spring: [] },
      12: { Fall: [], Spring: [] },
    };

    courses.forEach(course => {
      if (groups[course.year]) {
        if (course.semesters === 2) {
          // Year-long course appears in both semesters
          groups[course.year].Fall.push(course);
          groups[course.year].Spring.push({ ...course, isSecondSemester: true });
        } else {
          groups[course.year][course.semester].push(course);
        }
      }
    });

    return groups;
  };

  // Group courses by subject area
  const groupBySubject = () => {
    const groups = {};
    Object.keys(GRADUATION_REQUIREMENTS).forEach(subject => {
      groups[subject] = courses.filter(c => c.subject === subject);
    });
    return groups;
  };

  const semesterGroups = groupBySemester();
  const subjectGroups = groupBySubject();

  const subjects = Object.keys(GRADUATION_REQUIREMENTS);

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Pius X 4-Year Course Planner</h1>
          <div className="view-toggle">
            <button 
              className={viewMode === 'semester' ? 'active' : ''}
              onClick={() => setViewMode('semester')}
            >
              Semester View
            </button>
            <button 
              className={viewMode === 'subject' ? 'active' : ''}
              onClick={() => setViewMode('subject')}
            >
              Subject Area View
            </button>
          </div>
        </header>

        <div className="progress-dashboard">
          <div className="total-credits">
            <h3>Total Credits: {totalCredits} / 230</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(100, (totalCredits / 230) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="requirements-grid">
            {subjects.map(subject => (
              <div key={subject} className="requirement-item">
                <div className="requirement-header">
                  <span className="subject-name">{subject}</span>
                  <span className="credits">{progress[subject].earned}/{progress[subject].required}</span>
                </div>
                <div className="progress-bar small">
                  <div 
                    className={`progress-fill ${progress[subject].earned >= progress[subject].required ? 'complete' : ''}`}
                    style={{ width: `${progress[subject].percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="add-course-section">
          <h2>Add Courses</h2>
          <div className="search-controls">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="subject-filter"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div className="course-catalog">
            {filteredCatalog.map(course => (
              <div key={course.id} className="catalog-course-card">
                <div className="course-info">
                  <h4>{course.name}</h4>
                  <p className="course-code">{course.code}</p>
                  <p className="course-details">
                    {course.credits} credits • {course.subject}
                    {course.prereqs.length > 0 && (
                      <span className="prereq-badge"> • Prereq required</span>
                    )}
                  </p>
                </div>
                <button 
                  onClick={() => addCourse(course)}
                  className="btn-add-course"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {viewMode === 'semester' && (
          <div className="semester-view">
            {[9, 10, 11, 12].map(year => (
              <div key={year} className="year-section">
                <h2>{getYearLabel(year)} - Grade {year}</h2>
                <div className="semesters-row">
                  {['Fall', 'Spring'].map(semester => (
                    <div key={semester} className="semester-column">
                      <h3>{semester}</h3>
                      <div className="courses-list">
                        {semesterGroups[year][semester].map(course => (
                          <div key={course.uniqueId + (course.isSecondSemester ? '-spring' : '')} className="course-card">
                            <div className="course-card-header">
                              <h4>{course.name}</h4>
                              {!course.isSecondSemester && (
                                <button
                                  onClick={() => deleteCourse(course.uniqueId)}
                                  className="btn-delete"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                            <p className="course-code">{course.code}</p>
                            <p className="course-credits">
                              {course.semesters === 2 ? `${course.credits} credits (Year-long)` : `${course.credits} credits`}
                            </p>
                            <p className="course-subject">{course.subject}</p>
                          </div>
                        ))}
                      </div>
                      <div className="semester-credits">
                        Credits: {semesterGroups[year][semester].reduce((sum, c) => {
                          // For year-long courses, count full credits in fall, 0 in spring to avoid double-counting
                          if (c.semesters === 2 && semester === 'Spring') return sum;
                          return sum + c.credits;
                        }, 0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'subject' && (
          <div className="subject-view">
            {subjects.map(subject => (
              <div key={subject} className="subject-section">
                <div className="subject-header">
                  <h2>{subject}</h2>
                  <div className="subject-progress">
                    <span className="progress-text">
                      {progress[subject].earned} / {progress[subject].required} credits
                    </span>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${progress[subject].earned >= progress[subject].required ? 'complete' : ''}`}
                        style={{ width: `${progress[subject].percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="subject-courses">
                  {subjectGroups[subject].length === 0 ? (
                    <p className="empty-subject">No courses added yet</p>
                  ) : (
                    subjectGroups[subject].map(course => (
                      <div key={course.uniqueId} className="course-card">
                        <div className="course-card-header">
                          <div>
                            <h4>{course.name}</h4>
                            <p className="course-year-badge">{getYearLabel(course.year)} • {course.semester}</p>
                          </div>
                          <button
                            onClick={() => deleteCourse(course.uniqueId)}
                            className="btn-delete"
                          >
                            ×
                          </button>
                        </div>
                        <p className="course-code">{course.code}</p>
                        <p className="course-credits">{course.credits} credits</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showPrereqModal && prereqError && (
          <div className="modal-overlay" onClick={() => setShowPrereqModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Prerequisite Required</h3>
                <button onClick={() => setShowPrereqModal(false)} className="btn-close">×</button>
              </div>
              <div className="modal-body">
                <p>
                  Cannot add <strong>{prereqError.courseName}</strong>. 
                  You must first complete the following prerequisite(s):
                </p>
                <ul className="prereq-list">
                  {prereqError.missingNames.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
                <div className="modal-actions">
                  {prereqError.missingPrereqs.map((prereqId, idx) => (
                    <button 
                      key={prereqId}
                      onClick={() => addMissingPrereq(prereqId)}
                      className="btn-add-prereq"
                    >
                      Add {prereqError.missingNames[idx]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
