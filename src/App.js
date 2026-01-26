import React, { useState, useEffect } from 'react';
import { GraduationCap, Download, Mail, Trash2, ChevronDown, X, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

const CoursePlanner = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(1);
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
      { name: 'AP English Literature', credits: 10, year: 12, ap: true, dual: 6 }
    ],
    'Social Studies': [
      { name: 'World Geography', credits: 5, year: 9, required: true, semester: true },
      { name: 'World History', credits: 10, year: [9, 10], required: true },
      { name: 'United States History', credits: 10, year: 11, required: true },
      { name: 'American Government', credits: 5, year: 12, required: true, semester: true },
      { name: 'AP American Government', credits: 5, year: 12, semester: true, ap: true },
      { name: 'AP Human Geography', credits: 10, year: [10, 11, 12], ap: true },
      { name: 'Psychology', credits: 5, year: 12, semester: true }
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
      { name: 'AP Calculus', credits: 10, year: 12, ap: true, dual: 8 },
      { name: 'AP Calculus (PACE)', credits: 10, year: 12, ap: true, dual: 10 },
      { name: 'AP Statistics', credits: 10, year: [11, 12], ap: true, dual: 6 }
    ],
    'Science': [
      { name: 'Biology', credits: 10, year: [9, 10, 11, 12] },
      { name: 'Chemistry', credits: 10, year: [10, 11, 12] },
      { name: 'Physics', credits: 10, year: [11, 12] },
      { name: 'AP Biology', credits: 10, year: 12, ap: true, dual: 8 },
      { name: 'AP Physics (PACE)', credits: 10, year: 12, ap: true, dual: 8 }
    ],
    'Speech': [
      { name: 'Speech Communication', credits: 5, year: [10, 11, 12], semester: true }
    ],
    'P.E.': [
      { name: 'Physical Education & Health', credits: 10, year: 9, required: true },
      { name: 'Strength and Performance', credits: 5, year: [10, 11, 12], semester: true }
    ],
    'Fine Arts': [
      { name: 'Art Fundamentals', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Marching Band', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Concert Band', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: "Women's Choir", credits: 10, year: [9, 10, 11, 12] },
      { name: "Men's Choir", credits: 10, year: [9, 10, 11, 12] }
    ],
    'Life Skills': [
      { name: 'Computer Applications', credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: 'Career and Life Management', credits: 5, year: [9, 10], semester: true }
    ],
    'Other': [
      { name: 'Study Hall', credits: 0, year: [9, 10, 11, 12] }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-blue-900" />
          </div>
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Pius X Course Planner</h1>
          <p className="text-gray-600 text-center mb-8">Let's get started with a few questions</p>
          
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
                          ? 'border-blue-900 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setWelcomeStep(2)}
                disabled={!userPreferences.firstName || !userPreferences.gender}
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
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
                          ? 'border-blue-900 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
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
                  className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
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
            {['all', 'freshman', 'sophomore', 'junior', 'senior'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold capitalize ${
