let allInternships = [];


// ================================
// CHECK STUDENT LOGIN
// ================================

const studentData = localStorage.getItem("student");

if (!studentData) {
    window.location.href = "index.html";
} else {

    const student = JSON.parse(studentData);

    const studentNameTop =
        document.getElementById("studentNameTop");

    const studentInitial =
        document.getElementById("studentInitial");

    if (studentNameTop) {
        studentNameTop.textContent = student.name;
    }

    if (studentInitial) {
        studentInitial.textContent =
            student.name.charAt(0).toUpperCase();
    }
}


// ================================
// LOAD INTERNSHIPS FROM DATABASE
// ================================

async function loadInternships() {

    const grid =
        document.getElementById("internshipGrid");

    try {

        const response = await fetch(
            "http://localhost:5000/api/internships"
        );

        const data = await response.json();

        console.log("Internship API:", data);

        if (!data.success) {

            grid.innerHTML = `
                <div class="loading-card">
                    Unable to load internships.
                </div>
            `;

            return;
        }

        allInternships = data.internships;

        displayInternships(allInternships);

    } catch (error) {

        console.error(
            "Internship loading error:",
            error
        );

        grid.innerHTML = `
            <div class="loading-card">
                Unable to connect to the server.
            </div>
        `;
    }
}


// ================================
// DISPLAY INTERNSHIPS
// ================================

function displayInternships(internships) {

    const grid =
        document.getElementById("internshipGrid");

    const resultCount =
        document.getElementById("resultCount");


    resultCount.textContent =
        `${internships.length} internship${
            internships.length !== 1 ? "s" : ""
        } available`;


    if (internships.length === 0) {

        grid.innerHTML = `
            <div class="loading-card">
                No internships match your search.
            </div>
        `;

        return;
    }


    grid.innerHTML = internships.map(internship => {

        const companyInitial =
            internship.company_name
                .charAt(0)
                .toUpperCase();


        return `
            <article class="internship-card">

                <div class="internship-card-top">

                    <div class="company-logo">
                        ${companyInitial}
                    </div>

                    <span class="approved-badge">
                        College Approved
                    </span>

                </div>


                <p class="internship-domain">
                    ${internship.domain}
                </p>


                <h3>
                    ${internship.title}
                </h3>


                <p class="company-name">
                    ${internship.company_name}
                </p>


                <div class="internship-meta">

                    <span>
                        📍 ${internship.location}
                    </span>

                    <span>
                        💰 ₹${Number(
                            internship.stipend
                        ).toLocaleString("en-IN")}
                    </span>

                    <span>
                        ⏱ ${internship.duration_weeks} weeks
                    </span>

                </div>


                <div class="internship-deadline">

                    Apply before
                    ${formatDate(
                        internship.application_deadline
                    )}

                </div>


                <button
                    class="view-internship-btn"
                    onclick="viewInternship(
                        ${internship.internship_id}
                    )"
                >
                    View Details →
                </button>

            </article>
        `;

    }).join("");
}


// ================================
// SEARCH + FILTER
// ================================

function filterInternships() {

    const search =
        document.getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const domain =
        document.getElementById("domainFilter").value;


    const location =
        document.getElementById("locationFilter").value;


    const filtered =
        allInternships.filter(internship => {

            const matchesSearch =
                internship.title
                    .toLowerCase()
                    .includes(search)

                ||

                internship.company_name
                    .toLowerCase()
                    .includes(search)

                ||

                internship.domain
                    .toLowerCase()
                    .includes(search);


            const matchesDomain =
                !domain ||
                internship.domain === domain;


            const matchesLocation =
                !location ||
                internship.location === location;


            return (
                matchesSearch &&
                matchesDomain &&
                matchesLocation
            );
        });


    displayInternships(filtered);
}


// ================================
// FORMAT DATE
// ================================

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// ================================
// OPEN INTERNSHIP DETAILS
// ================================

function viewInternship(id) {

    window.location.href =
        `internship-details.html?id=${id}`;
}


// ================================
// LOGOUT
// ================================

function logoutStudent() {

    localStorage.removeItem("student");

    window.location.href = "index.html";
}


// ================================
// FILTER EVENTS
// ================================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        filterInternships
    );


document
    .getElementById("domainFilter")
    .addEventListener(
        "change",
        filterInternships
    );


document
    .getElementById("locationFilter")
    .addEventListener(
        "change",
        filterInternships
    );


// ================================
// START
// ================================

loadInternships();