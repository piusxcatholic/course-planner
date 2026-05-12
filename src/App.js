/* =========================================================
   ADDITIONS / OVERRIDES — paste these into App.css
   ========================================================= */

/* 1. Make credits / subject text bolder and darker (was too light gray) */
.course-credits,
.course-subject,
.course-code,
.semester-credits,
.progress-text,
.period-note {
  color: #444;           /* was ~#aaa / #bbb */
  font-size: 0.82rem;   /* slightly larger than before */
  font-weight: 600;      /* bold */
}

/* In the requirements grid, the credit count next to subject */
.credits {
  color: #333;
  font-weight: 700;
  font-size: 0.82rem;
}

/* Period annotation inline */
.period-note {
  font-weight: 500;
  color: #555;
}

/* 2. Prerequisite info line on catalog cards */
.prereq-info {
  font-size: 0.75rem;
  margin-top: 3px;
  font-weight: 600;
}
.prereq-met {
  color: #2e7d32;  /* green */
}
.prereq-unmet {
  color: #b71c1c;  /* red */
}

/* 3. Blocked / locked catalog cards */
.catalog-course-card.prereq-blocked {
  opacity: 0.65;
  background: #fafafa;
  border-left: 3px solid #e57373;
}

.btn-add-course.btn-blocked {
  background: #bdbdbd;
  color: #fff;
  cursor: not-allowed;
}
.btn-add-course.btn-blocked:hover {
  background: #9e9e9e;
}

/* 4. Band pair badge */
.band-badge {
  font-size: 0.72rem;
  color: #6a1b9a;
  font-weight: 600;
}
