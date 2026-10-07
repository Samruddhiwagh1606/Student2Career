const params = new URLSearchParams(window.location.search);
const internshipId = params.get("internship_id");

const applySection = document.querySelector(".application-page");
const myApplicationsSection = document.getElementById("myApplicationsSection");


// =====================================================
// STUDENT DATA
// =====================================================

const student = JSON.parse(localStorage.getItem("student"));

if (!student) {
    alert("Please login first.");
    window.location.href = "index.html";
}


// =====================================================
// TOPBAR STUDENT INFO
// =====================================================

if (student) {

    const studentNameTop = document.getElementById("studentNameTop");
    const studentInitial = document.getElementById("studentInitial");

    if (studentNameTop) {
        studentNameTop.textContent = student.name;
    }

    if (studentInitial) {
        studentInitial.textContent =
            student.name.charAt(0).toUpperCase();
    }
}


// =====================================================
// MODE 1 — APPLY FOR INTERNSHIP
// =====================================================

if (internshipId) {

    // Show application form
    if (applySection) {
        applySection.style.display = "block";
    }

    // Hide My Applications
    if (myApplicationsSection) {
        myApplicationsSection.style.display = "none";
    }

    loadStudentData();
    loadInternship();

    const applicationForm =
        document.getElementById("applicationForm");

    if (applicationForm) {
        applicationForm.addEventListener(
            "submit",
            submitApplication
        );
    }
}


// =====================================================
// MODE 2 — MY APPLICATIONS
// =====================================================

else {

    // Hide application form
    if (applySection) {
        applySection.style.display = "none";
    }

    // Show My Applications
    if (myApplicationsSection) {
        myApplicationsSection.style.display = "block";
    }

    loadMyApplications();
}


// =====================================================
// LOAD STUDENT DATA
// =====================================================

function loadStudentData() {

    document.getElementById("studentName").value =
        student.name || "";

    document.getElementById("studentEmail").value =
        student.email || "";

    document.getElementById("studentDepartment").value =
        student.department || "";

    document.getElementById("studentGpa").value =
        student.gpa || "";
}


// =====================================================
// LOAD INTERNSHIP DETAILS
// =====================================================

async function loadInternship() {

    try {

        const response = await fetch(
            `http://localhost:5000/api/internships/${internshipId}`
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error(
                data.message || "Internship not found."
            );
        }

        const internship = data.internship;

        const titleElement =
            document.getElementById("applicationInternshipTitle");

        const companyElement =
            document.getElementById("applicationCompanyName");

        if (titleElement) {
            titleElement.textContent =
                internship.title;
        }

        if (companyElement) {
            companyElement.textContent =
                internship.company_name;
        }

    } catch (error) {

        console.error(
            "Internship loading error:",
            error
        );
    }
}


// =====================================================
// SUBMIT APPLICATION
// =====================================================

async function submitApplication(event) {

    event.preventDefault();

    const form = event.target;

    const resume =
        document.getElementById("resume").files[0];

    const qualifications =
        document.getElementById("qualifications").value.trim();

    const coverLetter =
        document.getElementById("coverLetter").value.trim();

    const message =
        document.getElementById("applicationMessage");

    const submitButton =
        document.getElementById("submitApplicationBtn");


    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!resume) {

        message.textContent =
            "Please upload your resume.";

        message.className =
            "application-message error";

        return;
    }


    if (resume.type !== "application/pdf") {

        message.textContent =
            "Resume must be a PDF file.";

        message.className =
            "application-message error";

        return;
    }


    if (resume.size > 5 * 1024 * 1024) {

        message.textContent =
            "Resume must be smaller than 5 MB.";

        message.className =
            "application-message error";

        return;
    }


    if (!qualifications) {

        message.textContent =
            "Please enter your qualifications.";

        message.className =
            "application-message error";

        return;
    }


    if (!coverLetter) {

        message.textContent =
            "Please enter a cover letter.";

        message.className =
            "application-message error";

        return;
    }


    // -----------------------------------------------
    // PREPARE DATA
    // -----------------------------------------------

    const formData = new FormData();

    formData.append(
        "student_id",
        student.student_id
    );

    formData.append(
        "internship_id",
        internshipId
    );

    formData.append(
        "resume",
        resume
    );

    formData.append(
        "qualifications",
        qualifications
    );

    formData.append(
        "cover_letter",
        coverLetter
    );


    // -----------------------------------------------
    // SUBMIT
    // -----------------------------------------------

    try {

        submitButton.disabled = true;

        submitButton.textContent =
            "Submitting...";


        const response = await fetch(
            "http://localhost:5000/api/applications",
            {
                method: "POST",
                body: formData
            }
        );


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.message ||
                "Application submission failed."
            );
        }


        message.textContent =
            "Application submitted successfully!";

        message.className =
            "application-message success";


        submitButton.textContent =
            "Application Submitted ✓";


        // Go to My Applications
        setTimeout(() => {

            window.location.href =
                "applications.html";

        }, 1500);


    } catch (error) {

        console.error(
            "Application submission error:",
            error
        );


        message.textContent =
            error.message;

        message.className =
            "application-message error";


        submitButton.disabled = false;

        submitButton.textContent =
            "Submit Application →";
    }
}


// =====================================================
// LOAD MY APPLICATIONS
// =====================================================

async function loadMyApplications() {

    const container =
        document.getElementById("applicationsList");

    if (!container) return;


    try {

        const response = await fetch(
            `http://localhost:5000/api/applications/student/${student.student_id}`
        );


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to load applications."
            );
        }


        const applications =
            data.applications || [];


        // -------------------------------------------
        // NO APPLICATIONS
        // -------------------------------------------

        if (applications.length === 0) {

            container.innerHTML = `
                <div class="no-applications">
                    <h3>No applications yet</h3>

                    <p>
                        You haven't applied for any
                        internships yet.
                    </p>

                    <a
                        href="internship.html"
                        class="primary-btn"
                    >
                        Browse Internships →
                    </a>
                </div>
            `;

            return;
        }


        // -------------------------------------------
        // APPLICATION CARDS
        // -------------------------------------------

        container.innerHTML =
            applications.map(application => {

                const status =
                    application.status || "pending";


                return `
                    <div class="application-card">

                        <div class="application-card-main">

                            <div>

                                <span class="application-domain">
                                    ${application.domain || "Internship"}
                                </span>

                                <h2>
                                    ${application.title}
                                </h2>

                                <p class="application-company">
                                    ${application.company_name}
                                </p>

                            </div>


                            <span
                                class="application-status status-${status}"
                            >
                                ${formatStatus(status)}
                            </span>

                        </div>


                        <div class="application-card-info">

                            <div>
                                <span>Location</span>
                                <strong>
                                    ${application.location || "Not specified"}
                                </strong>
                            </div>

                            <div>
                                <span>Applied On</span>
                                <strong>
                                    ${formatDate(application.applied_at)}
                                </strong>
                            </div>

                            <div>
                                <span>Deadline</span>
                                <strong>
                                    ${formatDate(application.application_deadline)}
                                </strong>
                            </div>

                        </div>


                        <div class="application-card-footer">

                            <span>
                                Application #${application.application_id}
                            </span>


                            <a
                                href="internship-details.html?id=${application.internship_id}"
                                class="secondary-btn"
                            >
                                View Internship →
                            </a>

                        </div>

                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "My applications error:",
            error
        );


        container.innerHTML = `
            <div class="no-applications">

                <h3>
                    Unable to load applications
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>
        `;
    }
}


// =====================================================
// FORMAT STATUS
// =====================================================

function formatStatus(status) {

    return status
        .charAt(0)
        .toUpperCase() +
        status.slice(1);
}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "Not specified";
    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {
        return dateValue;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}