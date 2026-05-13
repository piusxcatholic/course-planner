import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

// ─── Misc / virtual courses (not from catalog, added via special UI) ──────────
const MISC_OPTIONS = [
  { id: 'STUDYHALL',   name: 'Study Hall',              code: '—',      credits: 5, subject: 'Miscellaneous', semesters: 1, isMisc: true },
  { id: 'TA',          name: "Teacher's Assistant",     code: 'TA',     credits: 5, subject: 'Miscellaneous', semesters: 1, isMisc: true },
  { id: 'FRONTOFFICE', name: 'Front Office Assistant',  code: 'FOA',    credits: 5, subject: 'Miscellaneous', semesters: 1, isMisc: true },
];

const COURSE_CATALOG = [
  // THEOLOGY
  { id: 'THEO1', name: 'Theology I',   code: 'THEO1', credits: 10, subject: 'Theology', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'THEO2', name: 'Theology II',  code: 'THEO2', credits: 10, subject: 'Theology', grade: 10, prereqs: ['THEO1'], semesters: 2 },
  { id: 'THEO3', name: 'Theology III', code: 'THEO3', credits: 10, subject: 'Theology', grade: 11, prereqs: ['THEO2'], semesters: 2 },
  { id: 'THEO4', name: 'Theology IV',  code: 'THEO4', credits: 10, subject: 'Theology', grade: 12, prereqs: ['THEO3'], semesters: 2 },
  // ENGLISH
  { id: 'ENG1',         name: 'English I',             code: 'ENG1',   credits: 10, subject: 'English', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'ENG2',         name: 'English II',            code: 'ENG2',   credits: 10, subject: 'English', grade: 10, prereqs: ['ENG1'], semesters: 2 },
  { id: 'ENG3',         name: 'English III',           code: 'ENG3',   credits: 10, subject: 'English', grade: 11, prereqs: ['ENG2'], semesters: 2 },
  { id: 'COLPREPWRITE', name: 'College Prep Writing',  code: 'ENG205', credits: 5,  subject: 'English', grade: 11, prereqs: [], semesters: 1 },
  { id: 'CREWRITE',     name: 'Creative Writing',      code: 'ENG100', credits: 5,  subject: 'English', grade: 11, prereqs: [], semesters: 1 },
  { id: 'CLASSLIT1',    name: 'Classic Literature I',  code: 'ENG210', credits: 10, subject: 'English', grade: 11, prereqs: ['ENG2'], semesters: 2 },
  { id: 'CLASSLIT2',    name: 'Classic Literature II', code: 'ENG220', credits: 10, subject: 'English', grade: 12, prereqs: ['CLASSLIT1'], semesters: 2 },
  { id: 'ENG4',         name: 'English IV',            code: 'ENG035', credits: 5,  subject: 'English', grade: 12, prereqs: [], semesters: 1 },
  { id: 'APENGLIT',     name: 'AP English Literature', code: 'ENG110', credits: 10, subject: 'English', grade: 12, prereqs: [], semesters: 2, isAP: true },
  { id: 'JOURN1',       name: 'Journalism I',          code: 'ENG190', credits: 10, subject: 'English', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'JOURN2',       name: 'Journalism II',         code: 'ENG195', credits: 10, subject: 'English', grade: 10, prereqs: ['JOURN1'], semesters: 2 },
  { id: 'YEARBOOK',     name: 'Yearbook',              code: 'ENG200', credits: 10, subject: 'English', grade: 10, prereqs: [], semesters: 2 },
  // MATH
  { id: 'ALGESS',    name: 'Algebra Essentials',        code: 'MATH075', credits: 10, subject: 'Math', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'ALG1',      name: 'Algebra I',                 code: 'MATH070', credits: 10, subject: 'Math', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'DIFFALG1',  name: 'Differentiated Algebra I',  code: 'MATH000', credits: 10, subject: 'Math', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'DIFFGEOM',  name: 'Differentiated Geometry',   code: 'MATH010', credits: 10, subject: 'Math', grade: 9,  prereqs: ['DIFFALG1'], semesters: 2 },
  { id: 'GEOM',      name: 'Geometry',                  code: 'MATH090', credits: 10, subject: 'Math', grade: 10, prereqs: ['ALG1','DIFFALG1'], prereqsAnyOf: true, semesters: 2 },
  { id: 'DIFFALG2',  name: 'Differentiated Algebra II', code: 'MATH020', credits: 10, subject: 'Math', grade: 10, prereqs: ['DIFFGEOM','GEOM'], prereqsAnyOf: true, semesters: 2 },
  { id: 'ALG2',      name: 'Algebra II',                code: 'MATH100', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG1','DIFFALG1'], prereqsAnyOf: true, semesters: 2 },
  { id: 'APSTATS',   name: 'AP Statistics',             code: 'MATH040', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG2','DIFFALG2'], prereqsAnyOf: true, semesters: 2, isAP: true },
  { id: 'STATS',     name: 'Statistics',                code: 'MATH135', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG2','DIFFALG2'], prereqsAnyOf: true, semesters: 2 },
  { id: 'TRIG',      name: 'Trigonometry',              code: 'MATH136', credits: 10, subject: 'Math', grade: 11, prereqs: ['ALG2','DIFFALG2'], prereqsAnyOf: true, semesters: 2 },
  { id: 'PRECALC',   name: 'Pre-Calculus',              code: 'MATH030', credits: 10, subject: 'Math', grade: 11, prereqs: ['DIFFALG2'], semesters: 2 },
  { id: 'ADVMATH',   name: 'Advanced Math',             code: 'MATH110', credits: 10, subject: 'Math', grade: 12, prereqs: ['ALG2','DIFFALG2'], prereqsAnyOf: true, semesters: 2 },
  { id: 'APPRECALC', name: 'AP Pre-Calculus',           code: 'MATH035', credits: 10, subject: 'Math', grade: 11, prereqs: ['DIFFALG2'], semesters: 2, isAP: true },
  { id: 'APCALC',    name: 'AP Calculus',               code: 'MATH050', credits: 10, subject: 'Math', grade: 12, prereqs: ['PRECALC'], semesters: 2, isAP: true },
  { id: 'APCALCPACE',name: 'AP Calculus (PACE)',        code: 'MATH060', credits: 10, subject: 'Math', grade: 12, prereqs: ['PRECALC'], semesters: 2, isAP: true, isDual: true },
  // SCIENCE
  { id: 'PHYSCI',    name: 'Physical Science',           code: 'SCI000', credits: 10, subject: 'Science', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'BIO',       name: 'Biology',                    code: 'SCI010', credits: 10, subject: 'Science', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'CHEM',      name: 'Chemistry',                  code: 'SCI020', credits: 10, subject: 'Science', grade: 10, prereqs: ['BIO'], semesters: 2 },
  { id: 'EARTHSCI',  name: 'Earth, Energy & Environment',code: 'SCI090', credits: 10, subject: 'Science', grade: 11, prereqs: ['BIO','PHYSCI','CHEM'], prereqsAllRequired: ['BIO'], prereqsAnyOf: true, prereqsAnyOfGroup: ['PHYSCI','CHEM'], semesters: 2 },
  { id: 'PHYSICS',   name: 'Physics',                    code: 'SCI030', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM','GEOM'], semesters: 2 },
  { id: 'ACCPHYS',   name: 'Accelerated Physics',        code: 'SCI070', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM','PRECALC'], semesters: 2 },
  { id: 'ANATPHYS',  name: 'Anatomy and Physiology',     code: 'SCI050', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM'], semesters: 2 },
  { id: 'APENVSCI',  name: 'AP Environmental Science',   code: 'SCI100', credits: 10, subject: 'Science', grade: 11, prereqs: ['CHEM','ALG2','DIFFALG2'], prereqsAllRequired: ['CHEM'], prereqsAnyOf: true, prereqsAnyOfGroup: ['ALG2','DIFFALG2'], semesters: 2, isAP: true },
  { id: 'ADVCHEM',   name: 'Advanced Chemistry',         code: 'SCI060', credits: 10, subject: 'Science', grade: 12, prereqs: ['PHYSICS'], semesters: 2 },
  { id: 'APBIO',     name: 'AP Biology',                 code: 'SCI040', credits: 10, subject: 'Science', grade: 12, prereqs: [], semesters: 2, isAP: true },
  { id: 'APPHYSPACE',name: 'AP Physics (PACE)',          code: 'SCI080', credits: 10, subject: 'Science', grade: 12, prereqs: ['PHYSICS','PRECALC'], semesters: 2, isAP: true, isDual: true },
  // SOCIAL STUDIES
  { id: 'WORLDGEO',   name: 'World Geography',           code: 'SS000', credits: 5,  subject: 'Social Studies', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'WORLDHIST',  name: 'World History',             code: 'SS010', credits: 10, subject: 'Social Studies', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'APHUMANGEO', name: 'AP Human Geography',        code: 'SS090', credits: 10, subject: 'Social Studies', grade: 10, prereqs: ['WORLDHIST'], semesters: 2, isAP: true },
  { id: 'USHIST',     name: 'United States History',     code: 'SS020', credits: 10, subject: 'Social Studies', grade: 11, prereqs: [], semesters: 2 },
  { id: 'APUSHIST',   name: 'AP United States History',  code: 'SS025', credits: 10, subject: 'Social Studies', grade: 11, prereqs: [], semesters: 2, isAP: true },
  { id: 'AMGOV',      name: 'American Government',       code: 'SS040', credits: 5,  subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'APAMGOV',    name: 'AP American Government',    code: 'SS070', credits: 5,  subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1, isAP: true },
  { id: 'PSYCH',      name: 'Psychology',                code: 'SS050', credits: 5,  subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'CONTEMPHIST',name: 'Contemporary History',      code: 'SS060', credits: 5,  subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'INTROPHIL',  name: 'Introduction to Philosophy',code: 'SS100', credits: 5,  subject: 'Social Studies', grade: 10, prereqs: [], semesters: 1 },
  { id: 'ECON',       name: 'Economics',                 code: 'SS080', credits: 5,  subject: 'Social Studies', grade: 12, prereqs: [], semesters: 1 },
  { id: 'HUMANREL',   name: 'Human Relations',           code: 'FCS830',credits: 5,  subject: 'Social Studies', grade: 11, prereqs: [], semesters: 1 },
  { id: 'FAMISSUES',  name: 'Family Issues',             code: 'FCS850',credits: 5,  subject: 'Social Studies', grade: 11, prereqs: [], semesters: 1 },
  // SPEECH
  { id: 'SPEECHCOM',    name: 'Speech Communication',       code: 'SPE520', credits: 5, subject: 'Speech', grade: 10, prereqs: [], semesters: 1 },
  { id: 'COMPPUBSPEAK', name: 'Competitive Public Speaking', code: 'SPE523', credits: 5, subject: 'Speech', grade: 9,  prereqs: [], semesters: 1 },
  // PE
  { id: 'GIRLSPEHEALTH', name: 'Girls Physical Education & Health', code: 'PE000', credits: 10, subject: 'PE', grade: 9,  prereqs: [], semesters: 2, genderRestriction: 'female' },
  { id: 'BOYSPEHEALTH',  name: 'Boys Physical Education & Health',  code: 'PE010', credits: 10, subject: 'PE', grade: 9,  prereqs: [], semesters: 2, genderRestriction: 'male'   },
  { id: 'STRENGTH1',     name: 'Strength and Performance Sem. 1',   code: 'PE020', credits: 5,  subject: 'PE', grade: 10, prereqs: [], semesters: 1 },
  { id: 'STRENGTH2',     name: 'Strength and Performance Sem. 2',   code: 'PE030', credits: 5,  subject: 'PE', grade: 10, prereqs: [], semesters: 1 },
  { id: 'BOYSFITNESS',   name: 'Boys Fitness, Recreation & Sport',  code: 'PE045', credits: 5,  subject: 'PE', grade: 10, prereqs: [], semesters: 1, genderRestriction: 'male'   },
  { id: 'GIRLSFITNESS',  name: 'Girls Fitness, Recreation & Sport', code: 'PE055', credits: 5,  subject: 'PE', grade: 10, prereqs: [], semesters: 1, genderRestriction: 'female' },
  // FINE ARTS
  { id: 'ARTFUND',    name: 'Art Fundamentals',           code: 'ART000',     credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'ARTFUND2',   name: 'Art Fundamentals II',        code: 'ART250',     credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'DRAWING',    name: 'Drawing',                    code: 'ART010',     credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVDRAW',    name: 'Advanced Drawing',           code: 'ART020',     credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: ['DRAWING'], semesters: 1 },
  { id: 'PAINTING',   name: 'Painting',                   code: 'ART030',     credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVPAINT',   name: 'Advanced Painting',          code: 'ART040',     credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: ['PAINTING'], semesters: 1 },
  { id: 'GRAPHICDES', name: 'Graphic Design',             code: 'ART050',     credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVGRAPHIC', name: 'Advanced Graphic Design',    code: 'ART060',     credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: ['GRAPHICDES'], semesters: 1 },
  { id: 'CERAMICS',   name: 'Ceramics/Sculpture',         code: 'ART070',     credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVCERAMICS',name: 'Advanced Ceramics/Sculpture',code: 'ART080',     credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: ['CERAMICS'], semesters: 1 },
  { id: 'DEVOTART',   name: 'Devotional Art',             code: 'ART095',     credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['ARTFUND'], semesters: 1 },
  { id: 'ADVDEVOT',   name: 'Advanced Devotional Art',    code: 'ART150',     credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: ['DEVOTART'], semesters: 1 },
  { id: 'PHOTO',      name: 'Photography',                code: 'ART200',     credits: 5,  subject: 'Fine Arts', grade: 11, prereqs: [], semesters: 1 },
  { id: 'ADVPHOTO',   name: 'Advanced Photography',       code: 'ART210',     credits: 5,  subject: 'Fine Arts', grade: 12, prereqs: ['PHOTO'], semesters: 1 },
  { id: 'BAND',       name: 'Band (Marching + Concert)',  code: 'MUS300/310', credits: 10, subject: 'Fine Arts', grade: 9,  prereqs: [], semesters: 2, isBandPair: true },
  { id: 'SYMPBAND',   name: 'Symphonic Band',             code: 'MUS320',     credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: ['BAND'], semesters: 1 },
  { id: 'ORCHESTRA',  name: 'Orchestra',                  code: 'MUS325',     credits: 5,  subject: 'Fine Arts', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'WOMENCHOIR', name: "Women's Choir",              code: 'MUS335',     credits: 10, subject: 'Fine Arts', grade: 9,  prereqs: [], semesters: 2, genderRestriction: 'female' },
  { id: 'MENCHOIR',   name: "Men's Choir",                code: 'MUS345',     credits: 10, subject: 'Fine Arts', grade: 9,  prereqs: [], semesters: 2, genderRestriction: 'male' },
  { id: 'SOTTOVOCE',  name: 'Sotto Voce',                 code: 'MUS350',     credits: 10, subject: 'Fine Arts', grade: 10, prereqs: [], semesters: 2 },
  { id: 'CONCERTCHOIR',name:'Concert Choir',              code: 'MUS380',     credits: 10, subject: 'Fine Arts', grade: 10, prereqs: [], semesters: 2 },
  { id: 'MUSICAPP',   name: 'Music Appreciation',         code: 'MUS420',     credits: 5,  subject: 'Fine Arts', grade: 10, prereqs: [], semesters: 1 },
  // LIFE SKILLS
  { id: 'COMPAPP',    name: 'Computer Applications',                            code: 'BUS600', credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'ACCT1',      name: 'Accounting I',                                     code: 'BUS630', credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'CAREERMGMT', name: 'Career and Life Management Skills',                code: 'BUS800', credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'FOODNUT',    name: 'Food & Nutrition',                                 code: 'FCS810', credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'HOUSING',    name: 'Housing and Interior Design',                      code: 'FCS820', credits: 5,  subject: 'Life Skills', grade: 10, prereqs: [], semesters: 1 },
  { id: 'CHILDDEV',   name: 'Child Development, Care, Guidance & Parenthood',  code: 'FCS840', credits: 5,  subject: 'Life Skills', grade: 11, prereqs: [], semesters: 1 },
  { id: 'TEXTILES',   name: 'Textiles, Clothing and Design',                    code: 'FCS860', credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'SMALLENG',   name: 'Small Engines',                                    code: 'IT900',  credits: 5,  subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 1 },
  { id: 'MACHINEWOOD',name: 'Machine Woodworking',                              code: 'IT910',  credits: 10, subject: 'Life Skills', grade: 9,  prereqs: [], semesters: 2 },
  // WORLD LANGUAGES
  { id: 'FRENCH1',  name: 'French I',    code: 'WL000', credits: 10, subject: 'World Languages', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'FRENCH2',  name: 'French II',   code: 'WL010', credits: 10, subject: 'World Languages', grade: 10, prereqs: ['FRENCH1'], semesters: 2 },
  { id: 'FRENCH3',  name: 'French III',  code: 'WL020', credits: 10, subject: 'World Languages', grade: 11, prereqs: ['FRENCH2'], semesters: 2 },
  { id: 'FRENCH4',  name: 'French IV',   code: 'WL030', credits: 10, subject: 'World Languages', grade: 12, prereqs: ['FRENCH3'], semesters: 2 },
  { id: 'SPANISH1', name: 'Spanish I',   code: 'WL040', credits: 10, subject: 'World Languages', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'SPANISH2', name: 'Spanish II',  code: 'WL050', credits: 10, subject: 'World Languages', grade: 10, prereqs: ['SPANISH1'], semesters: 2 },
  { id: 'SPANISH3', name: 'Spanish III', code: 'WL060', credits: 10, subject: 'World Languages', grade: 11, prereqs: ['SPANISH2'], semesters: 2 },
  { id: 'SPANISH4', name: 'Spanish IV',  code: 'WL070', credits: 10, subject: 'World Languages', grade: 12, prereqs: ['SPANISH3'], semesters: 2 },
  { id: 'LATIN1',   name: 'Latin I',     code: 'WL100', credits: 10, subject: 'World Languages', grade: 9,  prereqs: [], semesters: 2 },
  { id: 'LATIN3',   name: 'Latin III',   code: 'WL120', credits: 10, subject: 'World Languages', grade: 10, prereqs: [], semesters: 2 },
  { id: 'LATIN4',   name: 'Latin IV',    code: 'WL130', credits: 10, subject: 'World Languages', grade: 10, prereqs: [], semesters: 2 },
];

const MATH_STARTING_OPTIONS = [
  { id: 'ALGESS',   label: 'Algebra Essentials' },
  { id: 'ALG1',     label: 'Algebra I' },
  { id: 'DIFFALG1', label: 'Differentiated Algebra I' },
  { id: 'DIFFGEOM', label: 'Differentiated Geometry' },
  { id: 'GEOM',     label: 'Geometry' },
  { id: 'DIFFALG2', label: 'Differentiated Algebra II' },
  { id: 'ALG2',     label: 'Algebra II' },
];

const ALL_SEMESTERS = [
  { year: 9,  sem: 'Fall' }, { year: 9,  sem: 'Spring' },
  { year: 10, sem: 'Fall' }, { year: 10, sem: 'Spring' },
  { year: 11, sem: 'Fall' }, { year: 11, sem: 'Spring' },
  { year: 12, sem: 'Fall' }, { year: 12, sem: 'Spring' },
];

const YEAR_LABELS = { 9: 'Freshman', 10: 'Sophomore', 11: 'Junior', 12: 'Senior' };

// Language progression chains: Lang1 id → [Lang2, Lang3, Lang4] by id
const LANGUAGE_CHAINS = {
  FRENCH1:  ['FRENCH2',  'FRENCH3',  'FRENCH4'],
  SPANISH1: ['SPANISH2', 'SPANISH3', 'SPANISH4'],
  LATIN1:   ['LATIN3',   'LATIN4',   null],
};

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
  'World Languages': 20,
};

// ─── Place Course Modal ───────────────────────────────────────────────────────
// Used when adding a course (choose year/sem) AND when moving one (choose new year/sem)
function PlaceCourseModal({ course, title, onConfirm, onCancel }) {
  const isYearLong = course.semesters === 2;
  const [selectedYear, setSelectedYear] = useState(course.grade || 9);
  const [selectedSem,  setSelectedSem]  = useState('Fall');

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal-place" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn-close" onClick={onCancel}>×</button>
        </div>
        <div className="modal-body">
          <p className="modal-course-name">
            <strong>{course.name}</strong>
            {isYearLong && <span className="modal-yearlong-note"> (Year-long — select the year)</span>}
          </p>

          <div className="place-grid">
            {[9, 10, 11, 12].map(yr => (
              <div key={yr} className="place-year-col">
                <div className="place-year-label">{YEAR_LABELS[yr]}</div>
                {isYearLong ? (
                  <button
                    className={`place-slot${selectedYear === yr && selectedSem === 'Fall' ? ' selected' : ''}`}
                    onClick={() => { setSelectedYear(yr); setSelectedSem('Fall'); }}
                  >
                    Grade {yr}
                  </button>
                ) : (
                  ['Fall', 'Spring'].map(sem => (
                    <button
                      key={sem}
                      className={`place-slot${selectedYear === yr && selectedSem === sem ? ' selected' : ''}`}
                      onClick={() => { setSelectedYear(yr); setSelectedSem(sem); }}
                    >
                      {sem}
                    </button>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button
            className="btn-confirm"
            onClick={() => onConfirm(selectedYear, selectedSem)}
          >
            Place Here →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Misc Courses Modal ───────────────────────────────────────────────────────
function MiscModal({ onConfirm, onCancel }) {
  const [selected, setSelected] = useState(null);
  const [selectedYear, setSelectedYear] = useState(9);
  const [selectedSem,  setSelectedSem]  = useState('Fall');

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal-place" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Miscellaneous Course</h3>
          <button className="btn-close" onClick={onCancel}>×</button>
        </div>
        <div className="modal-body">
          <p style={{marginBottom: 10, fontSize: '0.85rem', color: '#555'}}>Choose a course type:</p>
          <div className="misc-option-list">
            {MISC_OPTIONS.map(opt => (
              <button
                key={opt.id}
                className={`intro-option${selected?.id === opt.id ? ' selected' : ''}`}
                onClick={() => setSelected(opt)}
              >
                {opt.name} <span style={{opacity:0.6, fontSize:'0.78rem'}}>· 5 cr per semester</span>
              </button>
            ))}
          </div>

          {selected && (
            <>
              <p style={{margin:'14px 0 8px', fontSize:'0.83rem', fontWeight:700, color:'#444'}}>
                Which semester?
              </p>
              <div className="place-grid">
                {[9, 10, 11, 12].map(yr => (
                  <div key={yr} className="place-year-col">
                    <div className="place-year-label">{YEAR_LABELS[yr]}</div>
                    {['Fall','Spring'].map(sem => (
                      <button
                        key={sem}
                        className={`place-slot${selectedYear === yr && selectedSem === sem ? ' selected' : ''}`}
                        onClick={() => { setSelectedYear(yr); setSelectedSem(sem); }}
                      >
                        {sem}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button
            className="btn-confirm"
            disabled={!selected}
            onClick={() => selected && onConfirm(selected, selectedYear, selectedSem)}
          >
            Add →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Intro Screen ─────────────────────────────────────────────────────────────
function IntroScreen({ onComplete }) {
  const [name,         setName]         = useState('');
  const [gender,       setGender]       = useState('');
  const [startingMath, setStartingMath] = useState('');
  const [music,        setMusic]        = useState([]);

  const toggleMusic = (val) =>
    setMusic(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const canSubmit = name.trim() && gender && startingMath;

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
        </div>

        <div className="intro-footer">
          <button
            className="intro-submit"
            onClick={() => canSubmit && onComplete({ name: name.trim(), gender, startingMath, music })}
            disabled={!canSubmit}
          >
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
  const [activeYear,      setActiveYear]      = useState(9);
  const [searchTerm,      setSearchTerm]      = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Modals
  const [prereqModal,  setPrereqModal]  = useState(null);
  const [placeModal,   setPlaceModal]   = useState(null);
  const [moveModal,    setMoveModal]    = useState(null);
  const [miscModal,    setMiscModal]    = useState(false);
  const [langSuggest,  setLangSuggest]  = useState(null); // { suggestions: [{course, year}] }

  useEffect(() => {
    const si = localStorage.getItem('piusXStudentInfo');
    const sc = localStorage.getItem('piusXCoursePlan');
    if (si) { try { setStudentInfo(JSON.parse(si)); } catch(e){} }
    if (sc) { try { setCourses(JSON.parse(sc));     } catch(e){} }
  }, []);

  useEffect(() => {
    localStorage.setItem('piusXCoursePlan', JSON.stringify(courses));
  }, [courses]);

  // ── Seeding ──────────────────────────────────────────────────────────────
  const handleIntroComplete = (info) => {
    setStudentInfo(info);
    localStorage.setItem('piusXStudentInfo', JSON.stringify(info));
    const seed = [];
    const now  = Date.now();

    ['THEO1','THEO2','THEO3','THEO4'].forEach((id, i) => {
      const c = COURSE_CATALOG.find(x => x.id === id);
      if (c) seed.push({ ...c, uniqueId: now + i, year: 9 + i, semester: 'Fall' });
    });

    const mathGrade = ['DIFFALG2','ALG2'].includes(info.startingMath) ? 10
                    : ['GEOM','DIFFGEOM'].includes(info.startingMath) ? 9 : 9;
    const mathC = COURSE_CATALOG.find(x => x.id === info.startingMath);
    if (mathC) seed.push({ ...mathC, uniqueId: now + 10, year: mathGrade, semester: 'Fall' });

    const peId = info.gender === 'female' ? 'GIRLSPEHEALTH' : 'BOYSPEHEALTH';
    const pe   = COURSE_CATALOG.find(x => x.id === peId);
    if (pe) seed.push({ ...pe, uniqueId: now + 11, year: 9, semester: 'Fall' });

    if (info.music.includes('band')) {
      const band = COURSE_CATALOG.find(x => x.id === 'BAND');
      if (band) {
        [9, 10, 11, 12].forEach((yr, i) => {
          seed.push({ ...band, uniqueId: now + 12 + i, year: yr, semester: 'Fall' });
        });
      }
    }
    if (info.music.includes('choir')) {
      const choirId = info.gender === 'female' ? 'WOMENCHOIR' : 'MENCHOIR';
      const choir   = COURSE_CATALOG.find(x => x.id === choirId);
      if (choir) seed.push({ ...choir, uniqueId: now + 13, year: 9, semester: 'Fall' });
    }

    setCourses(seed);
  };

  const resetPlan = () => {
    if (!window.confirm('Start over? This will clear your entire plan.')) return;
    setStudentInfo(null);
    setCourses([]);
    localStorage.removeItem('piusXStudentInfo');
    localStorage.removeItem('piusXCoursePlan');
  };

  // ── Add course → open place modal ─────────────────────────────────────────
  const requestAddCourse = (catalogCourse) => {
    const missing = checkPrereqs(catalogCourse, courses);
    if (missing.length > 0) {
      setPrereqModal({
        course: catalogCourse,
        missingPrereqs: missing,
        missingNames: missing.map(id => COURSE_CATALOG.find(x => x.id === id)?.name || id),
        isAnyOf: catalogCourse.prereqsAnyOf && !catalogCourse.prereqsAllRequired,
      });
      return;
    }
    setPlaceModal({ course: catalogCourse });
  };

  const confirmPlace = (course, year, semester) => {
    const newCourse = { ...course, uniqueId: Date.now(), year, semester };
    let newCourses  = [...courses, newCourse];

    // Auto-add theology chain
    if (course.id === 'THEO1') {
      ['THEO2','THEO3','THEO4'].forEach((id, i) => {
        const c = COURSE_CATALOG.find(x => x.id === id);
        if (c && !courses.some(x => x.id === id))
          newCourses.push({ ...c, uniqueId: Date.now() + i + 1, year: 10 + i, semester: 'Fall' });
      });
    }

    // Auto-add band for years 10-12 when band is added as a freshman
    if (course.id === 'BAND' && year === 9) {
      const band = COURSE_CATALOG.find(x => x.id === 'BAND');
      if (band) {
        [10, 11, 12].forEach((yr, i) => {
          if (!newCourses.some(x => x.id === 'BAND' && x.year === yr)) {
            newCourses.push({ ...band, uniqueId: Date.now() + 100 + i, year: yr, semester: 'Fall' });
          }
        });
      }
    }

    // Language chain: auto-add Lang2, suggest Lang3 & Lang4
    if (LANGUAGE_CHAINS[course.id] && year === 9) {
      const chain = LANGUAGE_CHAINS[course.id]; // [lang2id, lang3id, lang4id]
      const lang2 = chain[0] ? COURSE_CATALOG.find(x => x.id === chain[0]) : null;
      const lang3 = chain[1] ? COURSE_CATALOG.find(x => x.id === chain[1]) : null;
      const lang4 = chain[2] ? COURSE_CATALOG.find(x => x.id === chain[2]) : null;

      // Auto-add Lang 2 for sophomore year
      if (lang2 && !newCourses.some(x => x.id === lang2.id)) {
        newCourses.push({ ...lang2, uniqueId: Date.now() + 200, year: 10, semester: 'Fall' });
      }

      // Queue suggestion for Lang 3 & 4
      const suggestions = [];
      if (lang3) suggestions.push({ course: lang3, year: 11 });
      if (lang4) suggestions.push({ course: lang4, year: 12 });
      if (suggestions.length > 0) {
        setCourses(newCourses);
        setPlaceModal(null);
        setLangSuggest({ suggestions, pending: [...suggestions], accepted: [] });
        return;
      }
    }

    setCourses(newCourses);
    setPlaceModal(null);
  };

  // ── Language suggestion accept/decline ────────────────────────────────────
  const acceptLangSuggestion = () => {
    if (!langSuggest) return;
    const [current, ...rest] = langSuggest.pending;
    // Add the current suggestion
    setCourses(prev => [
      ...prev,
      { ...current.course, uniqueId: Date.now() + 300, year: current.year, semester: 'Fall' }
    ]);
    if (rest.length > 0) {
      setLangSuggest({ ...langSuggest, pending: rest });
    } else {
      setLangSuggest(null);
    }
  };

  const declineLangSuggestion = () => {
    if (!langSuggest) return;
    const [, ...rest] = langSuggest.pending;
    if (rest.length > 0) {
      setLangSuggest({ ...langSuggest, pending: rest });
    } else {
      setLangSuggest(null);
    }
  };

  // ── Move course → open move modal ─────────────────────────────────────────
  const requestMoveCourse = (course) => {
    setMoveModal({ course });
  };

  const confirmMove = (course, year, semester) => {
    setCourses(courses.map(c =>
      c.uniqueId === course.uniqueId ? { ...c, year, semester } : c
    ));
    setMoveModal(null);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteCourse = (uniqueId) => {
    const toDelete   = courses.find(c => c.uniqueId === uniqueId);
    if (!toDelete) return;
    const dependents = courses.filter(c => c.prereqs && c.prereqs.includes(toDelete.id));
    if (dependents.length > 0) {
      if (!window.confirm(`Removing "${toDelete.name}" will also remove: ${dependents.map(c => c.name).join(', ')}. Continue?`)) return;
      const ids = [uniqueId, ...dependents.map(c => c.uniqueId)];
      setCourses(courses.filter(c => !ids.includes(c.uniqueId)));
    } else {
      setCourses(courses.filter(c => c.uniqueId !== uniqueId));
    }
  };

  // ── Add prereq from modal ─────────────────────────────────────────────────
  const addMissingPrereq = (prereqId) => {
    const c = COURSE_CATALOG.find(x => x.id === prereqId);
    if (c) { setPrereqModal(null); setPlaceModal({ course: c }); }
  };

  // ── Misc course ───────────────────────────────────────────────────────────
  const confirmMisc = (miscOpt, year, semester) => {
    const uniqueId = `MISC_${miscOpt.id}_${year}_${semester}_${Date.now()}`;
    setCourses([...courses, { ...miscOpt, uniqueId, year, semester, isMisc: true }]);
    setMiscModal(false);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const nonMiscCourses = courses.filter(c => !c.isMisc);
  const totalCredits   = nonMiscCourses.reduce((s, c) => s + c.credits, 0);
  const apCredits      = nonMiscCourses.filter(c => c.isAP).reduce((s, c) => s + c.credits, 0);
  const dualCredits    = nonMiscCourses.filter(c => c.isDual).reduce((s, c) => s + c.credits, 0);

  const calculateProgress = () => {
    const prog = {};
    Object.keys(GRADUATION_REQUIREMENTS).forEach(subject => {
      const earned = nonMiscCourses.filter(c => c.subject === subject).reduce((s, c) => s + c.credits, 0);
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
    const g = { 9:{Fall:[],Spring:[]}, 10:{Fall:[],Spring:[]}, 11:{Fall:[],Spring:[]}, 12:{Fall:[],Spring:[]} };
    courses.forEach(course => {
      if (!g[course.year]) return;
      if (course.semesters === 2) {
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
    subjects.forEach(s => { g[s] = nonMiscCourses.filter(c => c.subject === s); });
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

  // ── Export ────────────────────────────────────────────────────────────────
  const handlePrint = () => window.print();

  const handleEmail = () => {
    const lines = [`Pius X 4-Year Course Plan — ${studentInfo?.name || ''}`, ''];
    [9,10,11,12].forEach(year => {
      lines.push(`=== ${YEAR_LABELS[year]} (Grade ${year}) ===`);
      ['Fall','Spring'].forEach(sem => {
        lines.push(`  ${sem}:`);
        semesterGroups[year][sem].forEach(c => {
          if (!c.isSecondSemester) lines.push(`    - ${c.name} (${c.credits} cr)`);
        });
      });
      lines.push('');
    });
    lines.push(`Total Credits: ${totalCredits} / 230`);
    if (apCredits   > 0) lines.push(`AP Credits: ${apCredits}`);
    if (dualCredits > 0) lines.push(`Dual-Enrollment Credits: ${dualCredits}`);
    const body    = encodeURIComponent(lines.join('\n'));
    const subject = encodeURIComponent(`Pius X Course Plan — ${studentInfo?.name || ''}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (!studentInfo) return <IntroScreen onComplete={handleIntroComplete} />;

  const firstName = studentInfo.name.split(' ')[0];

  // ── Missing required subjects per year ────────────────────────────────────
  // Returns array of display strings for subjects not yet covered in that grade
  const REQUIRED_SUBJECTS_BY_YEAR = {
    9:  ['Theology', 'Math', 'Science', 'PE', 'English', 'Social Studies'],
    10: ['Theology', 'Math', 'Science', 'English', 'Social Studies'],
    11: ['Theology', 'Math', 'Science', 'English'],
    12: ['Theology', 'Science', 'English'],
  };
  // Social studies special rules per year
  const SS_REQUIRED = {
    11: { ids: ['USHIST', 'APUSHIST'],  label: 'US History' },
    12: { ids: ['AMGOV',  'APAMGOV'],   label: 'Am. Government' },
  };

  const getMissingSubjects = (year) => {
    const required = REQUIRED_SUBJECTS_BY_YEAR[year] || [];
    const yearCourses = courses.filter(c => c.year === year && !c.isMisc);
    const missing = [];

    required.forEach(subject => {
      if (subject === 'Social Studies' && SS_REQUIRED[year]) {
        // Check specifically for the required SS course
        const { ids, label } = SS_REQUIRED[year];
        const hasCourse = yearCourses.some(c => ids.includes(c.id));
        if (!hasCourse) missing.push(label);
      } else {
        const hasCourse = yearCourses.some(c => c.subject === subject);
        if (!hasCourse) {
          // Capitalize first letter only
          missing.push(subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase());
        }
      }
    });

    return missing;
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img
            src="https://piusxcatholic.github.io/course-planner/logo.png"
            alt="Pius X"
            className="header-logo"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <h1>Pius X 4-Year Course Planner for {firstName}</h1>
        </div>
        <div className="header-right">
          <div className="view-toggle">
            <button className={viewMode === 'semester' ? 'active' : ''} onClick={() => setViewMode('semester')}>Schedule View</button>
            <button className={viewMode === 'subject'  ? 'active' : ''} onClick={() => setViewMode('subject')}>Subject View</button>
          </div>
          <div className="header-actions">
            <button className="btn-action" onClick={handlePrint}>🖨 Print</button>
            <button className="btn-action" onClick={handleEmail}>✉ Email</button>
            <button className="btn-reset"  onClick={resetPlan}>Start Over</button>
          </div>
        </div>
      </header>

      {/* Progress Dashboard */}
      <div className="progress-dashboard">
        <div className="dashboard-top">
          <div className="total-credits-block">
            <div className="total-credits-label">Total Credits</div>
            <div className="total-credits-value">{totalCredits} <span className="total-denom">/ 230</span></div>
            <div className="progress-bar" style={{marginTop:5}}>
              <div className="progress-fill" style={{ width: `${Math.min(100,(totalCredits/230)*100)}%` }}></div>
            </div>
          </div>
          {apCredits > 0 && (
            <div className="badge-block badge-ap">
              <div className="badge-label">AP Credits</div>
              <div className="badge-value">{apCredits}</div>
            </div>
          )}
          <div className="badge-block badge-dual">
            <div className="badge-label">Dual-Enrollment Credits</div>
            <div className="badge-value">{dualCredits}</div>
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
                  className={`progress-fill${progress[subject].earned >= progress[subject].required ? ' complete' : ''}`}
                  style={{ width: `${progress[subject].percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Layout */}
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

          {/* Misc courses button */}
          <div className="misc-bar">
            <button className="btn-misc" onClick={() => setMiscModal(true)}>
              + Miscellaneous Course
            </button>
            <span className="misc-hint">Study Hall, Teacher's Assistant, Front Office</span>
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
                    onClick={() => requestAddCourse(course)}
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

              {/* ── Year stepper (screen only) ── */}
              <div className="year-stepper print-hide">
                {[9,10,11,12].map(yr => (
                  <button
                    key={yr}
                    className={`year-step-btn${activeYear === yr ? ' active' : ''}`}
                    onClick={() => setActiveYear(yr)}
                  >
                    {YEAR_LABELS[yr]}
                  </button>
                ))}
              </div>

              {/* ── Single active year (screen) ── */}
              <div className="print-hide">
                {(() => {
                  const year = activeYear;
                  const missingSubjects = getMissingSubjects(year);
                  return (
                    <div className="year-section">
                      <h2 className="year-heading">
                        <span className="year-heading-title">{YEAR_LABELS[year]} — Grade {year}</span>
                        {missingSubjects.length > 0 && (
                          <span className="year-missing">
                            Still needed: {missingSubjects.join(' · ')}
                          </span>
                        )}
                      </h2>
                      <div className="semesters-row">
                        {['Fall','Spring'].map(semester => {
                          const semCourses = semesterGroups[year][semester];
                          const semCredits = semCourses.filter(c => c._countCredits).reduce((s, c) => s + c.credits, 0);
                          const semPeriods = semCourses.filter(c => c._countCredits)
                            .reduce((s, c) => s + (c.semesters === 2 ? 1 : c.credits / 5), 0);
                          return (
                            <div key={semester} className="semester-column">
                              <h3 className="semester-heading">{semester}</h3>
                              <div className="courses-list">
                                {semCourses.map(course => {
                                  const displayName = course.isBandPair
                                    ? (course.isSecondSemester ? 'Concert Band' : 'Marching Band')
                                    : course.name;
                                  const isMoveable = !course.isSecondSemester;
                                  return (
                                    <div
                                      key={course.uniqueId + (course.isSecondSemester ? '-sp' : '')}
                                      className={`course-card${course.isMisc ? ' course-card-misc' : ''}`}
                                      title={course.code || ''}
                                    >
                                      <div className="course-card-header">
                                        <div className="course-card-name-block">
                                          <h4>
                                            {displayName}
                                            {course.isAP   && <span className="tag tag-ap">AP</span>}
                                            {course.isDual && <span className="tag tag-dual">Dual</span>}
                                          </h4>
                                          <span className="course-duration-label">
                                            {course.semesters === 2 ? 'Year-long' : 'Semester'}
                                          </span>
                                        </div>
                                        {isMoveable && (
                                          <div className="course-card-actions">
                                            <button className="btn-move" onClick={() => requestMoveCourse(course)} title="Move">↕</button>
                                            <button className="btn-delete" onClick={() => deleteCourse(course.uniqueId)} title="Remove">×</button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="semester-credits">
                                {semCredits} cr · {Math.round(semPeriods)} of 8 periods
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* ── Print: all four years, two per page ── */}
              <div className="print-only">
                {[[9,10],[11,12]].map((yearPair, pairIdx) => (
                  <div key={pairIdx} className="print-page-group">
                    {yearPair.map(year => {
                      const missingSubjects = getMissingSubjects(year);
                      return (
                        <div key={year} className="year-section">
                          <h2 className="year-heading">
                            <span className="year-heading-title">{YEAR_LABELS[year]} — Grade {year}</span>
                            {missingSubjects.length > 0 && (
                              <span className="year-missing">Still needed: {missingSubjects.join(' · ')}</span>
                            )}
                          </h2>
                          <div className="semesters-row">
                            {['Fall','Spring'].map(semester => {
                              const semCourses = semesterGroups[year][semester];
                              const semCredits = semCourses.filter(c => c._countCredits).reduce((s, c) => s + c.credits, 0);
                              const semPeriods = semCourses.filter(c => c._countCredits)
                                .reduce((s, c) => s + (c.semesters === 2 ? 1 : c.credits / 5), 0);
                              return (
                                <div key={semester} className="semester-column">
                                  <h3 className="semester-heading">{semester}</h3>
                                  <div className="courses-list">
                                    {semCourses.map(course => {
                                      const displayName = course.isBandPair
                                        ? (course.isSecondSemester ? 'Concert Band' : 'Marching Band')
                                        : course.name;
                                      return (
                                        <div
                                          key={course.uniqueId + (course.isSecondSemester ? '-sp' : '')}
                                          className={`course-card${course.isMisc ? ' course-card-misc' : ''}`}
                                        >
                                          <div className="course-card-header">
                                            <div className="course-card-name-block">
                                              <h4>
                                                {displayName}
                                                {course.isAP   && <span className="tag tag-ap">AP</span>}
                                                {course.isDual && <span className="tag tag-dual">Dual</span>}
                                              </h4>
                                              <span className="course-duration-label">
                                                {course.semesters === 2 ? 'Year-long' : 'Semester'}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="semester-credits">
                                    {semCredits} cr · {Math.round(semPeriods)} of 8 periods
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

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
                                <p className="course-meta">{YEAR_LABELS[course.year]} · {course.semester}</p>
                              </div>
                              <div className="course-card-actions">
                                <button className="btn-move" onClick={() => requestMoveCourse(course)} title="Move">↕</button>
                                <button className="btn-delete" onClick={() => deleteCourse(course.uniqueId)}>×</button>
                              </div>
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

      {/* ── Language Suggestion Modal ── */}
      {langSuggest && langSuggest.pending.length > 0 && (() => {
        const { course, year } = langSuggest.pending[0];
        return (
          <div className="modal-overlay">
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Continue with {course.name.split(' ')[0]}?</h3>
              </div>
              <div className="modal-body">
                <p>
                  Would you like to add <strong>{course.name}</strong> to your{' '}
                  <strong>{YEAR_LABELS[year]}</strong> year?
                </p>
                <p style={{fontSize:'0.8rem', color:'#666', marginTop:6}}>
                  You can always remove it from your schedule later.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={declineLangSuggestion}>Skip</button>
                <button className="btn-confirm" onClick={acceptLangSuggestion}>Yes, add it →</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Place Modal (Add) ── */}
      {placeModal && (
        <PlaceCourseModal
          course={placeModal.course}
          title={`Where should "${placeModal.course.name}" go?`}
          onConfirm={(year, sem) => confirmPlace(placeModal.course, year, sem)}
          onCancel={() => setPlaceModal(null)}
        />
      )}

      {/* ── Move Modal ── */}
      {moveModal && (
        <PlaceCourseModal
          course={moveModal.course}
          title={`Move "${moveModal.course.isBandPair ? 'Band' : moveModal.course.name}" to…`}
          onConfirm={(year, sem) => confirmMove(moveModal.course, year, sem)}
          onCancel={() => setMoveModal(null)}
        />
      )}

      {/* ── Misc Modal ── */}
      {miscModal && (
        <MiscModal
          onConfirm={confirmMisc}
          onCancel={() => setMiscModal(false)}
        />
      )}

      {/* ── Prereq Modal ── */}
      {prereqModal && (
        <div className="modal-overlay" onClick={() => setPrereqModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Prerequisite Required</h3>
              <button className="btn-close" onClick={() => setPrereqModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <p>
                Cannot add <strong>{prereqModal.course.name}</strong>.{' '}
                {prereqModal.isAnyOf ? 'Complete at least one of:' : 'Complete the following first:'}
              </p>
              <ul className="prereq-list">
                {prereqModal.missingNames.map((name, i) => <li key={i}>{name}</li>)}
              </ul>
              <div className="modal-actions">
                {prereqModal.missingPrereqs.map((id, i) => (
                  <button key={id} onClick={() => addMissingPrereq(id)} className="btn-add-prereq">
                    Add {prereqModal.missingNames[i]}
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
