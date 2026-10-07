// =========================================
// LOAD STUDENT
// =========================================

const studentData = localStorage.getItem("student");


// If no student is logged in, return to login
if (!studentData) {

    window.location.href = "index.html";

} else {

    const student = JSON.parse(studentData);

    const studentName =
        document.getElementById("studentName");

    const studentNameTop =
        document.getElementById("studentNameTop");

    const studentInitial =
        document.getElementById("studentInitial");


    if (studentName) {
        studentName.textContent =
            student.name.split(" ")[0];
    }


    if (studentNameTop) {
        studentNameTop.textContent =
            student.name;
    }


    if (studentInitial) {
        studentInitial.textContent =
            student.name.charAt(0).toUpperCase();
    }


    // Load real application information
    loadApplications(student.student_id);
}


// =========================================
// LOAD APPLICATIONS FROM DATABASE
// =========================================

async function loadApplications(studentId) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/applications/student/${studentId}`
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


        // Sort newest application first
        applications.sort((a, b) =>
            new Date(b.applied_at) -
            new Date(a.applied_at)
        );


        // Update application statistics
        updateApplicationStats(applications);


        // Update recent application tracker
        updateRecentApplication(applications);


    } catch (error) {

        console.error(
            "Dashboard application error:",
            error
        );

    }
}


// =========================================
// APPLICATION STATISTICS
// =========================================

function updateApplicationStats(applications) {

    const statCards =
        document.querySelectorAll(
            ".stats-grid .stat-card"
        );


    let applicationCard = null;


    statCards.forEach(card => {

        const label =
            card.querySelector(".stat-label");


        if (
            label &&
            label.textContent.trim().toUpperCase() ===
            "APPLICATIONS"
        ) {

            applicationCard = card;

        }

    });


    if (!applicationCard) {
        return;
    }


    const value =
        applicationCard.querySelector(
            ".stat-value"
        );


    const bottom =
        applicationCard.querySelector(
            ".stat-bottom"
        );


    const shortlistedCount =
        applications.filter(
            application =>
                application.status === "shortlisted"
        ).length;


    if (value) {

        value.textContent =
            applications.length;

    }


    if (bottom) {

        bottom.innerHTML = `
            <span class="stat-positive">
                ${shortlistedCount} shortlisted
            </span>
        `;

    }

}


// =========================================
// UPDATE RECENT APPLICATION
// =========================================

function updateRecentApplication(
    applications
) {

    const panel =
        document.querySelector(
            ".application-panel"
        );


    if (!panel) {
        return;
    }


    // -----------------------------------------
    // NO APPLICATIONS
    // -----------------------------------------

    if (applications.length === 0) {

        const card =
            panel.querySelector(
                ".application-card"
            );


        if (card) {

            card.innerHTML = `
                <div style="padding: 10px 0;">
                    <strong>No applications yet</strong>

                    <span>
                        Apply to an internship to
                        track your progress here.
                    </span>
                </div>
            `;

        }

        return;
    }


    // -----------------------------------------
    // MOST RECENT APPLICATION
    // -----------------------------------------

    const application =
        applications[0];


    const status =
        application.status || "pending";


    const card =
        panel.querySelector(
            ".application-card"
        );


    if (!card) {
        return;
    }


    // -----------------------------------------
    // APPLICATION TITLE
    // -----------------------------------------

    const title =
        card.querySelector(
            ".application-company strong"
        );


    if (title) {

        title.textContent =
            application.title;

    }


    // -----------------------------------------
    // COMPANY + APPLIED DATE
    // -----------------------------------------

    const companyText =
        card.querySelector(
            ".application-company span"
        );


    if (companyText) {

        companyText.textContent =
            `${application.company_name} · Applied ${formatDate(application.applied_at)}`;

    }


    // -----------------------------------------
    // STATUS BADGE
    // -----------------------------------------

    const statusBadge =
        card.querySelector(
            ".status-badge"
        );


    if (statusBadge) {

        statusBadge.textContent =
            formatStatus(status);

        statusBadge.className =
            `status-badge status-${status}`;

    }


    // -----------------------------------------
    // UPDATE TIMELINE
    // -----------------------------------------

    updateTimeline(
        panel,
        application
    );

}


// =========================================
// UPDATE APPLICATION TIMELINE
// =========================================

function updateTimeline(
    panel,
    application
) {

    const steps =
        panel.querySelectorAll(
            ".application-timeline .timeline-step"
        );


    const lines =
        panel.querySelectorAll(
            ".application-timeline .timeline-line"
        );


    if (steps.length !== 4) {
        return;
    }


    const status =
        application.status || "pending";


    // Reset everything
    steps.forEach(step => {

        step.classList.remove(
            "completed",
            "current"
        );

    });


    lines.forEach(line => {

        line.classList.remove(
            "completed-line"
        );

    });


    // -----------------------------------------
    // STEP 1 — APPLIED
    // -----------------------------------------

    steps[0].classList.add(
        "completed"
    );


    const appliedDate =
        steps[0].querySelector("small");


    if (appliedDate) {

        appliedDate.textContent =
            formatDate(application.applied_at);

    }


    // -----------------------------------------
    // STEP 2 — SHORTLISTED
    // -----------------------------------------

    const shortlistedStep =
        steps[1];


    const shortlistedSmall =
        shortlistedStep.querySelector("small");


    const shortlistedStrong =
        shortlistedStep.querySelector("strong");


    if (status === "shortlisted" ||
        status === "accepted") {

        shortlistedStep.classList.add(
            "completed"
        );

        if (shortlistedSmall) {
            shortlistedSmall.textContent =
                "Completed";
        }

        if (lines[0]) {
            lines[0].classList.add(
                "completed-line"
            );
        }

    } else {

        shortlistedStep.classList.add(
            "current"
        );

        if (shortlistedSmall) {
            shortlistedSmall.textContent =
                "Pending";
        }

    }


    // -----------------------------------------
    // STEP 3 — INTERVIEW
    // -----------------------------------------

    const interviewStep =
        steps[2];


    const interviewSmall =
        interviewStep.querySelector("small");


    if (status === "accepted") {

        interviewStep.classList.add(
            "completed"
        );

        if (interviewSmall) {
            interviewSmall.textContent =
                "Completed";
        }

        if (lines[1]) {
            lines[1].classList.add(
                "completed-line"
            );
        }

    } else if (
        status === "shortlisted"
    ) {

        interviewStep.classList.add(
            "current"
        );

        if (interviewSmall) {
            interviewSmall.textContent =
                "Pending";
        }

        if (lines[0]) {
            lines[0].classList.add(
                "completed-line"
            );
        }

    } else {

        if (interviewSmall) {
            interviewSmall.textContent =
                "Pending";
        }

    }


    // -----------------------------------------
    // STEP 4 — DECISION
    // -----------------------------------------

    const decisionStep =
        steps[3];


    const decisionSmall =
        decisionStep.querySelector("small");


    if (status === "accepted") {

        decisionStep.classList.add(
            "completed"
        );

        if (decisionSmall) {
            decisionSmall.textContent =
                "Accepted";
        }

        if (lines[2]) {
            lines[2].classList.add(
                "completed-line"
            );
        }

    } else if (status === "rejected") {

        decisionStep.classList.add(
            "current"
        );

        if (decisionSmall) {
            decisionSmall.textContent =
                "Rejected";
        }

    } else if (status === "withdrawn") {

        decisionStep.classList.add(
            "current"
        );

        if (decisionSmall) {
            decisionSmall.textContent =
                "Withdrawn";
        }

    } else {

        if (decisionSmall) {
            decisionSmall.textContent =
                "Pending";
        }

    }


    // Update step labels if necessary
    const shortlistedLabel =
        shortlistedStrong;

    if (shortlistedLabel) {
        shortlistedLabel.textContent =
            "Shortlisted";
    }

}


// =========================================
// FORMAT STATUS
// =========================================

function formatStatus(status) {

    return status.charAt(0).toUpperCase() +
        status.slice(1);

}


// =========================================
// FORMAT DATE
// =========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "";
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


// =========================================
// OPEN APPLICATIONS PAGE
// =========================================

function openApplications() {

    window.location.href =
        "applications.html";

}


// =========================================
// LOGOUT
// =========================================

function logoutStudent() {

    localStorage.removeItem("student");

    window.location.href =
        "index.html";

}


// =========================================
// TEMPORARY BUTTON MESSAGE
// =========================================

function showComingSoon(feature) {

    alert(
        feature +
        " will be connected to the database next."
    );

}