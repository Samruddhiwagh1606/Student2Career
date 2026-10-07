const API_BASE_URL = "http://localhost:5000/api";

const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const internshipDetails = document.getElementById("internshipDetails");

const internshipTitle = document.getElementById("internshipTitle");
const internshipDomain = document.getElementById("internshipDomain");
const companyName = document.getElementById("companyName");
const companyNameBottom = document.getElementById("companyNameBottom");

const companyLogo = document.getElementById("companyLogo");

const internshipLocation = document.getElementById("internshipLocation");
const internshipStipend = document.getElementById("internshipStipend");
const internshipDuration = document.getElementById("internshipDuration");
const internshipDeadline = document.getElementById("internshipDeadline");

const internshipDescription =
    document.getElementById("internshipDescription");

const internshipStartDate =
    document.getElementById("internshipStartDate");

const internshipEndDate =
    document.getElementById("internshipEndDate");

const contactPerson =
    document.getElementById("contactPerson");

const contactEmail =
    document.getElementById("contactEmail");

const applyBtn =
    document.getElementById("applyBtn");


// GET INTERNSHIP ID FROM URL
const urlParams = new URLSearchParams(window.location.search);
const internshipId = urlParams.get("id");


// FORMAT DATE
function formatDate(dateValue) {
    if (!dateValue) {
        return "Not specified";
    }

    const date = new Date(dateValue);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// FORMAT DOMAIN
function formatDomain(domain) {
    if (!domain) {
        return "INTERNSHIP";
    }

    return domain.toUpperCase();
}


// FORMAT COMPANY INITIAL
function getCompanyInitial(company) {
    if (!company) {
        return "S";
    }

    return company.charAt(0).toUpperCase();
}


// LOAD INTERNSHIP
async function loadInternship() {

    if (!internshipId) {
        loadingMessage.style.display = "none";
        errorMessage.textContent =
            "No internship was selected.";
        errorMessage.style.display = "block";
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/internships/${internshipId}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Unable to load internship."
            );
        }

        const internship = data.internship;


        // HEADER
        internshipTitle.textContent =
            internship.title || "Internship";

        internshipDomain.textContent =
            formatDomain(internship.domain);

        companyName.textContent =
            internship.company_name || "Company";

        companyNameBottom.textContent =
            internship.company_name || "Not specified";

        companyLogo.textContent =
            getCompanyInitial(internship.company_name);


        // QUICK INFORMATION
        internshipLocation.textContent =
            internship.location || "Not specified";

        internshipStipend.textContent =
            internship.stipend
                ? `₹${Number(internship.stipend).toLocaleString("en-IN")}`
                : "Unpaid";

        internshipDuration.textContent =
            internship.duration_weeks
                ? `${internship.duration_weeks} weeks`
                : "Not specified";

        internshipDeadline.textContent =
            formatDate(internship.application_deadline);


        // DESCRIPTION
        internshipDescription.textContent =
            internship.description ||
            "No description has been provided.";


        // TIMELINE
        internshipStartDate.textContent =
            formatDate(internship.start_date);

        internshipEndDate.textContent =
            formatDate(internship.end_date);


        // COMPANY INFORMATION
        contactPerson.textContent =
            internship.contact_person ||
            "Not specified";

        contactEmail.textContent =
            internship.contact_email ||
            "Not specified";


        // APPLY BUTTON
        applyBtn.addEventListener("click", function () {

            window.location.href =
                `applications.html?internship_id=${internship.internship_id}`;

        });


        // SHOW PAGE
        loadingMessage.style.display = "none";
        internshipDetails.style.display = "block";


    } catch (error) {

        console.error(
            "Internship details error:",
            error
        );

        loadingMessage.style.display = "none";

        errorMessage.textContent =
            "Unable to load internship details.";

        errorMessage.style.display = "block";
    }
}


// LOGOUT
const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (event) {

        event.preventDefault();

        localStorage.clear();

        window.location.href = "index.html";
    });
}


// START
loadInternship();