import React, { useState, useEffect } from 'react';
import { GraduationCap, Download, Mail, Trash2, ChevronDown, Check, X, ArrowLeft, ArrowRight } from 'lucide-react';

const CoursePlanner = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState({});
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(1);
  const [userPreferences, setUserPreferences] = useState({ 
    band: false, 
    choir: false,
    mathClass: '',
    verifiedAlgebra: null,
    verifiedGeometry: null
  });
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [pendingCourse, setPendingCourse] = useState(null);
  const [expandedDepts, setExpandedDepts] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('piusx-planner');
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedCourses(data.selectedCourses || []);
      setCompletedCourses(data.completedCourses || {});
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    if (!showWelcome) {
      localStorage.setItem('piusx-planner', JSON.stringify({
        selectedCourses,
        completedCourses
      }));
    }
  }, [selectedCourses, completedCourses, showWelcome]);

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
    ]
  };

  const handleWelcomeSubmit = () => {
    const { band, choir, mathClass } = userPreferences;
    
    if (band) {
      addCourse('Marching Band', 'Fine Arts', 9, 'Fall');
      addCourse('Concert Band', 'Fine Arts', 9, 'Spring');
    }
    
    if (choir) {
      addCourse("Women's Choir", 'Fine Arts', 9, 'Fall');
      addCourse("Women's Choir", 'Fine Arts', 9, 'Spring');
    }
    
    if (mathClass) {
      addCourse(mathClass, 'Math', 9, 'Fall');
      addCourse(mathClass, 'Math', 9, 'Spring');
      
      if (mathClass === 'Algebra I') {
        addCourse('Geometry', 'Math', 10, 'Fall');
        addCourse('Geometry', 'Math', 10, 'Spring');
        addCourse('Algebra II', 'Math', 11, 'Fall');
        addCourse('Algebra II', 'Math', 11, 'Spring');
      } else if (mathClass === 'Differentiated Algebra I') {
        addCourse('Differentiated Geometry', 'Math', 10, 'Fall');
        addCourse('Differentiated Geometry', 'Math', 10, 'Spring');
        addCourse('Differentiated Algebra II', 'Math', 11, 'Fall');
        addCourse('Differentiated Algebra II', 'Math', 11, 'Spring');
      } else if (mathClass === 'Differentiated Geometry') {
        addCourse('Differentiated Algebra II', 'Math', 10, 'Fall');
        addCourse('Differentiated Algebra II', 'Math', 10, 'Spring');
      }
    }
    
    setShowWelcome(false);
  };

  const addCourse = (courseName, dept, year, semester) => {
    const id = `${courseName}-${year}-${semester}`;
    setSelectedCourses(prev => {
      if (!prev.find(c => c.id === id)) {
        return [...prev, { name: courseName, dept, year, semester, id }];
      }
      return prev;
    });
  };

  const handleCourseClick = (courseName, dept) => {
    setPendingCourse({ name: courseName, dept });
    setShowCourseModal(true);
  };

  const handleAddCourseWithDetails = (year, semester) => {
    if (pendingCourse) {
      if (semester === 'Both') {
        addCourse(pendingCourse.name, pendingCourse.dept, year, 'Fall');
        addCourse(pendingCourse.name, pendingCourse.dept, year, 'Spring');
      } else {
        addCourse(pendingCourse.name, pendingCourse.dept, year, semester);
      }
      setShowCourseModal(false);
      setPendingCourse(null);
    }
  };

  const removeCourse = (id) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== id));
    const newCompleted = { ...completedCourses };
    delete newCompleted[id];
    setCompletedCourses(newCompleted);
  };

  const toggleCompleted = (id) => {
    if (completedCourses[id]) {
      const newCompleted = { ...completedCourses };
      delete newCompleted[id];
      setCompletedCourses(newCompleted);
    } else {
      setCompletedCourses({ ...completedCourses, [id]: { grade: '' } });
    }
  };

  const setGrade = (id, grade) => {
    setCompletedCourses({
      ...completedCourses,
      [id]: { grade }
    });
  };

  const calculateGPA = () => {
    const gradePoints = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 };
    const completed = Object.entries(completedCourses).filter(([_, data]) => data.grade);
    if (completed.length === 0) return 0;
    const total = completed.reduce((sum, [_, data]) => sum + (gradePoints[data.grade] || 0), 0);
    return (total / completed.length).toFixed(2);
  };

  const calculateCredits = () => {
    const totals = {};
    Object.keys(requirements).forEach(dept => totals[dept] = 0);

    selectedCourses.forEach(selected => {
      const course = Object.values(courses).flat().find(c => c.name === selected.name);
      if (course && completedCourses[selected.id]) {
        totals[selected.dept] = (totals[selected.dept] || 0) + course.credits;
      }
    });

    return totals;
  };

  const calculateAPCredits = () => {
    let total = 0;
    selectedCourses.forEach(selected => {
      const course = Object.values(courses).flat().find(c => c.name === selected.name && c.ap);
      if (course && completedCourses[selected.id]) {
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
      if (course && completedCourses[selected.id]) {
        total += course.dual;
      }
    });
    return total;
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data and start over?')) {
      localStorage.removeItem('piusx-planner');
      setSelectedCourses([]);
      setCompletedCourses([]);
      setShowWelcome(true);
      setWelcomeStep(1);
    }
  };

  const exportToEmail = () => {
    const credits = calculateCredits();
    let body = 'PIUS X COURSE PLANNER\n\n';
    body += `GPA: ${calculateGPA()}\n`;
    body += `AP Credits: ${calculateAPCredits()}\n`;
    body += `Dual Credits: ${calculateDualCredits()}\n\n`;
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

              <button
                onClick={() => setWelcomeStep(2)}
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center justify-center"
              >
                Next
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}

          {welcomeStep === 2 && (
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
                  onClick={() => setWelcomeStep(1)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => {
                    if (userPreferences.mathClass === 'Differentiated Geometry') {
                      setWelcomeStep(3);
                    } else if (userPreferences.mathClass === 'Differentiated Algebra II') {
                      setWelcomeStep(4);
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

          {welcomeStep === 3 && (
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
                    setWelcomeStep(2);
                  }}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  No - Choose Different Math Class
                </button>
              </div>

              <button
                onClick={() => setWelcomeStep(2)}
                className="w-full border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </button>
            </div>
          )}

          {welcomeStep === 4 && (
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
                    setWelcomeStep(2);
                  }}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  No - Choose Different Math Class
                </button>
              </div>

              <button
                onClick={() => setWelcomeStep(2)}
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
      <header className="bg-blue-900 text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold">Pius X High School</h1>
                <p className="text-sm text-blue-200">Course Planner</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={exportToEmail} className="p-2 hover:bg-blue-800 rounded" title="Email">
                <Mail className="w-5 h-5" />
              </button>
              <button onClick={printPlan} className="p-2 hover:bg-blue-800 rounded" title="Print">
                <Download className="w-5 h-5" />
              </button>
              <button onClick={clearData} className="p-2 hover:bg-blue-800 rounded" title="Clear All">
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
                  activeTab === tab
                    ? 'border-b-4 border-blue-900 text-blue-900'
                    : 'text-gray-600 hover:text-blue-900'
                }`}
              >
                {tab === 'all' ? 'All Grades' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 print:hidden">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Available Courses</h2>
              
              <div className="space-y-4">
                {Object.entries(courses).map(([dept, courseList]) => (
                  <div key={dept} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedDepts({ ...expandedDepts, [dept]: !expandedDepts[dept] })}
                      className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 flex justify-between items-center"
                    >
                      <span className="font-semibold text-blue-900">{dept}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedDepts[dept] ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedDepts[dept] && (
                      <div className="p-4 space-y-2">
                        {courseList.map(course => (
                          <button
                            key={course.name}
                            onClick={() => handleCourseClick(course.name, dept)}
                            className="w-full text-left px-4 py-2 rounded hover:bg-blue-50 border border-gray-200 flex justify-between items-center"
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
              <h3 className="text-xl font-bold text-blue-900 mb-4">Your Selected Courses</h3>
              
              {activeTab === 'all' ? (
                ['Freshman', 'Sophomore', 'Junior', 'Senior'].map((yearName, idx) => {
                  const year = idx + 9;
                  const yearCourses = getYearCourses(year);
                  if (yearCourses.length === 0) return null;
                  
                  return (
                    <div key={yearName} className="mb-6">
                      <h4 className="font-semibold text-lg mb-3">{yearName}</h4>
                      {['Fall', 'Spring'].map(semester => {
                        const semCourses = yearCourses.filter(c => c.semester === semester);
                        if (semCourses.length === 0) return null;
                        
                        return (
                          <div key={semester} className="mb-4">
                            <div className="text-sm font-semibold text-gray-600 mb-2">{semester}</div>
                            <div className="space-y-2">
                              {semCourses.map(course => (
                                <CourseCard
                                  key={course.id}
                                  course={course}
                                  completedCourses={completedCourses}
                                  toggleCompleted={toggleCompleted}
                                  setGrade={setGrade}
                                  removeCourse={removeCourse}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              ) : (
                (() => {
                  const yearMap = { 'freshman': 9, 'sophomore': 10, 'junior': 11, 'senior': 12 };
                  const year = yearMap[activeTab];
                  const yearCourses = getYearCourses(year);
                  
                  return ['Fall', 'Spring'].map(semester => {
                    const semCourses = yearCourses.filter(c => c.semester === semester);
                    if (semCourses.length === 0) return null;
                    
                    return (
                      <div key={semester} className="mb-4">
                        <div className="text-sm font-semibold text-gray-600 mb-2">{semester}</div>
                        <div className="space-y-2">
                          {semCourses.map(course => (
                            <CourseCard
                              key={course.id}
                              course={course}
                              completedCourses={completedCourses}
                              toggleCompleted={toggleCompleted}
                              setGrade={setGrade}
                              removeCourse={removeCourse}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()
              )}
              
              {selectedCourses.length === 0 && (
                <p className="text-gray-500 text-center py-8">No courses selected yet. Click on courses to add them.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Summary</h2>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900">{calculateGPA()}</div>
                  <div className="text-sm text-gray-600">Unweighted GPA</div>
                </div>
              </div>

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
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCourseModal && pendingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add {pendingCourse.name}</h3>
            <p className="text-gray-600 mb-4">When do you want to take this course?</p>
            
            <div className="space-y-3">
              {[
                { year: 9, label: 'Freshman' },
                { year: 10, label: 'Sophomore' },
                { year: 11, label: 'Junior' },
                { year: 12, label: 'Senior' }
              ].map(({ year, label }) => (
                <div key={year}>
                  <div className="font-semibold mb-2">{label}</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleAddCourseWithDetails(year, 'Fall')}
                      className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 text-sm"
                    >
                      Fall
                    </button>
                    <button
                      onClick={() => handleAddCourseWithDetails(year, 'Spring')}
                      className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 text-sm"
                    >
                      Spring
                    </button>
                    <button
                      onClick={() => handleAddCourseWithDetails(year, 'Both')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Both
                    </button>
                  </div>
                </div>
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
    </div>
  );
};

const CourseCard = ({ course, completedCourses, toggleCompleted, setGrade, removeCourse }) => {
  const isCompleted = completedCourses[course.id];
  
  return (
    <div className="border rounded p-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleCompleted(course.id)}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                isCompleted ? 'bg-green-600 border-green-600' : 'border-gray-300'
              }`}
            >
              {isCompleted && <Check className="w-4 h-4 text-white" />}
            </button>
            <span className="font-medium">{course.name}</span>
          </div>
          
          {isCompleted && (
            <div className="mt-2 ml-8">
              <select
                value={completedCourses[course.id].grade}
                onChange={(e) => setGrade(course.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">Select Grade</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D+">D+</option>
                <option value="D">D</option>
                  <option value="D-">D-</option>
                <option value="F">F</option>
              </select>
            </div>
          )}
        </div>
        
        <button
          onClick={() => removeCourse(course.id)}
          className="text-red-600 hover:text-red-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CoursePlanner;
