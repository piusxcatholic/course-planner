import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

// ─── AP / Dual-credit flags ───────────────────────────────────────────────────
// isAP: true  → counts toward AP credits
// isDual: true → counts toward dual-enrollment credits

const COURSE_CATALOG = [
  // THEOLOGY
  { id: 'THEO1', name: 'Theology I',   code: 'THEO1', credits: 10, subject: 'Theology', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'THEO2', name: 'Theology II',  code: 'THEO2', credits: 10, subject: 'Theology', grade: 10, prereqs: ['THEO1'], semesters: 2 },
  { id: 'THEO3', name: 'Theology III', code: 'THEO3', credits: 10, subject: 'Theology', grade: 11, prereqs: ['THEO2'], semesters: 2 },
  { id: 'THEO4', name: 'Theology IV',  code: 'THEO4', credits: 10, subject: 'Theology', grade: 12, prereqs: ['THEO3'], semesters: 2 },

  // ENGLISH
  { id: 'ENG1',        name: 'English I',             code: 'ENG1',   credits: 10, subject: 'English', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'ENG2',        name: 'English II',            code: 'ENG2',   credits: 10, subject: 'English', grade: 10, prereqs: ['ENG1'], semesters: 2 },
  { id: 'ENG3',        name: 'English III',           code: 'ENG3',   credits: 10, subject: 'English', grade: 11, prereqs: ['ENG2'], semesters: 2 },
  { id: 'COLPREPWRITE',name: 'College Prep Writing',  code: 'ENG205', credits: 5,  subject: 'English', grade: 11, prereqs: [], semesters: 1 },
  { id: 'CREWRITE',    name: 'Creative Writing',      code: 'ENG100', credits: 5,  subject: 'English', grade: 11, prereqs: [], semesters: 1 },
  { id: 'CLASSLIT1',   name: 'Classic Literature I',  code: 'ENG210', credits: 10, subject: 'English', grade: 11, prereqs: ['ENG2'], semesters: 2 },
  { id: 'CLASSLIT2',   name: 'Classic Literature II', code: 'ENG220', credits: 10, subject: 'English', grade: 12, prereqs: ['CLASSLIT1'], semesters: 2 },
  { id: 'ENG4',        name: 'English IV',            code: 'ENG035', credits: 5,  subject: 'English', grade: 12, prereqs: [], semesters: 1 },
  { id: 'APENGLIT',    name: 'AP English Literature', code: 'ENG110', credits: 10, subject: 'English', grade: 12, prereqs: [], semesters: 2, isAP: true },
  { id: 'JOURN1',      name: 'Journalism I',          code: 'ENG190', credits: 10, subject: 'English', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'JOURN2',      name: 'Journalism II',         code: 'ENG195', credits: 10, subject: 'English', grade: 10, prereqs: ['JOURN1'], semesters: 2 },
  { id: 'YEARBOOK',    name: 'Yearbook',              code: 'ENG200', credits: 10, subject: 'English', grade: 10, prereqs: [], semesters: 2 },

  // MATH
  { id: 'ALGESS',    name: 'Algebra Essentials',         code: 'MATH075', credits: 10, subject: 'Math', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'ALG1',      name: 'Algebra I',                  code: 'MATH070', credits: 10, subject: 'Math', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'DIFFALG1',  name: 'Differentiated Algebra I',   code: 'MATH000', credits: 10, subject: 'Math', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'DIFFGEOM',  name: 'Differentiated Geometry',    code: 'MATH010', credits: 10, subject: 'Math', grade: 9,  prereqs: ['DIFFALG1'], semesters: 2 },
  { id: 'GEOM',      name: 'Geometry',                   code: 'MATH090', credits: 10, subject: 'Math', grade: 10, prereqs: ['ALG1','DIFFALG1'], prereqsAnyOf: true, semesters: 2 },
  { id: 'DIFFALG2',  name: 'Differentiated Algebra II',  code: 'MATH020', credits: 10, subject: 'Math', grade: 10, prereqs: ['DIFFGEOM','GEOM'], prereqsAnyOf: true, semesters: 2 },
  { id: 'ALG2',      name: 'Algebra II',                 code: 'MATH100', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG1','DIFFALG1'], prereqsAnyOf: true, semesters: 2 },
  { id: 'APSTATS',   name: 'AP Statistics',              code: 'MATH040', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG2','DIFFALG2'], prereqsAnyOf: true, semesters: 2, isAP: true },
  { id: 'STATS',     name: 'Statistics',                 code: 'MATH135', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG2','DIFFALG2'], prereqsAnyOf: true, semesters: 2 },
  { id: 'TRIG',      name: 'Trigonometry',               code: 'MATH136', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG2','DIFFALG2'], prereqsAnyOf: true, semesters: 2 },
  { id: 'PRECALC',   name: 'Pre-Calculus',               code: 'MATH030', credits: 10, subject: 'Math', grade: 11, prereqs: ['DIFFALG2'], semesters: 2 },
  { id: 'ADVMATH',   name: 'Advanced Math',              code: 'MATH110', credits: 10, subject: 'Math', grade: 12, prereqs: ['ALG2','DIFFALG2'], prereqsAnyOf: true, semesters: 2 },
  { id: 'APPRECALC', name: 'AP Pre-Calculus',            code: 'MATH035', credits: 10, subject: 'Math', grade: 11, prereqs: ['DIFFALG2'], semesters: 2, isAP: true },
  { id: 'APCALC',    name: 'AP Calculus',                code: 'MATH050', credits: 10, subject: 'Math', grade: 12, prereqs: ['PRECALC'], semesters: 2, isAP: true },
  { id: 'APCALCPACE',name: 'AP Calculus (PACE)',         code: 'MATH060', credits: 10, subject: 'Math', grade: 12, prereqs: ['PRECALC'], semesters: 2, isAP: true, isDual: true },

  // SCIENCE
  { id: 'PHYSCI',   name: 'Physical Science',          code: 'SCI000', credits: 10, subject: 'Science', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'BIO',      name: 'Biology',                   code: 'SCI010', credits: 10, subject: 'Science', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'CHEM',     name: 'Chemistry',                 code: 'SCI020', credits: 10, subject: 'Science', grade: 10, prereqs: ['BIO'], semesters: 2 },
  { id: 'EARTHSCI', name: 'Earth, Energy & Environment',code: 'SCI090', credits: 10, subject: 'Science', grade: 11, prereqs: ['BIO','PHYSCI','CHEM'], prereqsAllRequired: ['BIO'], prereqsAnyOf: true, prereqsAnyOfGroup: ['PHYSCI','CHEM'], semesters: 2 },
  { id: 'PHYSICS',  name: 'Physics',                   code: 'SCI030', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM','GEOM'], semesters: 2 },
  { id: 'ACCPHYS',  name: 'Accelerated Physics',       code: 'SCI070', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM','PRECALC'], semesters: 2 },
  { id: 'ANATPHYS', name: 'Anatomy and Physiology',    code: 'SCI050', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM'], semesters: 2 },
  { id: 'APENVSCI', name: 'AP Environmental Science',  code: 'SCI100', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM','ALG2','DIFFALG2'], prereqsAllRequired: ['CHEM'], prereqsAnyOf: true, prereqsAnyOfGroup: ['ALG2','DIFFALG2'], semesters: 2, isAP: true },
  { id: 'ADVCHEM',  name: 'Advanced Chemistry',        code: 'SCI060', credits: 10, subject: 'Science', grade: 12, prereqs: ['PHYSICS'], semesters: 2 },
  { id: 'APBIO',    name: 'AP Biology',                code: 'SCI040', credits: 10, subject: 'Science', grade: 12, prereqs: [], semesters: 2, isAP: true },
  { id: 'APPHYSPACE',name:'AP Physics (PACE)',         code: 'SCI080', credits: 10, subject: 'Science', grade: 12, prereqs: ['PHYSICS','PRECALC'], semesters: 2, isAP: true, isDual: true },

  // SOCIAL STUDIES
  { id: 'WORLDGEO',   name: 'World Geography',          code: 'SS000', credits: 5,  subject: 'Social Studies', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'WORLDHIST',  name: 'World History',            code: 'SS010', credits: 10, subject: 'Social Studies', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'APHUMANGEO', name: 'AP Human Geography',       code: 'SS090', credits: 10, subject: 'Social Studies', grade: 10, prereqs: ['WORLDHIST'], semesters: 2, isAP: true },
  { id: 'USHIST',     name: 'United States History',    code: 'SS020', credits: 10, subject: 'Social Studies', grade: 11, prereqs: [], semesters: 2 },
  { id: 'APUSHIST',   name: 'AP United States History', code: 'SS025', credits: 10, subject: 'Social Studies', grade: 11, prereqs: [], semesters: 2, isAP: true },
  { id: 'AMGOV',      name: 'American Government',      code: 'SS040', credits: 5,  subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'APAMGOV',    name: 'AP American Government',   code: 'SS070', credits: 5,  subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1, isAP: true },
  { id: 'PSYCH',      name: 'Psychology',               code: 'SS050', credits: 5,  subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'CONTEMPHIST',name: 'Contemporary History',     code: 'SS060', credits: 5,  subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'INTROPHIL',  name: 'Introduction to Philosophy',code:'SS100', credits: 5,  subject: 'Social Studies', grade: 10, prereqs: [], semesters: 1 },
  { id: 'ECON',       name: 'Economics',                code: 'SS080', credits: 5,  subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'HUMANREL',   name: 'Human Relations',          code: 'FCS830',credits: 5,  subject: 'Social Studies', grade: 11, prereqs: [], semesters: 1 },
  { id: 'FAMISSUES',  name: 'Family Issues',            code: 'FCS850',credits: 5,  subject: 'Social Studies', grade: 11, prereqs: [], semesters: 1 },

  // SPEECH
  { id: 'SPEECHCOM',    name: 'Speech Communication',      code: 'SPE520', credits: 5, subject: 'Speech', grade: 10, prereqs: [], semesters: 1 },
  { id: 'COMPPUBSPEAK', name: 'Competitive Public Speaking',code: 'SPE523', credits: 5, subject: 'Speech', grade: 9,  prereqs: [], semesters: 1 },

  // PE
  { id: 'GIRLSPEHEALTH', name: 'Girls Physical Education & Health', code: 'PE000', credits: 10, subject: 'PE', grade: 9,  prereqs: [], semesters: 2, genderRestriction: 'female' },
  { id: 'BOYSPEHEALTH',  name: 'Boys Physical Education & Health',  code: 'PE010', credits: 10, subject: 'PE', grade: 9,  prereqs: [], semesters: 2, genderRestriction: 'male'   },
  { id: 'STRENGTH1',     name: 'Strength and Performance Sem. 1',   code: 'PE020', credits: 5,  subject: 'PE', grade: 10, prereqs: [], semesters: 1 },
  { id: 'STRENGTH2',     name: 'Strength and Performance Sem. 2',   code: 'PE030', credits: 5,  subject: 'PE', grade: 10, prereqs: [], semesters: 1 },
  { id: 'BOYSFITNESS',   name: 'Boys Fitness, Recreation & Sport',  code: 'PE045', credits: 5,  subject: 'PE', grade: 10, prereqs: [], semesters: 1, genderRestriction: 'male'   },
  { id: 'GIRLSFITNESS',  name: 'Girls Fitness, Recreation & Sport', code: 'PE055', credits: 5,  subject: 'PE', grade: 10, prereqs: [], semesters: 1, genderRestriction: 'female' },

  // FINE ARTS
  { id: 'ARTFUND',    name: 'Art Fundamentals',          code: 'ART000', credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'ARTFUND2',   name: 'Art Fundamentals II',       code: 'ART250', credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'DRAWING',    name: 'Drawing',                   code: 'ART010', credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVDRAW',    name: 'Advanced Drawing',          code: 'ART020', credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: ['DRAWING'], semesters: 1 },
  { id: 'PAINTING',   name: 'Painting',                  code: 'ART030', credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVPAINT',   name: 'Advanced Painting',         code: 'ART040', credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: ['PAINTING'], semesters: 1 },
  { id: 'GRAPHICDES', name: 'Graphic Design',            code: 'ART050', credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVGRAPHIC', name: 'Advanced Graphic Design',   code: 'ART060', credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: ['GRAPHICDES'], semesters: 1 },
  { id: 'CERAMICS',   name: 'Ceramics/Sculpture',        code: 'ART070', credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVCERAMICS',name: 'Advanced Ceramics/Sculpture',code:'ART080', credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: ['CERAMICS'], semesters: 1 },
  { id: 'DEVOTART',   name: 'Devotional Art',            code: 'ART095', credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVDEVOT',   name: 'Advanced Devotional Art',   code: 'ART150', credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: ['DEVOTART'], semesters: 1 },
  { id: 'PHOTO',      name: 'Photography',               code: 'ART200', credits: 5,  subject: 'Fine Arts', grade: 11, prereqs: [], semesters: 1 },
  { id: 'ADVPHOTO',   name: 'Advanced Photography',      code: 'ART210', credits: 5,  subject: 'Fine Arts', grade: 12, prereqs: ['PHOTO'], semesters: 1 },
  // Band (Marching Sem1 + Concert Sem2 paired as year-long)
  { id: 'BAND',       name: 'Band (Marching + Concert)', code: 'MUS300/310', credits: 10, subject: 'Fine Arts', grade: 9, prereqs: [], semesters: 2, isBandPair: true },
  { id: 'SYMPBAND',   name: 'Symphonic Band',            code: 'MUS320', credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['BAND'], semesters: 1 },
  { id: 'ORCHESTRA',  name: 'Orchestra',                 code: 'MUS325', credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'WOMENCHOIR', name: "Women's Choir",             code: 'MUS335', credits: 10, subject: 'Fine Arts', grade: 9,  prereqs: [], semesters: 2, genderRestriction: 'female' },
  { id: 'MENCHOIR',   name: "Men's Choir",               code: 'MUS345', credits: 10, subject: 'Fine Arts', grade: 9,  prereqs: [], semesters: 2, genderRestriction: 'male' },
  { id: 'SOTTOVOCE',  name: 'Sotto Voce',                code: 'MUS350', credits: 10, subject: 'Fine Arts', grade: 10, prereqs: [], semesters: 2 },
  { id: 'CONCERTCHOIR',name:'Concert Choir',             code: 'MUS380', credits: 10, subject: 'Fine Arts', grade: 10, prereqs: [], semesters: 2 },
  { id: 'MUSICAPP',   name: 'Music Appreciation',        code: 'MUS420', credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: [], semesters: 1 },

  // LIFE SKILLS
  { id: 'COMPAPP',    name: 'Computer Applications',                           code: 'BUS600', credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'ACCT1',      name: 'Accounting I',                                    code: 'BUS630', credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'CAREERMGMT', name: 'Career and Life Management Skills',               code: 'BUS800', credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'FOODNUT',    name: 'Food & Nutrition',                                code: 'FCS810', credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'HOUSING',    name: 'Housing and Interior Design',                     code: 'FCS820', credits: 5,  subject: 'Life Skills', grade: 10, prereqs: [], semesters: 1 },
  { id: 'CHILDDEV',   name: 'Child Development, Care, Guidance & Parenthood', code: 'FCS840', credits: 5,  subject: 'Life Skills', grade: 11, prereqs: [], semesters: 1 },
  { id: 'TEXTILES',   name: 'Textiles, Clothing and Design',                   code: 'FCS860', credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'SMALLENG',   name: 'Small Engines',                                   code: 'IT900',  credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'MACHINEWOOD',name: 'Machine Woodworking',                             code: 'IT910',  credits: 10, subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 2 },

  // WORLD LANGUAGES
  { id: 'FRENCH1',  name: 'French I',   code: 'WL000', credits: 10, subject: 'World Languages', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'FRENCH2',  name: 'French II',  code: 'WL010', credits: 10, subject: 'World Languages', grade: 10, prereqs: ['FRENCH1'], semesters: 2 },
  { id: 'FRENCH3',  name: 'French III', code: 'WL020', credits: 10, subject: 'World Languages', grade: 11, prereqs: ['FRENCH2'], semesters: 2 },
  { id: 'FRENCH4',  name: 'French IV',  code: 'WL030', credits: 10, subject: 'World Languages', grade: 12, prereqs: ['FRENCH3'], semesters: 2 },
  { id: 'SPANISH1', name: 'Spanish I',  code: 'WL040', credits: 10, subject: 'World Languages', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'SPANISH2', name: 'Spanish II', code: 'WL050', credits: 10, subject: 'World Languages', grade: 10, prereqs: ['SPANISH1'], semesters: 2 },
  { id: 'SPANISH3', name: 'Spanish III',code: 'WL060', credits: 10, subject: 'World Languages', grade: 11, prereqs: ['SPANISH2'], semesters: 2 },
  { id: 'SPANISH4', name: 'Spanish IV', code: 'WL070', credits: 10, subject: 'World Languages', grade: 12, prereqs: ['SPANISH3'], semesters: 2 },
  { id: 'LATIN1',   name: 'Latin I',    code: 'WL100', credits: 10, subject: 'World Languages', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'LATIN3',   name: 'Latin III',  code: 'WL120', credits: 10, subject: 'World Languages', grade: 10, prereqs: [], semesters: 2 },
  { id: 'LATIN4',   name: 'Latin IV',   code: 'WL130', credits: 10, subject: 'World Languages', grade: 10, prereqs: [], semesters: 2 },
];

// Starting math options – now includes Diff Algebra II and Algebra II
const MATH_STARTING_OPTIONS = [
  { id: 'ALGESS',   label: 'Algebra Essentials' },
  { id: 'ALG1',     label: 'Algebra I' },
  { id: 'DIFFALG1', label: 'Differentiated Algebra I' },
  { id: 'DIFFGEOM', label: 'Differentiated Geometry' },
  { id: 'GEOM',     label: 'Geometry' },
  { id: 'DIFFALG2', label: 'Differentiated Algebra II' },
  { id: 'ALG2',     label: 'Algebra II' },
];

// ─── Prereq checker ──────────────────────────────────────────────────────────
const checkPrereqs = (catalogCourse, addedCourses) => {
  const addedIds = new Set(addedCourses.map(c => c.id));
  if (catalogCourse.prereqsAllRequired && catalogCourse.prereqsAnyOfGroup) {
    const missingAll = catalogCourse.prereqsAllRequired.filter(id => !addedIds.has(id));
    const anyOfMet   = catalogCourse.prereqsAnyOfGroup.some(id => addedIds.has(id));
    const result = [...missingAll];
    if (!anyOfMet) result.push(...catalogCourse.prereqsAnyOfGroup.filter(id => !addedIds.has(id)));
    return result;
  }
  if (catalogCourse.prereqsAnyOf && !catalogCourse.prereqsAllRequired) {
    if (!catalogCourse.prereqs.some(id => addedIds.has(id)))
      return catalogCourse.prereqs.filter(id => !addedIds.has(id));
    return [];
  }
  return catalogCourse.prereqs.filter(id => !addedIds.has(id));
};

const GRADUATION_REQUIREMENTS = {
  'Theology':       40,
  'English':        40,
  'Social Studies': 35,
  'Math':           30,
  'Science':        30,
  'Speech':          5,
  'PE':             15,
  'Fine Arts':       5,
  'Life Skills':     5,
  'World Languages':20,
};

// ─── Study Hall helpers ───────────────────────────────────────────────────────
// Each study hall is stored as a virtual course with id like STUDYHALL_9_Fall
const makeStudyHall = (year, semester) => ({
  id: `STUDYHALL_${year}_${semester}`,
  name: 'Study Hall',
  code: '—',
  credits: 5,
  subject: 'Study Hall',
  grade: year,
  prereqs: [],
  semesters: 1,
  isStudyHall: true,
  uniqueId: `SH_${year}_${semester}`,
  year,
  semester,
});

const ALL_SEMESTERS = [
  { year: 9,  sem: 'Fall'   }, { year: 9,  sem: 'Spring' },
  { year: 10, sem: 'Fall'   }, { year: 10, sem: 'Spring' },
  { year: 11, sem: 'Fall'   }, { year: 11, sem: 'Spring' },
  { year: 12, sem: 'Fall'   }, { year: 12, sem: 'Spring' },
];

// ─── Intro Screen ─────────────────────────────────────────────────────────────
function IntroScreen({ onComplete }) {
  const [name,         setName]         = useState('');
  const [gender,       setGender]       = useState('');
  const [startingMath, setStartingMath] = useState('');
  const [music,        setMusic]        = useState([]);      // multi-select: 'band', 'choir'
  const [studyHalls,   setStudyHalls]   = useState([]);      // list of "9_Fall", "9_Spring", …

  const toggleMusic = (val) =>
    setMusic(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const toggleStudyHall = (key) =>
    setStudyHalls(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const canSubmit = name.trim() && gender && startingMath;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onComplete({ name: name.trim(), gender, startingMath, music, studyHalls });
  };

  return (
    <div className="intro-overlay">
      <div className="intro-card">
        <div className="intro-header">
          <img
            src="https://piusxcatholic.github.io/course-planner/logo.png"
            alt="Pius X"
            className="intro-logo"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <h1>Pius X 4-Year Course Planner</h1>
          <p className="intro-subtitle">Answer a few questions to personalize your plan.</p>
        </div>

        <div className="intro-body">
          {/* Name */}
          <div className="intro-field">
            <label>Student Name</label>
            <input
              type="text"
              placeholder="First and last name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="intro-input"
            />
          </div>

          {/* Gender */}
          <div className="intro-field">
            <label>Gender</label>
            <div className="intro-toggle-group">
              {['male','female'].map(g => (
                <button key={g}
                  className={`intro-toggle${gender === g ? ' selected' : ''}`}
                  onClick={() => setGender(g)}>
                  {g === 'male' ? 'Male' : 'Female'}
                </button>
              ))}
            </div>
          </div>

          {/* Starting Math */}
          <div className="intro-field">
            <label>Starting Math Course (9th Grade)</label>
            <div className="intro-option-list">
              {MATH_STARTING_OPTIONS.map(opt => (
                <button key={opt.id}
                  className={`intro-option${startingMath === opt.id ? ' selected' : ''}`}
                  onClick={() => setStartingMath(opt.id)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Music – multi-select */}
          <div className="intro-field">
            <label>Music (select all that apply)</label>
            <div className="intro-toggle-group">
              {[
                { val: 'band',  label: 'Band'  },
                { val: 'choir', label: 'Choir' },
              ].map(opt => (
                <button key={opt.val}
                  className={`intro-toggle${music.includes(opt.val) ? ' selected' : ''}`}
                  onClick={() => toggleMusic(opt.val)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Study Hall – choose any semesters */}
          <div className="intro-field">
            <label>Study Hall Periods (select any semesters)</label>
            <div className="intro-sh-grid">
              {ALL_SEMESTERS.map(({ year, sem }) => {
                const key = `${year}_${sem}`;
                const label = `Gr ${year} ${sem}`;
                return (
                  <button key={key}
                    className={`intro-sh-btn${studyHalls.includes(key) ? ' selected' : ''}`}
                    onClick={() => toggleStudyHall(key)}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="intro-footer">
          <button className="intro-submit" onClick={handleSubmit} disabled={!canSubmit}>
            Build My Plan →
          </button>
          {!canSubmit && (
            <p className="intro-hint">Please enter your name, gender, and starting math course.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [studentInfo,     setStudentInfo]     = useState(null);
  const [courses,         setCourses]         = useState([]);
  const [viewMode,        setViewMode]        = useState('semester');
  const [searchTerm,      setSearchTerm]      = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showPrereqModal, setShowPrereqModal] = useState(false);
  const [prereqError,     setPrereqError]     = useState(null);
  const printRef = useRef(null);

  useEffect(() => {
    const si = localStorage.getItem('piusXStudentInfo');
    const sc = localStorage.getItem('piusXCoursePlan');
    if (si) { try { setStudentInfo(JSON.parse(si)); } catch(e){} }
    if (sc) { try { setCourses(JSON.parse(sc));     } catch(e){} }
  }, []);

  useEffect(() => {
    localStorage.setItem('piusXCoursePlan', JSON.stringify(courses));
  }, [courses]);

  // ── Seeding from intro ───────────────────────────────────────────────────
  const handleIntroComplete = (info) => {
    setStudentInfo(info);
    localStorage.setItem('piusXStudentInfo', JSON.stringify(info));

    const seed = [];
    const now  = Date.now();

    // Theology I–IV
    ['THEO1','THEO2','THEO3','THEO4'].forEach((id, i) => {
      const c = COURSE_CATALOG.find(x => x.id === id);
      if (c) seed.push({ ...c, uniqueId: now + i, year: 9 + i, semester: 'Fall' });
    });

    // Starting math – place in correct grade
    const mathOpt  = MATH_STARTING_OPTIONS.find(o => o.id === info.startingMath);
    const mathGrade = ['DIFFALG2','ALG2'].includes(info.startingMath) ? 10 :
                      ['GEOM','DIFFGEOM'].includes(info.startingMath) ? 9 : 9;
    const mathC = COURSE_CATALOG.find(x => x.id === info.startingMath);
    if (mathC) seed.push({ ...mathC, uniqueId: now + 10, year: mathGrade, semester: 'Fall' });

    // PE
    const peId = info.gender === 'female' ? 'GIRLSPEHEALTH' : 'BOYSPEHEALTH';
    const pe   = COURSE_CATALOG.find(x => x.id === peId);
    if (pe) seed.push({ ...pe, uniqueId: now + 11, year: 9, semester: 'Fall' });

    // Band
    if (info.music.includes('band')) {
      const band = COURSE_CATALOG.find(x => x.id === 'BAND');
      if (band) seed.push({ ...band, uniqueId: now + 12, year: 9, semester: 'Fall' });
    }

    // Choir
    if (info.music.includes('choir')) {
      const choirId = info.gender === 'female' ? 'WOMENCHOIR' : 'MENCHOIR';
      const choir   = COURSE_CATALOG.find(x => x.id === choirId);
      if (choir) seed.push({ ...choir, uniqueId: now + 13, year: 9, semester: 'Fall' });
    }

    // Study halls
    info.studyHalls.forEach((key, i) => {
      const [yr, sem] = key.split('_');
      seed.push(makeStudyHall(parseInt(yr), sem));
    });

    setCourses(seed);
  };

  const resetPlan = () => {
    if (!window.confirm('Start over? This will clear your entire plan.')) return;
    setStudentInfo(null);
    setCourses([]);
    localStorage.removeItem('piusXStudentInfo');
    localStorage.removeItem('piusXCoursePlan');
  };

  // ── Add / Delete ─────────────────────────────────────────────────────────
  const addCourse = (catalogCourse) => {
    // Block study halls through normal add (they're set at intro or via toggles)
    const missing = checkPrereqs(catalogCourse, courses);
    if (missing.length > 0) {
      setPrereqError({
        courseName:    catalogCourse.name,
        missingPrereqs: missing,
        missingNames:  missing.map(id => COURSE_CATALOG.find(x => x.id === id)?.name || id),
        isAnyOf:       catalogCourse.prereqsAnyOf && !catalogCourse.prereqsAllRequired,
      });
      setShowPrereqModal(true);
      return;
    }
    const newCourse = { ...catalogCourse, uniqueId: Date.now(), year: catalogCourse.grade || 9, semester: 'Fall' };
    let newCourses  = [...courses, newCourse];
    if (catalogCourse.id === 'THEO1') {
      ['THEO2','THEO3','THEO4'].forEach((id, i) => {
        const c = COURSE_CATALOG.find(x => x.id === id);
        if (c) newCourses.push({ ...c, uniqueId: Date.now() + i + 1, year: 10 + i, semester: 'Fall' });
      });
    }
    setCourses(newCourses);
  };

  const addMissingPrereq = (prereqId) => {
    const c = COURSE_CATALOG.find(x => x.id === prereqId);
    if (c) { addCourse(c); setShowPrereqModal(false); }
  };

  const deleteCourse = (uniqueId) => {
    const toDelete   = courses.find(c => c.uniqueId === uniqueId);
    if (!toDelete) return;
    const dependents = courses.filter(c => c.prereqs && c.prereqs.includes(toDelete.id));
    if (dependents.length > 0) {
      if (!window.confirm(`Removing ${toDelete.name} will also remove: ${dependents.map(c => c.name).join(', ')}. Continue?`)) return;
      const ids = [uniqueId, ...dependents.map(c => c.uniqueId)];
      setCourses(courses.filter(c => !ids.includes(c.uniqueId)));
    } else {
      setCourses(courses.filter(c => c.uniqueId !== uniqueId));
    }
  };

  // ── Study Hall toggles post-intro ─────────────────────────────────────────
  const toggleStudyHall = (year, semester) => {
    const shId = `SH_${year}_${semester}`;
    const exists = courses.find(c => c.uniqueId === shId);
    if (exists) {
      setCourses(courses.filter(c => c.uniqueId !== shId));
    } else {
      setCourses([...courses, makeStudyHall(year, semester)]);
    }
  };

  // ── Computed stats ────────────────────────────────────────────────────────
  const getYearLabel = (yr) => ({ 9:'Freshman', 10:'Sophomore', 11:'Junior', 12:'Senior' }[yr] || yr);

  const nonSHCourses = courses.filter(c => !c.isStudyHall);
  const totalCredits = nonSHCourses.reduce((s, c) => s + c.credits, 0);
  const apCredits    = nonSHCourses.filter(c => c.isAP).reduce((s, c) => s + c.credits, 0);
  const dualCredits  = nonSHCourses.filter(c => c.isDual).reduce((s, c) => s + c.credits, 0);

  const calculateProgress = () => {
    const prog = {};
    Object.keys(GRADUATION_REQUIREMENTS).forEach(subject => {
      const earned = nonSHCourses.filter(c => c.subject === subject).reduce((s, c) => s + c.credits, 0);
      prog[subject] = {
        earned,
        required:   GRADUATION_REQUIREMENTS[subject],
        percentage: Math.min(100, (earned / GRADUATION_REQUIREMENTS[subject]) * 100),
      };
    });
    return prog;
  };

  const progress = calculateProgress();
  const subjects  = Object.keys(GRADUATION_REQUIREMENTS);

  // ── Catalog filter ────────────────────────────────────────────────────────
  const filteredCatalog = COURSE_CATALOG.filter(course => {
    const matchesSearch  = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
    const notAdded       = !courses.some(c => c.id === course.id);
    const genderOk       = !course.genderRestriction || !studentInfo ||
                           course.genderRestriction === studentInfo.gender;
    return matchesSearch && matchesSubject && notAdded && genderOk;
  });

  // ── Semester grouping ─────────────────────────────────────────────────────
  const groupBySemester = () => {
    const g = {
      9:  { Fall:[], Spring:[] },
      10: { Fall:[], Spring:[] },
      11: { Fall:[], Spring:[] },
      12: { Fall:[], Spring:[] },
    };
    courses.forEach(course => {
      if (!g[course.year]) return;
      if (course.semesters === 2) {
        // Year-long: appears in BOTH columns but credits only counted in Fall
        g[course.year].Fall.push({ ...course, _countCredits: true });
        g[course.year].Spring.push({ ...course, isSecondSemester: true, _countCredits: false });
      } else {
        g[course.year][course.semester].push({ ...course, _countCredits: true });
      }
    });
    return g;
  };

  const groupBySubject = () => {
    const g = {};
    subjects.forEach(s => { g[s] = nonSHCourses.filter(c => c.subject === s); });
    return g;
  };

  const semesterGroups = groupBySemester();
  const subjectGroups  = groupBySubject();

  // ── Prereq label ──────────────────────────────────────────────────────────
  const getPrereqLabel = (course) => {
    if (!course.prereqs || course.prereqs.length === 0) return null;
    if (course.prereqsAllRequired && course.prereqsAnyOfGroup) {
      const rn = course.prereqsAllRequired.map(id => COURSE_CATALOG.find(x => x.id === id)?.name || id);
      const an = course.prereqsAnyOfGroup.map(id => COURSE_CATALOG.find(x => x.id === id)?.name || id);
      return `Prereq: ${rn.join(', ')} AND (${an.join(' or ')})`;
    }
    const names = course.prereqs.map(id => COURSE_CATALOG.find(x => x.id === id)?.name || id);
    return course.prereqsAnyOf ? `Prereq (any one): ${names.join(' or ')}` : `Prereq: ${names.join(', ')}`;
  };

  // ── Export / Print / Email ────────────────────────────────────────────────
  const handlePrint = () => window.print();

  const handleEmail = () => {
    const lines = [];
    lines.push(`Pius X 4-Year Course Plan — ${studentInfo?.name || ''}`);
    lines.push('');
    [9,10,11,12].forEach(year => {
      lines.push(`=== ${getYearLabel(year)} (Grade ${year}) ===`);
      ['Fall','Spring'].forEach(sem => {
        lines.push(`  ${sem}:`);
        semesterGroups[year][sem].forEach(c => {
          if (!c.isSecondSemester) {
            lines.push(`    - ${c.name} (${c.credits} cr)`);
          }
        });
      });
      lines.push('');
    });
    lines.push(`Total Credits: ${totalCredits} / 230`);
    if (apCredits > 0)   lines.push(`AP Credits: ${apCredits}`);
    if (dualCredits > 0) lines.push(`Dual-Enrollment Credits: ${dualCredits}`);
    const body = encodeURIComponent(lines.join('\n'));
    const subject = encodeURIComponent(`Pius X Course Plan — ${studentInfo?.name || ''}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // ── Guard: show intro ─────────────────────────────────────────────────────
  if (!studentInfo) return <IntroScreen onComplete={handleIntroComplete} />;

  const firstName = studentInfo.name.split(' ')[0];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app" ref={printRef}>

      {/* ── Header ── */}
      <header className="header">
        <div className="header-left">
          <img
            src="https://piusxcatholic.github.io/course-planner/logo.png"
            alt="Pius X"
            className="header-logo"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div>
            <h1>Pius X 4-Year Course Planner for {firstName}</h1>
          </div>
        </div>
        <div className="header-right">
          <div className="view-toggle">
            <button className={viewMode === 'semester' ? 'active' : ''} onClick={() => setViewMode('semester')}>Schedule View</button>
            <button className={viewMode === 'subject'  ? 'active' : ''} onClick={() => setViewMode('subject')}>Subject View</button>
          </div>
          <div className="header-actions">
            <button className="btn-action" onClick={handlePrint} title="Print">🖨 Print</button>
            <button className="btn-action" onClick={handleEmail} title="Email">✉ Email</button>
            <button className="btn-reset"  onClick={resetPlan}>Start Over</button>
          </div>
        </div>
      </header>

      {/* ── Progress Dashboard ── */}
      <div className="progress-dashboard">
        <div className="dashboard-top">
          <div className="total-credits-block">
            <div className="total-credits-label">Total Credits</div>
            <div className="total-credits-value">{totalCredits} <span className="total-denom">/ 230</span></div>
            <div className="progress-bar" style={{marginTop:6}}>
              <div className="progress-fill" style={{ width: `${Math.min(100,(totalCredits/230)*100)}%` }}></div>
            </div>
          </div>
          {apCredits > 0 && (
            <div className="badge-block badge-ap">
              <div className="badge-label">AP Credits</div>
              <div className="badge-value">{apCredits}</div>
            </div>
          )}
          {dualCredits > 0 && (
            <div className="badge-block badge-dual">
              <div className="badge-label">Dual-Enrollment Credits</div>
              <div className="badge-value">{dualCredits}</div>
            </div>
          )}
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
                  className={`progress-fill${progress[subject].earned >= progress[subject].required ? ' complete' : ''}`}
                  style={{ width: `${progress[subject].percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two-Column Main Layout ── */}
      <div className="main-columns">

        {/* LEFT: Add Courses */}
        <div className="col-add-courses">
          <h2 className="col-heading">Add Courses</h2>
          <div className="search-controls">
            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="subject-filter">
              <option value="all">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="course-catalog">
            {filteredCatalog.length === 0 && <p className="empty-catalog">No courses match.</p>}
            {filteredCatalog.map(course => {
              const prereqLabel  = getPrereqLabel(course);
              const meetsPrereqs = checkPrereqs(course, courses).length === 0;
              return (
                <div key={course.id} className={`catalog-course-card${!meetsPrereqs ? ' prereq-blocked' : ''}`}>
                  <div className="course-info">
                    <h4>
                      {course.name}
                      {course.isAP   && <span className="tag tag-ap">AP</span>}
                      {course.isDual && <span className="tag tag-dual">Dual</span>}
                    </h4>
                    <p className="course-meta">{course.code} · {course.credits} cr · {course.subject}</p>
                    {course.isBandPair && <p className="band-badge">Sem 1 (Marching) + Sem 2 (Concert)</p>}
                    {prereqLabel && (
                      <p className={`prereq-info${meetsPrereqs ? ' prereq-met' : ' prereq-unmet'}`}>
                        {meetsPrereqs ? '✓ ' : '🔒 '}{prereqLabel}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => addCourse(course)}
                    className={`btn-add-course${!meetsPrereqs ? ' btn-blocked' : ''}`}
                  >
                    {meetsPrereqs ? 'Add' : 'Locked'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Schedule / Subject View */}
        <div className="col-plan">

          {viewMode === 'semester' && (
            <div className="semester-view">
              {[9,10,11,12].map(year => (
                <div key={year} className="year-section">
                  <h2 className="year-heading">{getYearLabel(year)} — Grade {year}</h2>
                  <div className="semesters-row">
                    {['Fall','Spring'].map(semester => {
                      const semCourses = semesterGroups[year][semester];
                      // Only count credits for courses where _countCredits is true (avoids double-counting year-long)
                      const semCredits = semCourses
                        .filter(c => c._countCredits)
                        .reduce((s, c) => s + c.credits, 0);
                      // Periods: each 5-credit course = 1 period; 10-credit year-long = 1 period (counted once in Fall)
                      const semPeriods = semCourses
                        .filter(c => c._countCredits)
                        .reduce((s, c) => s + (c.semesters === 2 ? 1 : c.credits / 5), 0);
                      const shExists = courses.some(c => c.uniqueId === `SH_${year}_${semester}`);

                      return (
                        <div key={semester} className="semester-column">
                          <div className="semester-col-header">
                            <h3 className="semester-heading">{semester}</h3>
                            <button
                              className={`btn-studyhall${shExists ? ' active' : ''}`}
                              onClick={() => toggleStudyHall(year, semester)}
                              title={shExists ? 'Remove Study Hall' : 'Add Study Hall'}
                            >
                              {shExists ? '− Study Hall' : '+ Study Hall'}
                            </button>
                          </div>
                          <div className="courses-list">
                            {semCourses.map(course => (
                              <div
                                key={course.uniqueId + (course.isSecondSemester ? '-sp' : '')}
                                className={`course-card${course.isStudyHall ? ' course-card-sh' : ''}`}
                              >
                                <div className="course-card-header">
                                  <h4>
                                    {course.isBandPair
                                      ? (course.isSecondSemester ? 'Concert Band' : 'Marching Band')
                                      : course.name}
                                    {course.isAP   && <span className="tag tag-ap">AP</span>}
                                    {course.isDual && <span className="tag tag-dual">Dual</span>}
                                  </h4>
                                  {!course.isSecondSemester && (
                                    <button onClick={() => deleteCourse(course.uniqueId)} className="btn-delete">×</button>
                                  )}
                                </div>
                                <p className="course-meta">{course.code}</p>
                                <p className="course-meta">
                                  {course.semesters === 2 ? `${course.credits} cr (Year-long)` : `${course.credits} cr`}
                                </p>
                                <p className="course-meta course-subject-tag">{course.subject}</p>
                              </div>
                            ))}
                          </div>
                          <div className="semester-credits">
                            {semCredits} cr · {Math.round(semPeriods)} of 8 periods
                          </div>
                        </div>
                      );
                    })}
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
                        {progress[subject].earned} / {progress[subject].required} cr
                      </span>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill${progress[subject].earned >= progress[subject].required ? ' complete' : ''}`}
                          style={{ width: `${progress[subject].percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="subject-courses">
                    {subjectGroups[subject].length === 0
                      ? <p className="empty-subject">No courses added yet</p>
                      : subjectGroups[subject].map(course => (
                          <div key={course.uniqueId} className="course-card">
                            <div className="course-card-header">
                              <div>
                                <h4>
                                  {course.name}
                                  {course.isAP   && <span className="tag tag-ap">AP</span>}
                                  {course.isDual && <span className="tag tag-dual">Dual</span>}
                                </h4>
                                <p className="course-meta">{getYearLabel(course.year)} · {course.semester}</p>
                              </div>
                              <button onClick={() => deleteCourse(course.uniqueId)} className="btn-delete">×</button>
                            </div>
                            <p className="course-meta">{course.code} · {course.credits} cr</p>
                          </div>
                        ))
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Prereq Modal ── */}
      {showPrereqModal && prereqError && (
        <div className="modal-overlay" onClick={() => setShowPrereqModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Prerequisite Required</h3>
              <button onClick={() => setShowPrereqModal(false)} className="btn-close">×</button>
            </div>
            <div className="modal-body">
              <p>
                Cannot add <strong>{prereqError.courseName}</strong>.{' '}
                {prereqError.isAnyOf ? 'Complete at least one of:' : 'Complete the following first:'}
              </p>
              <ul className="prereq-list">
                {prereqError.missingNames.map((name, i) => <li key={i}>{name}</li>)}
              </ul>
              <div className="modal-actions">
                {prereqError.missingPrereqs.map((id, i) => (
                  <button key={id} onClick={() => addMissingPrereq(id)} className="btn-add-prereq">
                    Add {prereqError.missingNames[i]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
