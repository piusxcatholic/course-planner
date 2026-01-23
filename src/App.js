import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Download,
  Mail,
  Trash2,
  ChevronDown,
  Check,
  X,
} from "lucide-react";

const CoursePlanner = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState({});
  const [showWelcome, setShowWelcome] = useState(true);
  const [userPreferences, setUserPreferences] = useState({
    band: false,
    choir: false,
  });
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [pendingCourse, setPendingCourse] = useState(null);
  const [expandedDepts, setExpandedDepts] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("piusx-planner");
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedCourses(data.selectedCourses || []);
      setCompletedCourses(data.completedCourses || {});
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    if (!showWelcome) {
      localStorage.setItem(
        "piusx-planner",
        JSON.stringify({
          selectedCourses,
          completedCourses,
        })
      );
    }
  }, [selectedCourses, completedCourses, showWelcome]);

  const requirements = {
    Theology: 40,
    English: 40,
    "Social Studies": 35,
    Math: 30,
    Science: 30,
    Speech: 5,
    "P.E.": 15,
    "Fine Arts": 5,
    "Life Skills": 5,
  };

  const courses = {
    Theology: [
      { name: "Theology I", credits: 10, year: 9, required: true },
      { name: "Theology II", credits: 10, year: 10, required: true },
      { name: "Theology III", credits: 10, year: 11, required: true },
      { name: "Theology IV", credits: 10, year: 12, required: true },
    ],
    English: [
      { name: "English I", credits: 10, year: 9, required: true },
      { name: "English II", credits: 10, year: 10, required: true },
      { name: "English III", credits: 10, year: 11, required: true },
      { name: "English IV", credits: 5, year: 12, semester: true },
      {
        name: "College Prep Writing",
        credits: 5,
        year: [11, 12],
        semester: true,
        dual: 3,
      },
      { name: "Creative Writing", credits: 5, year: [11, 12], semester: true },
      { name: "Classic Literature I", credits: 10, year: [11, 12], dual: 6 },
      { name: "Classic Literature II", credits: 10, year: 12, dual: 6 },
      {
        name: "AP English Literature",
        credits: 10,
        year: 12,
        ap: true,
        dual: 6,
      },
      { name: "Journalism I", credits: 10, year: [9, 10, 11, 12] },
      { name: "Journalism II", credits: 10, year: [10, 11, 12] },
    ],
    "Social Studies": [
      {
        name: "World Geography",
        credits: 5,
        year: 9,
        required: true,
        semester: true,
      },
      { name: "World History", credits: 10, year: [9, 10], required: true },
      { name: "United States History", credits: 10, year: 11, required: true },
      {
        name: "American Government",
        credits: 5,
        year: 12,
        required: true,
        semester: true,
      },
      {
        name: "AP American Government",
        credits: 5,
        year: 12,
        semester: true,
        ap: true,
      },
      { name: "AP Human Geography", credits: 10, year: [10, 11, 12], ap: true },
      { name: "Psychology", credits: 5, year: 12, semester: true },
      { name: "Contemporary History", credits: 5, year: 12, semester: true },
      { name: "Economics", credits: 5, year: 12, semester: true },
      {
        name: "Introduction to Philosophy",
        credits: 5,
        year: [10, 11, 12],
        semester: true,
      },
    ],
    Math: [
      { name: "Algebra I", credits: 10, year: [9, 10] },
      { name: "Differentiated Algebra I", credits: 10, year: [9, 10, 11, 12] },
      { name: "Geometry", credits: 10, year: [10, 11, 12] },
      { name: "Differentiated Geometry", credits: 10, year: [9, 10, 11, 12] },
      { name: "Algebra II", credits: 10, year: [11, 12] },
      { name: "Differentiated Algebra II", credits: 10, year: [10, 11, 12] },
      { name: "Pre-Calculus", credits: 10, year: [11, 12] },
      { name: "AP Pre-Calculus", credits: 10, year: [11, 12], ap: true },
      { name: "AP Calculus", credits: 10, year: 12, ap: true, dual: 8 },
      { name: "AP Calculus (PACE)", credits: 10, year: 12, ap: true, dual: 10 },
      { name: "AP Statistics", credits: 10, year: [11, 12], ap: true, dual: 6 },
      { name: "Statistics", credits: 10, year: [11, 12] },
      { name: "Trigonometry", credits: 10, year: [11, 12] },
    ],
    Science: [
      { name: "Physical Science", credits: 10, year: [9, 10, 11] },
      { name: "Biology", credits: 10, year: [9, 10, 11, 12] },
      { name: "Chemistry", credits: 10, year: [10, 11, 12] },
      { name: "Physics", credits: 10, year: [11, 12] },
      { name: "Accelerated Physics", credits: 10, year: [11, 12] },
      { name: "AP Biology", credits: 10, year: 12, ap: true, dual: 8 },
      {
        name: "AP Environmental Science",
        credits: 10,
        year: [11, 12],
        ap: true,
      },
      { name: "AP Physics (PACE)", credits: 10, year: 12, ap: true, dual: 8 },
      { name: "Anatomy and Physiology", credits: 10, year: [11, 12] },
      { name: "Advanced Chemistry", credits: 10, year: 12 },
    ],
    Speech: [
      {
        name: "Speech Communication",
        credits: 5,
        year: [10, 11, 12],
        semester: true,
      },
      {
        name: "Competitive Public Speaking",
        credits: 5,
        year: [9, 10, 11, 12],
        semester: true,
      },
    ],
    "P.E.": [
      {
        name: "Girls Physical Education & Health",
        credits: 10,
        year: 9,
        required: true,
      },
      {
        name: "Boys Physical Education & Health",
        credits: 10,
        year: 9,
        required: true,
      },
      {
        name: "Strength and Performance",
        credits: 5,
        year: [10, 11, 12],
        semester: true,
      },
      {
        name: "Fitness, Recreation, and Sport",
        credits: 5,
        year: [10, 11, 12],
        semester: true,
      },
      { name: "Lifetime Sports", credits: 5, year: [11, 12], semester: true },
    ],
    "Fine Arts": [
      {
        name: "Art Fundamentals",
        credits: 5,
        year: [9, 10, 11, 12],
        semester: true,
      },
      { name: "Drawing", credits: 5, year: [9, 10, 11, 12], semester: true },
      { name: "Painting", credits: 5, year: [9, 10, 11, 12], semester: true },
      {
        name: "Graphic Design",
        credits: 5,
        year: [9, 10, 11, 12],
        semester: true,
      },
      {
        name: "Ceramics/Sculpture",
        credits: 5,
        year: [9, 10, 11, 12],
        semester: true,
      },
      { name: "Photography", credits: 5, year: [11, 12], semester: true },
      {
        name: "Music Appreciation",
        credits: 5,
        year: [10, 11, 12],
        semester: true,
      },
      {
        name: "Marching Band",
        credits: 5,
        year: [9, 10, 11, 12],
        semester: true,
      },
      {
        name: "Concert Band",
        credits: 5,
        year: [9, 10, 11, 12],
        semester: true,
      },
      { name: "Women's Choir", credits: 10, year: [9, 10, 11, 12] },
      { name: "Men's Choir", credits: 10, year: [9, 10, 11, 12] },
      { name: "Concert Choir", credits: 10, year: [10, 11, 12] },
    ],
    "Life Skills": [
      {
        name: "Computer Applications",
        credits: 5,
        year: [9, 10, 11, 12],
        semester: true,
      },
      {
        name: "Accounting I",
        credits: 5,
        year: [9, 10, 11, 12],
        semester: true,
      },
      {
        name: "Career and Life Management",
        credits: 5,
        year: [9, 10],
        semester: true,
      },
      {
        name: "Food & Nutrition",
        credits: 5,
        year: [9, 10, 11, 12],
        semester: true,
      },
      {
        name: "Housing and Interior Design",
        credits: 5,
        year: [10, 11, 12],
        semester: true,
      },
    ],
    Electives: [
      { name: "French I", credits: 10, year: [9, 10, 11, 12] },
      { name: "French II", credits: 10, year: [10, 11, 12] },
      { name: "French III", credits: 10, year: [11, 12] },
      { name: "French IV", credits: 10, year: 12 },
      { name: "Spanish I", credits: 10, year: [9, 10, 11, 12] },
      { name: "Spanish II", credits: 10, year: [10, 11, 12] },
      { name: "Spanish III", credits: 10, year: [11, 12] },
      { name: "Spanish IV", credits: 10, year: 12, dual: 6 },
      { name: "Latin I", credits: 10, year: [9, 10, 11, 12] },
      {
        name: "Web Design I",
        credits: 5,
        year: [9, 10, 11, 12],
        semester: true,
      },
      {
        name: "Introduction to Programming",
        credits: 5,
        year: [9, 10, 11, 12],
        semester: true,
      },
      { name: "Computer Science", credits: 10, year: [11, 12], ap: true },
    ],
  };

  const handleWelcomeSubmit = () => {
    if (userPreferences.band) {
      addCourse("Marching Band", "Fine Arts", 9, "Fall");
      addCourse("Concert Band", "Fine Arts", 9, "Spring");
    }
    if (userPreferences.choir) {
      const choirCourse = "Women's Choir";
      addCourse(choirCourse, "Fine Arts", 9, "Fall");
      addCourse(choirCourse, "Fine Arts", 9, "Spring");
    }
    setShowWelcome(false);
  };

  const addCourse = (courseName, dept, year, semester) => {
    const id = `${courseName}-${year}-${semester}`;
    if (!selectedCourses.find((c) => c.id === id)) {
      setSelectedCourses([
        ...selectedCourses,
        {
          name: courseName,
          dept,
          year,
          semester,
          id,
        },
      ]);
    }
  };

  const handleCourseClick = (courseName, dept) => {
    setPendingCourse({ name: courseName, dept });
    setShowCourseModal(true);
  };

  const handleAddCourseWithDetails = (year, semester) => {
    if (pendingCourse) {
      addCourse(pendingCourse.name, pendingCourse.dept, year, semester);
      setShowCourseModal(false);
      setPendingCourse(null);
    }
  };

  const removeCourse = (id) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== id));
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
      setCompletedCourses({ ...completedCourses, [id]: { grade: "" } });
    }
  };

  const setGrade = (id, grade) => {
    setCompletedCourses({
      ...completedCourses,
      [id]: { grade },
    });
  };

  const calculateGPA = () => {
    const gradePoints = {
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      F: 0.0,
    };
    const completed = Object.entries(completedCourses).filter(
      ([_, data]) => data.grade
    );
    if (completed.length === 0) return 0;
    const total = completed.reduce(
      (sum, [_, data]) => sum + (gradePoints[data.grade] || 0),
      0
    );
    return (total / completed.length).toFixed(2);
  };

  const calculateCredits = () => {
    const totals = {};
    Object.keys(requirements).forEach((dept) => (totals[dept] = 0));

    selectedCourses.forEach((selected) => {
      const course = Object.values(courses)
        .flat()
        .find((c) => c.name === selected.name);
      if (course && completedCourses[selected.id]) {
        totals[selected.dept] = (totals[selected.dept] || 0) + course.credits;
      }
    });

    return totals;
  };

  const calculateAPCredits = () => {
    let total = 0;
    selectedCourses.forEach((selected) => {
      const course = Object.values(courses)
        .flat()
        .find((c) => c.name === selected.name && c.ap);
      if (course && completedCourses[selected.id]) {
        if (course.name.includes("Calculus BC") || course.name.includes("PACE"))
          total += 8;
        else total += 3;
      }
    });
    return total;
  };

  const calculateDualCredits = () => {
    let total = 0;
    selectedCourses.forEach((selected) => {
      const course = Object.values(courses)
        .flat()
        .find((c) => c.name === selected.name && c.dual);
      if (course && completedCourses[selected.id]) {
        total += course.dual;
      }
    });
    return total;
  };

  const clearData = () => {
    if (confirm("Are you sure you want to clear all data and start over?")) {
      localStorage.removeItem("piusx-planner");
      setSelectedCourses([]);
      setCompletedCourses({});
      setShowWelcome(true);
    }
  };

  const exportToEmail = () => {
    const credits = calculateCredits();
    let body = "PIUS X COURSE PLANNER\n\n";
    body += `GPA: ${calculateGPA()}\n`;
    body += `AP Credits: ${calculateAPCredits()}\n`;
    body += `Dual Credits: ${calculateDualCredits()}\n\n`;
    body += "REQUIREMENTS:\n";
    Object.entries(requirements).forEach(([dept, req]) => {
      body += `${dept}: ${credits[dept] || 0}/${req}\n`;
    });
    body += "\n\nSELECTED COURSES:\n";
    ["Freshman", "Sophomore", "Junior", "Senior"].forEach((year, idx) => {
      const yearCourses = selectedCourses.filter((c) => c.year === idx + 9);
      if (yearCourses.length > 0) {
        body += `\n${year.toUpperCase()}:\n`;
        ["Fall", "Spring"].forEach((sem) => {
          const semCourses = yearCourses.filter((c) => c.semester === sem);
          if (semCourses.length > 0) {
            body += `  ${sem}:\n`;
            semCourses.forEach((c) => {
              const status = completedCourses[c.id]
                ? `✓ (${completedCourses[c.id].grade || "No grade"})`
                : "○";
              body += `    ${status} ${c.name}\n`;
            });
          }
        });
      }
    });
    window.location.href = `mailto:?subject=My Pius X Course Plan&body=${encodeURIComponent(
      body
    )}`;
  };

  const printPlan = () => {
    window.print();
  };

  const filterCoursesByTab = (courseName) => {
    if (activeTab === "all") return true;
    const yearMap = { freshman: 9, sophomore: 10, junior: 11, senior: 12 };
    return selectedCourses.some(
      (c) => c.name === courseName && c.year === yearMap[activeTab]
    );
  };

  const getYearCourses = (year) => {
    return selectedCourses.filter((c) => c.year === year);
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-blue-900" />
          </div>
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
            Pius X Course Planner
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Let's get started with a few questions
          </p>

          <div className="space-y-6">
            <div className="border-2 border-gray-200 rounded-lg p-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPreferences.band}
                  onChange={(e) =>
                    setUserPreferences({
                      ...userPreferences,
                      band: e.target.checked,
                    })
                  }
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
                  onChange={(e) =>
                    setUserPreferences({
                      ...userPreferences,
                      choir: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-blue-900 rounded"
                />
                <span className="ml-3 text-lg">Are you in Choir?</span>
              </label>
            </div>

            <button
              onClick={handleWelcomeSubmit}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Continue to Planner
            </button>
          </div>
        </div>
      </div>
    );
  }

  const credits = calculateCredits();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <button
                onClick={exportToEmail}
                className="p-2 hover:bg-blue-800 rounded"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </button>
              <button
                onClick={printPlan}
                className="p-2 hover:bg-blue-800 rounded"
                title="Print"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={clearData}
                className="p-2 hover:bg-blue-800 rounded"
                title="Clear All"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {["all", "freshman", "sophomore", "junior", "senior"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold capitalize ${
                  activeTab === tab
                    ? "border-b-4 border-blue-900 text-blue-900"
                    : "text-gray-600 hover:text-blue-900"
                }`}
              >
                {tab === "all" ? "All Grades" : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Selection */}
          <div className="lg:col-span-2 print:hidden">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Available Courses
              </h2>

              <div className="space-y-4">
                {Object.entries(courses).map(([dept, courseList]) => (
                  <div key={dept} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        setExpandedDepts({
                          ...expandedDepts,
                          [dept]: !expandedDepts[dept],
                        })
                      }
                      className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 flex justify-between items-center"
                    >
                      <span className="font-semibold text-blue-900">
                        {dept}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedDepts[dept] ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {expandedDepts[dept] && (
                      <div className="p-4 space-y-2">
                        {courseList.map((course) => (
                          <button
                            key={course.name}
                            onClick={() => handleCourseClick(course.name, dept)}
                            className="w-full text-left px-4 py-2 rounded hover:bg-blue-50 border border-gray-200 flex justify-between items-center"
                          >
                            <div>
                              <span>{course.name}</span>
                              {course.ap && (
                                <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">
                                  AP
                                </span>
                              )}
                              {course.dual && (
                                <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                                  Dual
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              {course.credits} credits
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Summary</h2>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900">
                    {calculateGPA()}
                  </div>
                  <div className="text-sm text-gray-600">Unweighted GPA</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="text-2xl font-bold text-purple-900">
                    {calculateAPCredits()}
                  </div>
                  <div className="text-xs text-gray-600">AP Credits</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-900">
                    {calculateDualCredits()}
                  </div>
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
                        <span
                          className={
                            earned >= required
                              ? "text-green-600 font-semibold"
                              : ""
                          }
                        >
                          {earned}/{required}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            earned >= required ? "bg-green-600" : "bg-blue-600"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Courses */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Your Selected Courses
              </h3>

              {activeTab === "all"
                ? ["Freshman", "Sophomore", "Junior", "Senior"].map(
                    (yearName, idx) => {
                      const year = idx + 9;
                      const yearCourses = getYearCourses(year);
                      if (yearCourses.length === 0) return null;

                      return (
                        <div key={yearName} className="mb-6">
                          <h4 className="font-semibold text-lg mb-3">
                            {yearName}
                          </h4>
                          {["Fall", "Spring"].map((semester) => {
                            const semCourses = yearCourses.filter(
                              (c) => c.semester === semester
                            );
                            if (semCourses.length === 0) return null;

                            return (
                              <div key={semester} className="mb-4">
                                <div className="text-sm font-semibold text-gray-600 mb-2">
                                  {semester}
                                </div>
                                <div className="space-y-2">
                                  {semCourses.map((course) => (
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
                    }
                  )
                : (() => {
                    const yearMap = {
                      freshman: 9,
                      sophomore: 10,
                      junior: 11,
                      senior: 12,
                    };
                    const year = yearMap[activeTab];
                    const yearCourses = getYearCourses(year);

                    return ["Fall", "Spring"].map((semester) => {
                      const semCourses = yearCourses.filter(
                        (c) => c.semester === semester
                      );
                      if (semCourses.length === 0) return null;

                      return (
                        <div key={semester} className="mb-4">
                          <div className="text-sm font-semibold text-gray-600 mb-2">
                            {semester}
                          </div>
                          <div className="space-y-2">
                            {semCourses.map((course) => (
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
                  })()}

              {selectedCourses.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No courses selected yet. Click on courses above to add them.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      {showCourseModal && pendingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add {pendingCourse.name}</h3>
            <p className="text-gray-600 mb-4">
              When do you want to take this course?
            </p>

            <div className="space-y-3">
              {[
                { year: 9, label: "Freshman" },
                { year: 10, label: "Sophomore" },
                { year: 11, label: "Junior" },
                { year: 12, label: "Senior" },
              ].map(({ year, label }) => (
                <div key={year}>
                  <div className="font-semibold mb-2">{label}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddCourseWithDetails(year, "Fall")}
                      className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                    >
                      Fall
                    </button>
                    <button
                      onClick={() => handleAddCourseWithDetails(year, "Spring")}
                      className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                    >
                      Spring
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

const CourseCard = ({
  course,
  completedCourses,
  toggleCompleted,
  setGrade,
  removeCourse,
}) => {
  const isCompleted = completedCourses[course.id];

  return (
    <div className="border rounded p-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleCompleted(course.id)}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                isCompleted
                  ? "bg-green-600 border-green-600"
                  : "border-gray-300"
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
