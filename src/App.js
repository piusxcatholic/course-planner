import React, { useState, useEffect } from 'react';
import { GraduationCap, Download, Mail, Trash2, ChevronDown, X, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

const CoursePlanner = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({ 
    firstName: '',
    gender: '',
    studyHall: '',
    band: false, 
    choir: false,
    mathClass: '',
    algebraEssentials: null,
    verifiedAlgebra: null,
    verifiedGeometry: null
  });
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [pendingCourse, setPendingCourse] = useState(null);
  const [expandedDepts, setExpandedDepts] = useState({});
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);

  const careerPathways = {
    'Entrepreneur / Business': [
      'Marketing', 'Business Law', 'Accounting I', 'Accounting II', 'Accounting III',
      'Computer Applications', 'Web Design I', 'Web Design II', 'Digital Media I',
      'Introduction to Programming', 'Computer Science', 'Speech Communication',
      'Competitive Public Speaking', 'College Prep Writing', 'Creative Writing',
      'Graphic Design', 'Advanced Graphic Design', 'Photography', 'Advanced Photography',
      'Engineering Design I', 'AP Statistics', 'AP Calculus', 'Pre-Calculus',
      'AP Physics (PACE)'
    ],
    'Healthcare': [
      'Boys Physical Education & Health', 'Girls Physical Education & Health',
      'AP Biology', 'AP Environmental Science', 'AP Physics (PACE)', 'Psychology',
      'Human Relations', 'Family Issues', 'Child Development, Care, Guidance, & Parenthood Education',
      'Food & Nutrition', 'Introduction to Culinary Arts', 'Speech Communication',
      'College Prep Writing', 'Anatomy and Physiology', 'Chemistry', 'Advanced Chemistry'
    ],
    'Teaching': [
      'Psychology', 'Human Relations', 'Child Development, Care, Guidance, & Parenthood Education',
      'Speech Communication', 'College Prep Writing', 'Creative Writing',
      'AP English Literature', 'Classic Literature I', 'Classic Literature II',
      'AP Biology', 'AP Environmental Science', 'AP Calculus', 'AP Statistics',
      'Differentiated Geometry', 'Differentiated Algebra I', 'Differentiated Algebra II',
      'World History', 'United States History', 'American Government',
      'Spanish I', 'Spanish II', 'Spanish III', 'Spanish IV', 'Latin I', 'Latin III', 'Latin IV',
      'Computer Applications', 'Digital Media I', 'Web Design I', 'Graphic Design'
    ],
    'Financial Industry': [
      'Accounting I', 'Accounting II', 'Accounting III', 'Business Law', 'Marketing',
      'Computer Applications', 'Web Design I', 'Digital Media I',
      'AP Statistics', 'Statistics', 'Trigonometry', 'Pre-Calculus', 'Advanced Math',
      'AP Calculus', 'AP Calculus (PACE)', 'AP Human Geography', 'Economics',
      'Psychology', 'College Prep Writing', 'Speech Communication',
      'Journalism I', 'Journalism II'
    ],
    'Trades and Technical Work': [
      'Engineering Design I', 'AP Physics (PACE)', 'Physics', 'Accelerated Physics',
      'Computer Applications', 'Web Design I', 'Web Design II', 'Digital Media I',
      'Introduction to Culinary Arts', 'Food & Nutrition',
      'Child Development, Care, Guidance, & Parenthood Education',
      'Graphic Design', 'Advanced Graphic Design', 'Photography', 'Advanced Photography',
      'Art Fundamentals', 'Drawing', 'Painting', 'Ceramics/Sculpture',
      'Accounting I', 'Accounting II', 'Marketing', 'Speech Communication',
      'Small Engines', 'Machine Woodworking', 'Building Construction',
      'Architectural Drafting'
    ],
    'Hospitality & Tourism': [
      'Food & Nutrition', 'Introduction to Culinary Arts', 'Marketing',
      'Accounting I', 'Accounting II', 'Accounting III', 'Business Law',
      'Career and Life Management', 'Speech Communication', 'Digital Media I', 'Digital Media II',
      'College Prep Writing', 'World Geography', 'AP Human Geography',
      'Psychology', 'Human Relations', 'Spanish I', 'Spanish II', 'Spanish III', 'Spanish IV',
      'Latin I', 'Housing and Interior Design', 'Graphic Design', 'Advanced Graphic Design',
      'Photography', 'Advanced Photography'
    ]
  };

  useEffect(() => {
    const saved = localStorage.getItem('piusx-planner');
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedCourses(data.selectedCourses || []);
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    if (!showWelcome) {
      localStorage.setItem('piusx-planner', JSON.stringify({
        selectedCourses
      }));
    }
  }, [selectedCourses, showWelcome]);

  const requirements = {
    'Theology': 40,
    'English': 40,
    'Social Studies': 35,
    'Math': 30,
    'Science': 30,
    'Speech': 5,
    'P.E.': 15,
    'Fine Arts': 5,
    'Life Skills': 5
  };

  const courses = {
    'Theology': [
      { name: 'Theology I', credits: 10, year: 9, required: true },
      { name: 'Theology II', credits: 10, year: 10, required: true },
      { name: 'Theology III', credits: 10, year: 11, required: true },
      { name: 'Theology IV', credits: 10, year: 12, required: true }
    ],
    'English': [
      { name: 'English I', credits: 10, year: 9, required: true },
      { name: 'English II', credits: 10, year: 10, required: true },
      { name: 'English III', credits: 10, year: 11, required: true },
      { name: 'English IV', credits: 5, year: 12, semester: true },
      { name: 'College Prep Writing', credits: 5, year: [11, 12], semester: true, dual: 3 },
      { name: 'Creative Writing', credits: 5, year: [11, 12], semester: true },
      { name: 'Classic Literature I', credits: 10, year: [11, 12], dual: 6 },
      { name: 'Classic Literature II', credits: 10, year: 12, dual: 6 },
      { name: 'AP English Literature', credits: 10, year: 12, ap: true, dual: 6 },
      { name: 'Journalism I', credits: 10, year: [9, 10, 11, 12] },
      { name: 'Journalism II', credits: 10, year: [10, 11, 12] },
      { name: 'Yearbook', credits: 10, year: [10, 11, 12] }
    ],
    'Social Studies': [
      { name: 'World Geography', credits: 5, year: 9, required: true, semester: true },
      { name: 'World History', credits: 10, year: [9, 10], required: true },
      { name: 'United States History', credits: 10, year: 11, required: true },
      { name: 'American Government', credits: 5, year: 12, required: true, semester: true },
      { name: 'AP American Government', credits: 5, year: 12, semester: true, ap: true },
      { name: 'AP Human Geography', credits: 10, year: [10, 11, 12], ap: true },
      { name: 'Psychology', credits: 5, year: 12, semester: true },
      { name: 'Contemporary History', credits: 5, year: 12, semester: true },
      { name: 'Introduction to Philosophy', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Economics', credits: 5, year: 12, semester: true },
      { name: 'Human Relations', credits: 5, year: [11, 12], semester: true },
      { name: 'Family Issues', credits: 5, year: [11, 12], semester: true }
    ],
    'Math': [
      { name: 'Algebra I', credits: 10, year: [9, 10] },
      { name: 'Algebra Essentials', credits: 10, year: 9 },
      { name: 'Differentiated Algebra I', credits: 10, year: [9, 10, 11, 12] },
      { name: 'Geometry', credits: 10, year: [10, 11, 12] },
      { name: 'Differentiated Geometry', credits: 10, year: [9, 10, 11, 12] },
      { name: 'Algebra II', credits: 10, year: [11, 12] },
      { name: 'Differentiated Algebra II', credits: 10, year: [10, 11, 12] },
      { name: 'Pre-Calculus', credits: 10, year: [11, 12] },
      { name: 'AP Pre-Calculus', credits: 10, year: [11, 12], ap: true },
      { name: 'AP Calculus', credits: 10, year: 12, ap: true, dual: 8 },
      { name: 'AP Calculus (PACE)', credits: 10, year: 12, ap: true, dual: 10 },
      { name: 'Statistics', credits: 10, year: [11, 12] },
      { name: 'AP Statistics', credits: 10, year: [11, 12], ap: true, dual: 6 },
      { name: 'Trigonometry', credits: 10, year: [11, 12] },
      { name: 'Advanced Math', credits: 10, year: 12 }
    ],
    'Science': [
      { name: 'Physical Science', credits: 10, year: [9, 10, 11] },
      { name: 'Biology', credits: 10, year: [9, 10, 11, 12] },
      { name: 'Chemistry', credits: 10, year: [10, 11, 12] },
      { name: 'Physics', credits: 10, year: [11, 12] },
      { name: 'Accelerated Physics', credits: 10, year: [11, 12] },
      { name: 'Earth, Energy, and Environment', credits: 10, year: [11, 12] },
      { name: 'Anatomy and Physiology', credits: 10, year: [11, 12] },
      { name: 'Advanced Chemistry', credits: 10, year: 12 },
      { name: 'AP Biology', credits: 10, year: 12, ap: true, dual: 8 },
      { name: 'AP Environmental Science', credits: 10, year: [11, 12], ap: true },
      { name: 'AP Physics (PACE)', credits: 10, year: 12, ap: true, dual: 8 }
    ],
    'Speech': [
      { name: 'Speech Communication', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Competitive Public Speaking', credits: 5, year: [9, 10, 11, 12], semester: true }
    ],
    'P.E.': [
      { name: 'Boys Physical Education & Health', credits: 10, year: 9, required: true },
      { name: 'Girls Physical Education & Health', credits: 10, year: 9, required: true },
      { name: 'Strength and Performance', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Boys Fitness, Recreation, and Sport', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Girls Fitness, Recreation, and Sport', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Lifetime Sports and Introduction to Officiating', credits: 5, year: [11, 12], semester: true }
    ],
    'Fine Arts': [
      { name: 'Art Fundamentals', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Art Fundamentals II', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Drawing', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Advanced Drawing', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Painting', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Advanced Painting', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Graphic Design', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Advanced Graphic Design', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Ceramics/Sculpture', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Advanced Ceramics/Sculpture', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Devotional Art', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Advanced Devotional Art', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Art History: Early Catholic Art to Renaissance', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Art History: Renaissance to Modern Catholic Art', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Photography', credits: 5, year: [11, 12], semester: true },
      { name: 'Advanced Photography', credits: 5, year: 12, semester: true },
      { name: 'Marching Band', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Concert Band', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Symphonic Band', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Orchestra', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Percussion Skills and Ensemble', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: "Women's Choir", credits: 10, year: [9, 10, 11, 12] },
      { name: "Men's Choir", credits: 10, year: [9, 10, 11, 12] },
      { name: 'Sotto Voce', credits: 10, year: [10, 11, 12] },
      { name: 'Concert Choir', credits: 10, year: [10, 11, 12] },
      { name: 'Pius X Singers', credits: 10, year: [10, 11, 12] },
      { name: 'Music Appreciation', credits: 5, year: [10, 11, 12], semester: true }
    ],
    'Life Skills': [
      { name: 'Computer Applications', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Career and Life Management', credits: 5, year: [9, 10], semester: true },
      { name: 'Food & Nutrition', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Housing and Interior Design', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Child Development, Care, Guidance, & Parenthood Education', credits: 5, year: [11, 12], semester: true },
      { name: 'Textiles, Clothing and Design', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Advanced Textiles, Clothing, and Design', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Introduction to Culinary Arts', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Small Engines', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Machine Woodworking', credits: 10, year: [9, 10, 11, 12] },
      { name: 'Building Construction', credits: 10, year: [9, 10, 11, 12] },
      { name: 'Architectural Drafting', credits: 10, year: [9, 10, 11, 12] },
      { name: 'Engineering Design I', credits: 10, year: [9, 10, 11, 12] }
    ],
    'Business & Technology': [
      { name: 'Business Law', credits: 5, year: [11, 12], semester: true },
      { name: 'Marketing', credits: 5, year: [11, 12], semester: true },
      { name: 'Accounting I', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Accounting II', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Accounting III', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Web Design I', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Web Design II', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Introduction to Programming', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Computer Science', credits: 10, year: [11, 12], ap: true },
      { name: 'Digital Media I', credits: 5, year: [10, 11, 12], semester: true },
      { name: 'Digital Media II', credits: 5, year: [10, 11, 12], semester: true }
    ],
    'Languages': [
      { name: 'French I', credits: 10, year: [9, 10, 11, 12] },
      { name: 'French II', credits: 10, year: [10, 11, 12] },
      { name: 'French III', credits: 10, year: [11, 12] },
      { name: 'French IV', credits: 10, year: 12 },
      { name: 'Spanish I', credits: 10, year: [9, 10, 11, 12] },
      { name: 'Spanish II', credits: 10, year: [10, 11, 12] },
      { name: 'Spanish III', credits: 10, year: [11, 12] },
      { name: 'Spanish IV', credits: 10, year: 12, dual: 6 },
      { name: 'Latin I', credits: 10, year: [9, 10, 11, 12] },
      { name: 'Latin III', credits: 10, year: [10, 11, 12] },
      { name: 'Latin IV', credits: 10, year: [10, 11, 12] }
    ],
    'Other': [
      { name: 'Study Hall', credits: 0, year: [9, 10, 11, 12] },
      { name: 'Academic Decathlon', credits: 10, year: [9, 10, 11, 12] }
    ]
  };

  const handleWelcomeSubmit = () => {
    const { band, choir, mathClass, gender, studyHall, algebraEssentials } = userPreferences;
    
    // Add required courses
    addCourse('Theology I', 'Theology', 9);
    addCourse('Theology II', 'Theology', 10);
    addCourse('Theology III', 'Theology', 11);
    addCourse('Theology IV', 'Theology', 12);
    
    addCourse('English I', 'English', 9);
    addCourse('English II', 'English', 10);
    
    // Add PE based on gender
    const peCourse = gender === 'female' ? 'Girls Physical Education & Health' : 'Boys Physical Education & Health';
    addCourse(peCourse, 'P.E.', 9);
    
    // Add Study Hall if requested
    if (studyHall === 'one') {
      addCourse('Study Hall', 'Other', 9);
    } else if (studyHall === 'both') {
      addCourse('Study Hall', 'Other', 9);
      addCourse('Study Hall', 'Other', 9);
    }
    
    if (band) {
      addCourse('Marching Band', 'Fine Arts', 9);
      addCourse('Concert Band', 'Fine Arts', 9);
    }
    
    if (choir) {
      const choirCourse = gender === 'female' ? "Women's Choir" : "Men's Choir";
      addCourse(choirCourse, 'Fine Arts', 9);
    }
    
    if (mathClass) {
      addCourse(mathClass, 'Math', 9);
      
      if (algebraEssentials) {
        addCourse('Algebra Essentials', 'Math', 9);
      }
      
      if (mathClass === 'Algebra I') {
        addCourse('Geometry', 'Math', 10);
        addCourse('Algebra II', 'Math', 11);
      } else if (mathClass === 'Differentiated Algebra I') {
        addCourse('Differentiated Geometry', 'Math', 10);
        addCourse('Differentiated Algebra II', 'Math', 11);
      } else if (mathClass === 'Differentiated Geometry') {
        addCourse('Differentiated Algebra II', 'Math', 10);
      }
    }
    
    setShowWelcome(false);
  };

  const addCourse = (courseName, dept, year) => {
    const id = `${courseName}-${year}-${Date.now()}-${Math.random()}`;
    setSelectedCourses(prev => [...prev, { 
      name: courseName, 
      dept, 
      year,
      id 
    }]);
  };

  const handleCourseClick = (courseName, dept) => {
    setPendingCourse({ name: courseName, dept });
    setShowCourseModal(true);
  };

  const handleAddCourseWithDetails = (year) => {
    if (pendingCourse) {
      addCourse(pendingCourse.name, pendingCourse.dept, year);
      setShowCourseModal(false);
      setPendingCourse(null);
    }
  };

  const removeCourse = (id) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== id));
  };

  const calculateCredits = () => {
    const totals = {};
    Object.keys(requirements).forEach(dept => totals[dept] = 0);

    selectedCourses.forEach(selected => {
      const course = Object.values(courses).flat().find(c => c.name === selected.name);
      if (course) {
        totals[selected.dept] = (totals[selected.dept] || 0) + course.credits;
      }
    });

    return totals;
  };

  const calculateAPCredits = () => {
    let total = 0;
    selectedCourses.forEach(selected => {
      const course = Object.values(courses).flat().find(c => c.name === selected.name && c.ap);
      if (course) {
        if (course.name.includes('PACE')) total += 8;
        else total += 3;
      }
    });
    return total;
  };

  const calculateDualCredits = () => {
    let total = 0;
    selectedCourses.forEach(selected => {
      const course = Object.values(courses).flat().find(c => c.name === selected.name && c.dual);
      if (course) {
        total += course.dual;
      }
    });
    return total;
  };

  const getYearCredits = (year) => {
    return selectedCourses
      .filter(c => c.year === year)
      .reduce((sum, selected) => {
        const course = Object.values(courses).flat().find(c => c.name === selected.name);
        return sum + (course ? course.credits : 0);
      }, 0);
  };

  const getMissingSubjects = (year) => {
    const coreSubjects = ['English', 'Social Studies', 'Math', 'Science', 'Theology'];
    const yearCourses = selectedCourses.filter(c => c.year === year);
    const presentDepts = [...new Set(yearCourses.map(c => c.dept))];
    return coreSubjects.filter(subject => !presentDepts.includes(subject));
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data and start over?')) {
      localStorage.removeItem('piusx-planner');
      setSelectedCourses([]);
      setShowWelcome(true);
      setWelcomeStep(1);
    }
  };

  const exportToEmail = () => {
    const credits = calculateCredits();
    let body = 'PIUS X COURSE PLANNER\n\n';
    body += `AP Credits: ${calculateAPCredits()}\n`;
    body += `Dual Credits: ${calculateDualCredits()}\n\n`;
    body += 'REQUIREMENTS:\n';
    Object.entries(requirements).forEach(([dept, req]) => {
      body += `${dept}: ${credits[dept] || 0}/${req}\n`;
    });
    body += '\n\nSELECTED COURSES:\n';
    ['Freshman', 'Sophomore', 'Junior', 'Senior'].forEach((yearName, idx) => {
      const year = idx + 9;
      const yearCourses = selectedCourses.filter(c => c.year === year);
      if (yearCourses.length > 0) {
        body += `\n${yearName.toUpperCase()} (${getYearCredits(year)} credits):\n`;
        yearCourses.forEach(c => {
          body += `  ${c.name}\n`;
        });
      }
    });
    window.location.href = `mailto:?subject=My Pius X Course Plan&body=${encodeURIComponent(body)}`;
  };

  const printPlan = () => {
    window.print();
  };

  const getYearCourses = (year) => {
    return selectedCourses.filter(c => c.year === year);
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, #046a38, #034a28)' }}>
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="https://www.piusx.net/wp-content/uploads/2018/06/P-green-256x300.jpg" 
              alt="Pius X Logo" 
              className="w-24 h-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#046a38' }}>Pius X Course Planner</h1>
          <p className="text-gray-600 text-center mb-8">Plan your four-year journey</p>
          
          {welcomeStep === 0 && (
            <div className="space-y-4">
              <button
                onClick={() => setWelcomeStep(1)}
                className="w-full p-6 border-2 rounded-lg hover:bg-green-50 transition text-left"
                style={{ borderColor: '#046a38' }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4" style={{ backgroundColor: '#046a38' }}>
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: '#046a38' }}>Start-Up Guide</h3>
                    <p className="text-sm text-gray-600">Answer a few questions and we'll help auto-pick your courses based on your interests</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowWelcome(false);
                  setWelcomeStep(1);
                }}
                className="w-full p-6 border-2 rounded-lg hover:bg-green-50 transition text-left"
                style={{ borderColor: '#046a38' }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4" style={{ backgroundColor: '#046a38' }}>
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: '#046a38' }}>Go Straight to Schedule</h3>
                    <p className="text-sm text-gray-600">Already know what courses you want? Build your schedule from scratch</p>
                  </div>
                </div>
              </button>
            </div>
          )}
          
          {welcomeStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold mb-2">What's your first name?</label>
                <input
                  type="text"
                  value={userPreferences.firstName}
                  onChange={(e) => setUserPreferences({ ...userPreferences, firstName: e.target.value })}
                  placeholder="Enter your first name"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-3">What is your gender?</label>
                <div className="space-y-2">
                  {['Male', 'Female'].map(gender => (
                    <button
                      key={gender}
                      onClick={() => setUserPreferences({ ...userPreferences, gender: gender.toLowerCase() })}
                      className={`w-full p-3 rounded-lg border-2 text-left transition ${
                        userPreferences.gender === gender.toLowerCase()
                          ? 'bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      style={userPreferences.gender === gender.toLowerCase() ? { borderColor: '#046a38' } : {}}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setWelcomeStep(2)}
                disabled={!userPreferences.firstName || !userPreferences.gender}
                className="w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ backgroundColor: '#046a38' }}
              >
                Next
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}

          {welcomeStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold mb-3">Would you like a Study Hall during your freshman year?</label>
                <div className="space-y-2">
                  {[
                    { value: 'none', label: 'No Study Hall' },
                    { value: 'one', label: 'One Semester' },
                    { value: 'both', label: 'Both Semesters' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setUserPreferences({ ...userPreferences, studyHall: option.value })}
                      className={`w-full p-3 rounded-lg border-2 text-left transition ${
                        userPreferences.studyHall === option.value
                          ? 'bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      style={userPreferences.studyHall === option.value ? { borderColor: '#046a38' } : {}}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setWelcomeStep(1)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setWelcomeStep(3)}
                  disabled={!userPreferences.studyHall}
                  className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{ backgroundColor: '#046a38' }}
                >
                  Next
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {welcomeStep === 3 && (
            <div className="space-y-6">
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userPreferences.band}
                    onChange={(e) => setUserPreferences({ ...userPreferences, band: e.target.checked })}
                    className="w-5 h-5 text-blue-900 rounded"
                  />
                  <span className="ml-3 text-lg">Are you in Band?</span>
                </label>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userPreferences.choir}
                    onChange={(e) => setUserPreferences({ ...userPreferences, choir: e.target.checked })}
                    className="w-5 h-5 text-blue-900 rounded"
                  />
                  <span className="ml-3 text-lg">Are you in Choir?</span>
                </label>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setWelcomeStep(2)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setWelcomeStep(4)}
                  className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center justify-center"
                >
                  Next
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {welcomeStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold mb-3">What math class will you start with as a freshman?</label>
                <div className="space-y-2">
                  {['Algebra I', 'Differentiated Algebra I', 'Differentiated Geometry', 'Differentiated Algebra II'].map(math => (
                    <button
                      key={math}
                      onClick={() => setUserPreferences({ ...userPreferences, mathClass: math })}
                      className={`w-full p-3 rounded-lg border-2 text-left transition ${
                        userPreferences.mathClass === math
                          ? 'border-blue-900 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {math}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setWelcomeStep(3)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => {
                    if (userPreferences.mathClass === 'Algebra I') {
                      setWelcomeStep(5);
                    } else if (userPreferences.mathClass === 'Differentiated Geometry') {
                      setWelcomeStep(6);
                    } else if (userPreferences.mathClass === 'Differentiated Algebra II') {
                      setWelcomeStep(7);
                    } else {
                      handleWelcomeSubmit();
                    }
                  }}
                  disabled={!userPreferences.mathClass}
                  className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  Next
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {welcomeStep === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm mb-3">
                  <strong>Algebra Essentials</strong> is designed to be taken along with Algebra I. It will cover basic skills required to be successful in all high school math courses, along with providing extra practice of skills learned in Algebra I. Topics covered will include fractions, operations with integers, simplifying algebraic expressions, solving basic equations and inequalities, graphing, decimals, percentages, probability, measurement, radicals, and basic geometry. All work is designed to be completed in class.
                </p>
                <p className="text-lg font-semibold">Would you like to add Algebra Essentials to your freshman year?</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setUserPreferences({ ...userPreferences, algebraEssentials: true });
                    handleWelcomeSubmit();
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Yes, Add Algebra Essentials
                </button>
                <button
                  onClick={() => {
                    setUserPreferences({ ...userPreferences, algebraEssentials: false });
                    handleWelcomeSubmit();
                  }}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  No, Just Algebra I
                </button>
              </div>

              <button
                onClick={() => setWelcomeStep(4)}
                className="w-full border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </button>
            </div>
          )}

          {welcomeStep === 6 && (
            <div className="space-y-6">
              <p className="text-lg">Have you completed or will you complete Algebra I in 7th grade?</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setUserPreferences({ ...userPreferences, verifiedAlgebra: true });
                    handleWelcomeSubmit();
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setUserPreferences({ ...userPreferences, mathClass: '', verifiedAlgebra: false });
                    setWelcomeStep(4);
                  }}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  No - Choose Different Math Class
                </button>
              </div>

              <button
                onClick={() => setWelcomeStep(4)}
                className="w-full border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </button>
            </div>
          )}

          {welcomeStep === 7 && (
            <div className="space-y-6">
              <p className="text-lg">Have you completed or will you complete Differentiated Geometry as an 8th grader at Pius X?</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setUserPreferences({ ...userPreferences, verifiedGeometry: true });
                    handleWelcomeSubmit();
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setUserPreferences({ ...userPreferences, mathClass: '', verifiedGeometry: false });
                    setWelcomeStep(4);
                  }}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  No - Choose Different Math Class
                </button>
              </div>

              <button
                onClick={() => setWelcomeStep(4)}
                className="w-full border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const credits = calculateCredits();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white shadow-lg print:hidden" style={{ backgroundColor: '#046a38' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold">Pius X High School</h1>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Course Planner</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={exportToEmail} className="p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} title="Email">
                <Mail className="w-5 h-5" />
              </button>
              <button onClick={printPlan} className="p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} title="Print">
                <Download className="w-5 h-5" />
              </button>
              <button onClick={clearData} className="p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} title="Clear All">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {['all', 'freshman', 'sophomore', 'junior', 'senior'].map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold capitalize ${
                    isActive
                      ? 'border-b-4 text-green-800'
                      : 'text-gray-600 hover:text-green-800'
                  }`}
                  style={isActive ? { borderColor: '#046a38', color: '#046a38' } : {}}
                >
                  {tab === 'all' ? 'All Grades' : tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 print:hidden">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#046a38' }}>Available Courses</h2>
              
              <div className="space-y-4">
                {Object.entries(courses).filter(([dept]) => dept !== 'Other').map(([dept, courseList]) => (
                  <div key={dept} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedDepts({ ...expandedDepts, [dept]: !expandedDepts[dept] })}
                      className="w-full px-4 py-3 hover:bg-gray-50 flex justify-between items-center"
                      style={{ backgroundColor: '#f0fdf4' }}
                    >
                      <span className="font-semibold" style={{ color: '#046a38' }}>{dept}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedDepts[dept] ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedDepts[dept] && (
                      <div className="p-4 space-y-2">
                        {courseList.map(course => (
                          <button
                            key={course.name}
                            onClick={() => handleCourseClick(course.name, dept)}
                            className="w-full text-left px-4 py-2 rounded hover:bg-green-50 border border-gray-200 flex justify-between items-center"
                          >
                            <div>
                              <span>{course.name}</span>
                              {course.ap && <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">AP</span>}
                              {course.dual && <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">Dual</span>}
                            </div>
                            <span className="text-sm text-gray-600">{course.credits} cr</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#046a38' }}>Your Selected Courses</h3>
              
              {activeTab === 'all' ? (
                ['Freshman', 'Sophomore', 'Junior', 'Senior'].map((yearName, idx) => {
                  const year = idx + 9;
                  const yearCourses = getYearCourses(year);
                  const yearCredits = getYearCredits(year);
                  if (yearCourses.length === 0) return null;
                  
                  return (
                    <div key={yearName} className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg">{yearName}</h4>
                          {getMissingSubjects(year).length > 0 && (
                            <span className="text-xs text-gray-500">
                              Need: {getMissingSubjects(year).join(', ')}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{yearCredits}/80 credits</span>
                      </div>
                      {yearCredits > 80 && (
                        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-yellow-800">
                            You have more than 80 credits scheduled for this year. Please review your course load.
                          </p>
                        </div>
                      )}
                      <div className="space-y-2">
                        {yearCourses.map(course => (
                          <CourseCard
                            key={course.id}
                            course={course}
                            removeCourse={removeCourse}
                            hoveredCourse={hoveredCourse}
                            setHoveredCourse={setHoveredCourse}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                (() => {
                  const yearMap = { 'freshman': 9, 'sophomore': 10, 'junior': 11, 'senior': 12 };
                  const year = yearMap[activeTab];
                  const yearCourses = getYearCourses(year);
                  const yearCredits = getYearCredits(year);
                  
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg capitalize">{activeTab}</h4>
                          {getMissingSubjects(year).length > 0 && (
                            <span className="text-xs text-gray-500">
                              Need: {getMissingSubjects(year).join(', ')}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{yearCredits}/80 credits</span>
                      </div>
                      {yearCredits > 80 && (
                        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-yellow-800">
                            You have more than 80 credits scheduled for this year. Please review your course load.
                          </p>
                        </div>
                      )}
                      <div className="space-y-2">
                        {yearCourses.map(course => (
                          <CourseCard
                            key={course.id}
                            course={course}
                            removeCourse={removeCourse}
                            hoveredCourse={hoveredCourse}
                            setHoveredCourse={setHoveredCourse}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()
              )}
              
              {selectedCourses.length === 0 && (
                <p className="text-gray-500 text-center py-8">No courses selected yet. Click on courses to add them.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#046a38' }}>Summary</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="text-2xl font-bold text-purple-900">{calculateAPCredits()}</div>
                  <div className="text-xs text-gray-600">AP Credits</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-900">{calculateDualCredits()}</div>
                  <div className="text-xs text-gray-600">Dual Credits</div>
                </div>
              </div>

              <h3 className="font-semibold mb-3">Requirements Progress</h3>
              <div className="space-y-3">
                {Object.entries(requirements).map(([dept, required]) => {
                  const earned = credits[dept] || 0;
                  const percentage = (earned / required) * 100;
                  return (
                    <div key={dept}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{dept}</span>
                        <span className={earned >= required ? 'text-green-600 font-semibold' : ''}>
                          {earned}/{required}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${earned >= required ? 'bg-green-600' : 'bg-blue-600'}`}
                          style={{ 
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: earned >= required ? '#16a34a' : '#046a38'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Career Pathways Section - Bottom of Page */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 print:hidden">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#046a38' }}>Career Pathways</h2>
          <p className="text-sm text-gray-600 mb-4">Explore recommended courses by career interest</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.keys(careerPathways).map(career => (
              <button
                key={career}
                onClick={() => {
                  setSelectedCareer(career);
                  setShowCareerModal(true);
                }}
                className="text-left px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-green-600 hover:bg-green-50 transition"
              >
                <span className="font-semibold text-gray-800">{career}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {showCourseModal && pendingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add {pendingCourse.name}</h3>
            <p className="text-gray-600 mb-4">Which year do you want to take this course?</p>
            
            <div className="space-y-2">
              {[
                { year: 9, label: 'Freshman' },
                { year: 10, label: 'Sophomore' },
                { year: 11, label: 'Junior' },
                { year: 12, label: 'Senior' }
              ].map(({ year, label }) => (
                <button
                  key={year}
                  onClick={() => handleAddCourseWithDetails(year)}
                  className="w-full px-4 py-3 text-white rounded hover:opacity-90 text-left font-semibold"
                  style={{ backgroundColor: '#046a38' }}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowCourseModal(false);
                setPendingCourse(null);
              }}
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showCareerModal && selectedCareer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full" style={{ maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: '#046a38' }}>{selectedCareer}</h3>
              <button
                onClick={() => {
                  setShowCareerModal(false);
                  setSelectedCareer(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Click on any course to add it to your schedule:</p>
            
            <div className="overflow-y-auto flex-1 space-y-2 pr-2">
              {careerPathways[selectedCareer].map(courseName => {
                const course = Object.values(courses).flat().find(c => c.name === courseName);
                const dept = Object.entries(courses).find(([_, courseList]) => 
                  courseList.some(c => c.name === courseName)
                )?.[0] || 'Other';
                
                return (
                  <button
                    key={courseName}
                    onClick={() => {
                      setPendingCourse({ name: courseName, dept });
                      setShowCareerModal(false);
                      setShowCourseModal(true);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-600 transition flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium text-sm">{courseName}</span>
                      {course?.ap && <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">AP</span>}
                      {course?.dual && <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">Dual</span>}
                    </div>
                    {course && <span className="text-xs text-gray-600">{course.credits} cr</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ course, removeCourse, hoveredCourse, setHoveredCourse }) => {
  return (
    <div 
      className="border rounded p-3 relative"
      onMouseEnter={() => setHoveredCourse(course.id)}
      onMouseLeave={() => setHoveredCourse(null)}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{course.name}</span>
        
        {hoveredCourse === course.id && (
          <button
            onClick={() => removeCourse(course.id)}
            className="text-red-600 hover:text-red-800 absolute right-3"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CoursePlanner;
