const http = require("http");

const BASE_URL = "http://localhost:5000";

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.url || options.path, BASE_URL);
    const reqOptions = {
      method: options.method || "GET",
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: options.headers || {}
    };

    let body = postData;
    if (body && typeof body === "object" && !(body instanceof Buffer)) {
      body = JSON.stringify(body);
      reqOptions.headers["Content-Type"] = "application/json";
    }

    if (body) {
      reqOptions.headers["Content-Length"] = Buffer.byteLength(body);
    }

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
          raw: data
        });
      });
    });

    req.on("error", (err) => reject(err));
    if (body) req.write(body);
    req.end();
  });
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    console.error(`  [FAIL] ${message}`);
  }
}

async function runTests() {
  console.log("===============================================================");
  console.log("College2Career (C2C) Full System Integration & Security Tests");
  console.log("===============================================================\n");

  let studentToken = "";
  let studentUser = null;
  let facultyToken = "";
  let facultyUser = null;
  let adminToken = "";
  let adminUser = null;
  let student2Token = "";
  let student2User = null;

  // -------------------------------------------------------------
  // TEST 1: Authentication & Token Generation
  // -------------------------------------------------------------
  console.log("--- TEST 1: Authentication & JWT Token Generation ---");
  
  // Student Login
  const sRes = await request({
    method: "POST",
    path: "/api/login"
  }, { email: "student1@gmail.com", password: "Student@123" });
  assert(sRes.status === 200, "Student login returns 200 OK");
  assert(sRes.data.success === true, "Student login returns success: true");
  assert(!!sRes.data.token, "Student login returns signed JWT token");
  assert(sRes.data.user.role === "student", "Student user payload has role === 'student'");
  assert(sRes.data.user.student_id === 1, "Student user payload has student_id === 1");
  studentToken = sRes.data.token;
  studentUser = sRes.data.user;

  // Faculty Login
  const fRes = await request({
    method: "POST",
    path: "/api/login"
  }, { email: "faculty@student2career.com", password: "Faculty@123" });
  assert(fRes.status === 200, "Faculty login returns 200 OK");
  assert(fRes.data.user.role === "faculty", "Faculty user payload has role === 'faculty'");
  assert(!!fRes.data.user.faculty_id, "Faculty user payload has faculty_id");
  facultyToken = fRes.data.token;
  facultyUser = fRes.data.user;

  // Admin Login
  const aRes = await request({
    method: "POST",
    path: "/api/login"
  }, { email: "admin@student2career.com", password: "Admin@123" });
  assert(aRes.status === 200, "Admin login returns 200 OK");
  assert(aRes.data.user.role === "admin", "Admin user payload has role === 'admin'");
  adminToken = aRes.data.token;
  adminUser = aRes.data.user;

  // Student 2 Login
  const s2Res = await request({
    method: "POST",
    path: "/api/login"
  }, { email: "samruddhi.wagh24@sanjivani.edu.in", password: "12345678" });
  assert(s2Res.status === 200, "Student 2 login returns 200 OK");
  student2Token = s2Res.data.token;
  student2User = s2Res.data.user;

  // Invalid Login
  const badLogin = await request({
    method: "POST",
    path: "/api/login"
  }, { email: "student1@gmail.com", password: "WrongPassword999" });
  assert(badLogin.status === 401, "Invalid password returns 401 Unauthorized");

  // -------------------------------------------------------------
  // TEST 2: CGPA Scale (0.00 to 10.00) Validation
  // -------------------------------------------------------------
  console.log("\n--- TEST 2: CGPA Scale (0.00 - 10.00) Server-Side Validation ---");
  
  // Negative CGPA
  const negGpa = await request({
    method: "PUT",
    path: "/api/students/1",
    headers: { Authorization: `Bearer ${studentToken}` }
  }, { name: "Student One", phone: "1234567890", department: "Computer Science", gpa: -1.5 });
  assert(negGpa.status === 400, "Negative CGPA (-1.5) rejected with 400 Bad Request");

  // CGPA > 10.00
  const overGpa = await request({
    method: "PUT",
    path: "/api/students/1",
    headers: { Authorization: `Bearer ${studentToken}` }
  }, { name: "Student One", phone: "1234567890", department: "Computer Science", gpa: 10.5 });
  assert(overGpa.status === 400, "CGPA > 10.00 (10.5) rejected with 400 Bad Request");

  // Non-numeric CGPA
  const strGpa = await request({
    method: "PUT",
    path: "/api/students/1",
    headers: { Authorization: `Bearer ${studentToken}` }
  }, { name: "Student One", phone: "1234567890", department: "Computer Science", gpa: "TenPointZero" });
  assert(strGpa.status === 400, "Non-numeric CGPA rejected with 400 Bad Request");

  // Valid CGPA: 8.75
  const validGpa = await request({
    method: "PUT",
    path: "/api/students/1",
    headers: { Authorization: `Bearer ${studentToken}` }
  }, { name: "Student One", phone: "1234567890", department: "Computer Science", gpa: 8.75 });
  assert(validGpa.status === 200, "Valid CGPA 8.75 accepted with 200 OK");

  // Boundary CGPA: 10.00
  const maxGpa = await request({
    method: "PUT",
    path: "/api/students/1",
    headers: { Authorization: `Bearer ${studentToken}` }
  }, { name: "Student One", phone: "1234567890", department: "Computer Science", gpa: 10.00 });
  assert(maxGpa.status === 200, "Maximum boundary CGPA 10.00 accepted with 200 OK");

  // Boundary CGPA: 0.00
  const minGpa = await request({
    method: "PUT",
    path: "/api/students/1",
    headers: { Authorization: `Bearer ${studentToken}` }
  }, { name: "Student One", phone: "1234567890", department: "Computer Science", gpa: 0.00 });
  assert(minGpa.status === 200, "Minimum boundary CGPA 0.00 accepted with 200 OK");

  // Reset to original GPA (3.60)
  await request({
    method: "PUT",
    path: "/api/students/1",
    headers: { Authorization: `Bearer ${studentToken}` }
  }, { name: "Student One", phone: "1234567890", department: "Computer Science", gpa: 3.60 });

  // -------------------------------------------------------------
  // TEST 3: Role-Based Authorization & Security Boundaries
  // -------------------------------------------------------------
  console.log("\n--- TEST 3: Role-Based Authorization & Security Boundaries ---");

  // Unauthenticated request to protected endpoint
  const unauth = await request({
    method: "GET",
    path: "/api/admin/audit"
  });
  assert(unauth.status === 401, "Unauthenticated request to /api/admin/audit returns 401 Unauthorized");

  // Student attempts to access admin audit
  const studentForbidden = await request({
    method: "GET",
    path: "/api/admin/audit",
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  assert(studentForbidden.status === 403, "Student accessing admin audit returns 403 Forbidden");

  // Faculty attempts to access admin audit
  const facultyForbidden = await request({
    method: "GET",
    path: "/api/admin/audit",
    headers: { Authorization: `Bearer ${facultyToken}` }
  });
  assert(facultyForbidden.status === 403, "Faculty accessing admin audit returns 403 Forbidden");

  // Student attempts to update another student's profile (student_id: 2 using student 1 token)
  const crossStudent = await request({
    method: "PUT",
    path: "/api/students/2",
    headers: { Authorization: `Bearer ${studentToken}` }
  }, { name: "Hacked", phone: "0000000000", department: "Computer Science", gpa: 9.00 });
  assert(crossStudent.status === 403, "Student updating another student profile returns 403 Forbidden");

  // -------------------------------------------------------------
  // TEST 4: Module 2 Off-Campus Lifecycle, Resubmission & Audit Trail
  // -------------------------------------------------------------
  console.log("\n--- TEST 4: Off-Campus Submission, Verification, Resubmission & Audit ---");

  // 4a: Student submits off-campus record
  const submitRes = await request({
    method: "POST",
    path: "/api/off-campus",
    headers: { Authorization: `Bearer ${studentToken}` }
  }, {
    record_type: "internship",
    company_name: "Tesla Inc.",
    role_title: "Autopilot Software Intern",
    start_date: "2026-06-01",
    end_date: "2026-08-31",
    description: "Self-secured summer internship on embedded systems."
  });
  assert(submitRes.status === 201, "Student submits off-campus record returns 201 Created");
  assert(submitRes.data.submission.status === "pending", "Initial status is 'pending'");
  const submissionId = submitRes.data.submission.id;

  // 4b: Student views own submissions
  const mySubmissions = await request({
    method: "GET",
    path: "/api/off-campus/my",
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  assert(mySubmissions.status === 200, "Student retrieves own submissions returns 200 OK");
  const found = mySubmissions.data.submissions.some(s => (s.id || s.submission_id) === submissionId);
  assert(found, "Newly created submission is present in student's list");

  // 4c: Student attempts direct decision API call (Privilege Escalation attempt)
  const hijackDecision = await request({
    method: "PATCH",
    path: `/api/off-campus/admin/${submissionId}/decision`,
    headers: { Authorization: `Bearer ${studentToken}` }
  }, { status: "approved", comments: "Self approval attempt" });
  assert(hijackDecision.status === 403, "Student cannot call approval endpoint (403 Forbidden)");

  // 4d: Admin views queue
  const adminQueue = await request({
    method: "GET",
    path: "/api/off-campus/admin/queue",
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(adminQueue.status === 200, "Admin views off-campus queue returns 200 OK");
  assert(adminQueue.data.submissions.some(s => (s.id || s.submission_id) === submissionId), "Pending submission is in T&P queue");

  // 4e: Admin requests more info
  const reqInfoRes = await request({
    method: "PATCH",
    path: `/api/off-campus/admin/${submissionId}/decision`,
    headers: { Authorization: `Bearer ${adminToken}` }
  }, { status: "needs_more_info", comments: "Please provide official HR contact or offer letter letterhead." });
  assert(reqInfoRes.status === 200, "T&P requests more info returns 200 OK");
  assert(reqInfoRes.data.submission.status === "needs_more_info", "Status transitioned to 'needs_more_info'");

  // 4f: Student resubmits with additional info
  const resubmitRes = await request({
    method: "PUT",
    path: `/api/off-campus/${submissionId}/resubmit`,
    headers: { Authorization: `Bearer ${studentToken}` }
  }, { description: "Updated with HR verification contact: hr-internships@tesla.com" });
  assert(resubmitRes.status === 200, "Student resubmission returns 200 OK");
  assert(resubmitRes.data.submission.status === "pending", "Status reverted to 'pending' for re-review");

  // 4g: Admin rejection without mandatory reason must fail
  const emptyReject = await request({
    method: "PATCH",
    path: `/api/off-campus/admin/${submissionId}/decision`,
    headers: { Authorization: `Bearer ${adminToken}` }
  }, { status: "rejected", comments: "   " });
  assert(emptyReject.status === 400, "Rejection without comment returns 400 Bad Request");

  // 4h: Admin approves submission
  const approveRes = await request({
    method: "PATCH",
    path: `/api/off-campus/admin/${submissionId}/decision`,
    headers: { Authorization: `Bearer ${adminToken}` }
  }, { status: "approved", comments: "Offer letter and company legitimacy verified by T&P cell." });
  assert(approveRes.status === 200, "T&P approval returns 200 OK");
  assert(approveRes.data.submission.status === "approved", "Status transitioned to 'approved'");

  // 4i: Verify append-only audit trail
  const historyRes = await request({
    method: "GET",
    path: `/api/off-campus/${submissionId}/history`,
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  assert(historyRes.status === 200, "Audit trail retrieval returns 200 OK");
  assert(historyRes.data.history.length >= 3, "Audit trail contains complete lifecycle entries");
  const actions = historyRes.data.history.map(h => (h.action || "").toUpperCase());
  assert(actions.some(a => a.includes("SUBMIT")), "Audit trail has submission event");
  assert(actions.some(a => a.includes("INFO") || a.includes("REQUEST")), "Audit trail has needs_more_info event");
  assert(actions.some(a => a.includes("RESUBMIT")), "Audit trail has resubmitted event");
  assert(actions.some(a => a.includes("APPROV")), "Audit trail has approval event");

  // 4j: Student 2 attempts to read Student 1's history
  const privacyCheck = await request({
    method: "GET",
    path: `/api/off-campus/${submissionId}/history`,
    headers: { Authorization: `Bearer ${student2Token}` }
  });
  assert(privacyCheck.status === 403, "Student 2 cannot view Student 1's submission history (403 Forbidden)");

  // -------------------------------------------------------------
  // TEST 5: Module 3 Institutional Reports, Reconciled Placements & CSV Export
  // -------------------------------------------------------------
  console.log("\n--- TEST 5: Institutional Reports, Deduplicated Placements & CSV Export ---");

  const reportsRes = await request({
    method: "GET",
    path: "/api/admin/reports",
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(reportsRes.status === 200, "Admin reports returns 200 OK");
  const rep = reportsRes.data;
  const summary = rep.summary;
  const deptStats = rep.departmentStats;
  assert(typeof summary.students === "number" && summary.students > 0, "Reports has valid total_students count");
  assert(typeof summary.unique_placed_students === "number", "Reports has deduplicated unique_placed_students");
  assert(summary.unique_placed_students <= summary.students, "Unique placed students is <= total students");
  assert(summary.off_campus_approved >= 1, "Off-campus approved count reflects verified submissions");
  assert(Array.isArray(deptStats) && deptStats.length > 0, "Department breakdown array returned");
  
  // Verify Department Placement Rate calculation
  for (const dept of deptStats) {
    const calculatedRate = dept.total_students > 0 ? Math.round((dept.unique_placed_students / dept.total_students) * 100) : 0;
    assert(dept.placement_percentage === calculatedRate, `Dept ${dept.department} placement rate (${dept.placement_percentage}%) matches math`);
  }

  // Export CSV
  const csvRes = await request({
    method: "GET",
    path: "/api/admin/reports/export",
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(csvRes.status === 200, "CSV Export returns 200 OK");
  assert(csvRes.headers["content-type"].includes("text/csv"), "CSV Export header is text/csv");
  assert(csvRes.raw.includes("INSTITUTIONAL RECONCILED PLACEMENT"), "CSV contains Institutional Report title");
  assert(csvRes.raw.includes("Unique Placed Students"), "CSV contains Unique Placed Students line");
  assert(csvRes.raw.includes("Department,Total Students,Unique Placed Students"), "CSV contains department table headers");

  // Admin Audit Log
  const auditRes = await request({
    method: "GET",
    path: "/api/admin/audit",
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(auditRes.status === 200, "Admin audit trail returns 200 OK");
  assert(auditRes.data.audit_logs.length > 0, "Admin audit logs contains events");

  // -------------------------------------------------------------
  // TEST 6: Module 4 Faculty Department-Scoped Read-Only Enforcements
  // -------------------------------------------------------------
  console.log("\n--- TEST 6: Faculty Department-Scoped Read-Only Enforcements ---");

  // Faculty summary
  const fSummary = await request({
    method: "GET",
    path: "/api/faculty/department/summary",
    headers: { Authorization: `Bearer ${facultyToken}` }
  });
  assert(fSummary.status === 200, "Faculty department summary returns 200 OK");
  assert(!!fSummary.data.department, `Faculty department derived on server: ${fSummary.data.department}`);
  const facDept = fSummary.data.department;

  // Faculty students
  const fStudents = await request({
    method: "GET",
    path: "/api/faculty/department/students",
    headers: { Authorization: `Bearer ${facultyToken}` }
  });
  assert(fStudents.status === 200, "Faculty department students returns 200 OK");
  assert(Array.isArray(fStudents.data.students), "Students is an array");
  
  // Verify all students belong strictly to faculty's department
  const allMatch = fStudents.data.students.every(s => s.department === facDept);
  assert(allMatch, `All ${fStudents.data.students.length} returned students belong strictly to '${facDept}'`);

  // Faculty attempts department spoofing via query param
  const spoofedStudents = await request({
    method: "GET",
    path: "/api/faculty/department/students?department=NonExistentOrDifferentDept",
    headers: { Authorization: `Bearer ${facultyToken}` }
  });
  assert(spoofedStudents.status === 200, "Query param spoofing does not crash");
  const stillMatchesDept = spoofedStudents.data.students.every(s => s.department === facDept);
  assert(stillMatchesDept, "Server ignored client override: scoped strictly to faculty's department");

  // Faculty Readiness
  const fReadiness = await request({
    method: "GET",
    path: "/api/faculty/department/readiness",
    headers: { Authorization: `Bearer ${facultyToken}` }
  });
  assert(fReadiness.status === 200, "Faculty career readiness returns 200 OK");
  assert(Array.isArray(fReadiness.data.missing_skills_analysis), "Missing skills analysis array returned");
  assert(Array.isArray(fReadiness.data.practical_guidance), "Practical guidance recommendations returned");

  // -------------------------------------------------------------
  // TEST SUMMARY
  // -------------------------------------------------------------
  console.log("\n===============================================================");
  console.log(`TEST SUITE RESULTS: ${passedTests} / ${totalTests} PASSED`);
  if (passedTests === totalTests) {
    console.log("STATUS: ALL TESTS PASSED SUCCESSFULLY (100% VERIFIED)");
  } else {
    console.log(`STATUS: ${totalTests - passedTests} TESTS FAILED`);
  }
  console.log("===============================================================\n");

  process.exit(passedTests === totalTests ? 0 : 1);
}

runTests().catch(err => {
  console.error("Test execution error:", err);
  process.exit(1);
});
