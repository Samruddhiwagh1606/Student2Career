-- College2Career (Student2Career) Database Backup
-- Date: 2026-10-14T20:57:42.577Z

DROP TABLE IF EXISTS `applications`;
CREATE TABLE `applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `internship_id` int NOT NULL,
  `resume` varchar(255) NOT NULL,
  `cover_letter` text,
  `qualifications` text,
  `status` enum('pending','shortlisted','rejected','accepted','withdrawn') DEFAULT 'pending',
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_id`),
  UNIQUE KEY `student_id` (`student_id`,`internship_id`),
  KEY `internship_id` (`internship_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`internship_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `applications` (`application_id`, `student_id`, `internship_id`, `resume`, `cover_letter`, `qualifications`, `status`, `applied_at`) VALUES (1, 1, 1, '/uploads/resumes/1791054869725-171085260.pdf', 'interested', 'java', 'accepted', '2026-10-03 19:14:29');
INSERT INTO `applications` (`application_id`, `student_id`, `internship_id`, `resume`, `cover_letter`, `qualifications`, `status`, `applied_at`) VALUES (3, 1, 2, '/uploads/resumes/1791740872012-178409248.pdf', 'Because I know problem solving', 'java', 'pending', '2026-10-11 17:47:52');
INSERT INTO `applications` (`application_id`, `student_id`, `internship_id`, `resume`, `cover_letter`, `qualifications`, `status`, `applied_at`) VALUES (4, 1, 7, '/uploads/resumes/1791873445469-531133123.pdf', 'Interested', 'java', 'pending', '2026-10-13 06:37:25');
INSERT INTO `applications` (`application_id`, `student_id`, `internship_id`, `resume`, `cover_letter`, `qualifications`, `status`, `applied_at`) VALUES (5, 2, 1, '/uploads/resumes/1791886453937-857946576.pdf', 'interested', 'java', 'accepted', '2026-10-13 10:14:13');

DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `company_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `registration_number` varchar(100) NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`company_id`),
  UNIQUE KEY `registration_number` (`registration_number`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `companies` (`company_id`, `name`, `registration_number`, `location`, `contact_person`, `contact_email`) VALUES (1, 'TechNova Solutions', 'TN2026001', 'Pune', 'Rohan Mehta', 'hr@technova.com');
INSERT INTO `companies` (`company_id`, `name`, `registration_number`, `location`, `contact_person`, `contact_email`) VALUES (2, 'FinEdge Technologies', 'FE2026002', 'Mumbai', 'Priya Shah', 'careers@finedge.com');
INSERT INTO `companies` (`company_id`, `name`, `registration_number`, `location`, `contact_person`, `contact_email`) VALUES (3, 'CloudNest Labs', 'CN2026003', 'Bangalore', 'Ankit Rao', 'jobs@cloudnest.com');
INSERT INTO `companies` (`company_id`, `name`, `registration_number`, `location`, `contact_person`, `contact_email`) VALUES (7, 'PYTHON DEVLOPEMENT', 'REG-2026-2888', 'Pune', 'Dr.Gawli', 'hr@microsoft.com');

DROP TABLE IF EXISTS `company_student_feedback`;
CREATE TABLE `company_student_feedback` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `company_id` int NOT NULL,
  `student_id` int NOT NULL,
  `technical_skills` int NOT NULL,
  `soft_skills` int NOT NULL,
  `punctuality` int NOT NULL,
  `responsibility` int NOT NULL,
  `teamwork` int NOT NULL,
  `learning_ability` int NOT NULL,
  `likelihood_to_hire` int NOT NULL,
  `comments` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_id`),
  UNIQUE KEY `application_id` (`application_id`),
  KEY `company_id` (`company_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `company_student_feedback_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE,
  CONSTRAINT `company_student_feedback_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE,
  CONSTRAINT `company_student_feedback_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `company_student_feedback_chk_1` CHECK ((`technical_skills` between 1 and 5)),
  CONSTRAINT `company_student_feedback_chk_2` CHECK ((`soft_skills` between 1 and 5)),
  CONSTRAINT `company_student_feedback_chk_3` CHECK ((`punctuality` between 1 and 5)),
  CONSTRAINT `company_student_feedback_chk_4` CHECK ((`responsibility` between 1 and 5)),
  CONSTRAINT `company_student_feedback_chk_5` CHECK ((`teamwork` between 1 and 5)),
  CONSTRAINT `company_student_feedback_chk_6` CHECK ((`learning_ability` between 1 and 5)),
  CONSTRAINT `company_student_feedback_chk_7` CHECK ((`likelihood_to_hire` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `evaluations`;
CREATE TABLE `evaluations` (
  `evaluation_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `technical_score` int DEFAULT NULL,
  `communication_score` int DEFAULT NULL,
  `teamwork_score` int DEFAULT NULL,
  `punctuality_score` int DEFAULT NULL,
  `comments` text,
  PRIMARY KEY (`evaluation_id`),
  KEY `application_id` (`application_id`),
  CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE,
  CONSTRAINT `evaluations_chk_1` CHECK ((`technical_score` between 1 and 5)),
  CONSTRAINT `evaluations_chk_2` CHECK ((`communication_score` between 1 and 5)),
  CONSTRAINT `evaluations_chk_3` CHECK ((`teamwork_score` between 1 and 5)),
  CONSTRAINT `evaluations_chk_4` CHECK ((`punctuality_score` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `evaluations` (`evaluation_id`, `application_id`, `technical_score`, `communication_score`, `teamwork_score`, `punctuality_score`, `comments`) VALUES (2, 1, 5, 4, 4, 5, 'Good technical knowledge and communication skills. Demonstrates strong teamwork and punctuality.');

DROP TABLE IF EXISTS `faculty`;
CREATE TABLE `faculty` (
  `faculty_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`faculty_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `faculty_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `faculty` (`faculty_id`, `user_id`, `name`, `department`) VALUES (1, 2, 'Dr. Neha Kulkarni', 'Computer Science');

DROP TABLE IF EXISTS `faculty_feedback`;
CREATE TABLE `faculty_feedback` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `faculty_id` int NOT NULL,
  `suitability_rating` int NOT NULL,
  `learning_outcome_rating` int NOT NULL,
  `internship_quality_rating` int NOT NULL,
  `comments` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_id`),
  UNIQUE KEY `application_id` (`application_id`),
  KEY `faculty_id` (`faculty_id`),
  CONSTRAINT `faculty_feedback_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE,
  CONSTRAINT `faculty_feedback_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON DELETE CASCADE,
  CONSTRAINT `faculty_feedback_chk_1` CHECK ((`suitability_rating` between 1 and 5)),
  CONSTRAINT `faculty_feedback_chk_2` CHECK ((`learning_outcome_rating` between 1 and 5)),
  CONSTRAINT `faculty_feedback_chk_3` CHECK ((`internship_quality_rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `internship_id` int NOT NULL,
  `rating` int NOT NULL,
  `comments` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_id`),
  KEY `student_id` (`student_id`),
  KEY `internship_id` (`internship_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`internship_id`) ON DELETE CASCADE,
  CONSTRAINT `feedback_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `internship_feedback`;
CREATE TABLE `internship_feedback` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `student_id` int NOT NULL,
  `internship_id` int NOT NULL,
  `culture_rating` int NOT NULL,
  `mentorship_rating` int NOT NULL,
  `technical_learning_rating` int NOT NULL,
  `environment_rating` int NOT NULL,
  `overall_rating` int NOT NULL,
  `comments` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_id`),
  UNIQUE KEY `application_id` (`application_id`),
  KEY `student_id` (`student_id`),
  KEY `internship_id` (`internship_id`),
  CONSTRAINT `internship_feedback_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE,
  CONSTRAINT `internship_feedback_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `internship_feedback_ibfk_3` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`internship_id`) ON DELETE CASCADE,
  CONSTRAINT `internship_feedback_chk_1` CHECK ((`culture_rating` between 1 and 5)),
  CONSTRAINT `internship_feedback_chk_2` CHECK ((`mentorship_rating` between 1 and 5)),
  CONSTRAINT `internship_feedback_chk_3` CHECK ((`technical_learning_rating` between 1 and 5)),
  CONSTRAINT `internship_feedback_chk_4` CHECK ((`environment_rating` between 1 and 5)),
  CONSTRAINT `internship_feedback_chk_5` CHECK ((`overall_rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `internship_feedback` (`feedback_id`, `application_id`, `student_id`, `internship_id`, `culture_rating`, `mentorship_rating`, `technical_learning_rating`, `environment_rating`, `overall_rating`, `comments`, `created_at`) VALUES (1, 1, 1, 1, 5, 4, 4, 5, 4, 'NA', '2026-10-05 16:16:09');

DROP TABLE IF EXISTS `internship_skills`;
CREATE TABLE `internship_skills` (
  `internship_id` int NOT NULL,
  `skill_id` int NOT NULL,
  PRIMARY KEY (`internship_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `internship_skills_ibfk_1` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`internship_id`) ON DELETE CASCADE,
  CONSTRAINT `internship_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `internship_skills` (`internship_id`, `skill_id`) VALUES (1, 2);
INSERT INTO `internship_skills` (`internship_id`, `skill_id`) VALUES (2, 2);
INSERT INTO `internship_skills` (`internship_id`, `skill_id`) VALUES (3, 2);
INSERT INTO `internship_skills` (`internship_id`, `skill_id`) VALUES (1, 5);
INSERT INTO `internship_skills` (`internship_id`, `skill_id`) VALUES (2, 5);
INSERT INTO `internship_skills` (`internship_id`, `skill_id`) VALUES (2, 6);
INSERT INTO `internship_skills` (`internship_id`, `skill_id`) VALUES (3, 7);
INSERT INTO `internship_skills` (`internship_id`, `skill_id`) VALUES (3, 8);

DROP TABLE IF EXISTS `internships`;
CREATE TABLE `internships` (
  `internship_id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `posted_by` int DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `description` text,
  `domain` varchar(100) DEFAULT NULL,
  `duration_weeks` int DEFAULT NULL,
  `stipend` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `application_deadline` date DEFAULT NULL,
  `status` enum('pending','faculty_verified','approved','rejected','closed') DEFAULT 'pending',
  `apply_url` varchar(1000) DEFAULT NULL,
  `is_external` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`internship_id`),
  KEY `company_id` (`company_id`),
  KEY `posted_by` (`posted_by`),
  CONSTRAINT `internships_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`),
  CONSTRAINT `internships_ibfk_2` FOREIGN KEY (`posted_by`) REFERENCES `faculty` (`faculty_id`) ON DELETE SET NULL,
  CONSTRAINT `internships_chk_1` CHECK (((`duration_weeks` >= 4) and (`duration_weeks` <= 26)))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `internships` (`internship_id`, `company_id`, `posted_by`, `title`, `description`, `domain`, `duration_weeks`, `stipend`, `start_date`, `end_date`, `application_deadline`, `status`, `apply_url`, `is_external`) VALUES (1, 1, 1, 'Software Developer Intern', 'Work with the development team to build and maintain software applications.', 'Software Development', 12, '20000.00', '2026-10-31 18:30:00', '2027-01-23 18:30:00', '2026-10-17 18:30:00', 'approved', NULL, 0);
INSERT INTO `internships` (`internship_id`, `company_id`, `posted_by`, `title`, `description`, `domain`, `duration_weeks`, `stipend`, `start_date`, `end_date`, `application_deadline`, `status`, `apply_url`, `is_external`) VALUES (2, 2, NULL, 'Java Backend Developer Intern', 'Build backend services and APIs using Java and database technologies.', 'Backend Development', 16, '25000.00', '2026-11-09 18:30:00', '2027-03-01 18:30:00', '2026-10-24 18:30:00', 'approved', NULL, 0);
INSERT INTO `internships` (`internship_id`, `company_id`, `posted_by`, `title`, `description`, `domain`, `duration_weeks`, `stipend`, `start_date`, `end_date`, `application_deadline`, `status`, `apply_url`, `is_external`) VALUES (3, 3, NULL, 'Data Analytics Intern', 'Analyze datasets and create meaningful business insights.', 'Data Analytics', 12, '18000.00', '2026-11-04 18:30:00', '2027-01-27 18:30:00', '2026-10-21 18:30:00', 'approved', NULL, 0);
INSERT INTO `internships` (`internship_id`, `company_id`, `posted_by`, `title`, `description`, `domain`, `duration_weeks`, `stipend`, `start_date`, `end_date`, `application_deadline`, `status`, `apply_url`, `is_external`) VALUES (7, 1, 1, 'Java Backend Developer Intern', 'Students will work on Java backend development, REST API development,
database integration and SQL. The internship will provide practical
experience in developing backend applications and working with
software development tools and technologies.', 'Backend Development', 12, '15000.00', '2026-10-24 18:30:00', '2027-01-16 18:30:00', '2026-10-19 18:30:00', 'approved', NULL, 0);
INSERT INTO `internships` (`internship_id`, `company_id`, `posted_by`, `title`, `description`, `domain`, `duration_weeks`, `stipend`, `start_date`, `end_date`, `application_deadline`, `status`, `apply_url`, `is_external`) VALUES (8, 3, 1, 'Python dev', 'python,numpy', 'developement', 8, '10000.00', '2026-10-31 18:30:00', '2026-11-30 18:30:00', '2026-10-19 18:30:00', 'faculty_verified', NULL, 0);
INSERT INTO `internships` (`internship_id`, `company_id`, `posted_by`, `title`, `description`, `domain`, `duration_weeks`, `stipend`, `start_date`, `end_date`, `application_deadline`, `status`, `apply_url`, `is_external`) VALUES (9, 7, 1, 'Python dev2', 'python', 'developement', 4, '10000.00', '2026-10-14 18:30:00', '2026-10-21 18:30:00', '2026-10-13 18:30:00', 'rejected', NULL, 0);

DROP TABLE IF EXISTS `interviews`;
CREATE TABLE `interviews` (
  `interview_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `interview_date` date DEFAULT NULL,
  `interview_time` time DEFAULT NULL,
  `interviewer_name` varchar(100) DEFAULT NULL,
  `result` varchar(100) DEFAULT NULL,
  `feedback` text,
  PRIMARY KEY (`interview_id`),
  KEY `application_id` (`application_id`),
  CONSTRAINT `interviews_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `interviews` (`interview_id`, `application_id`, `interview_date`, `interview_time`, `interviewer_name`, `result`, `feedback`) VALUES (2, 5, '2026-10-17 18:30:00', '10:00:00', 'Dr. Neha Kulkarni', NULL, NULL);
INSERT INTO `interviews` (`interview_id`, `application_id`, `interview_date`, `interview_time`, `interviewer_name`, `result`, `feedback`) VALUES (3, 1, '2026-10-17 18:30:00', '10:00:00', 'Dr. Neha Kulkarni', NULL, NULL);

DROP TABLE IF EXISTS `skills`;
CREATE TABLE `skills` (
  `skill_id` int NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(100) NOT NULL,
  PRIMARY KEY (`skill_id`),
  UNIQUE KEY `skill_name` (`skill_name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `skills` (`skill_id`, `skill_name`) VALUES (8, 'Data Analysis');
INSERT INTO `skills` (`skill_id`, `skill_name`) VALUES (7, 'Python');
INSERT INTO `skills` (`skill_id`, `skill_name`) VALUES (6, 'REST API');
INSERT INTO `skills` (`skill_id`, `skill_name`) VALUES (5, 'Spring Boot');
INSERT INTO `skills` (`skill_id`, `skill_name`) VALUES (2, 'SQL');

DROP TABLE IF EXISTS `student_skills`;
CREATE TABLE `student_skills` (
  `student_id` int NOT NULL,
  `skill_id` int NOT NULL,
  PRIMARY KEY (`student_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `student_skills_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `student_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `student_skills` (`student_id`, `skill_id`) VALUES (1, 2);

DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `gpa` decimal(3,2) DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `students_chk_1` CHECK (((`gpa` >= 0.0) and (`gpa` <= 4.0)))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `students` (`student_id`, `user_id`, `name`, `phone`, `department`, `gpa`, `resume`) VALUES (1, 1, 'Aarav Sharma', '9876543210', 'Computer Science', '3.60', '/uploads/resumes/1791140739465-838861697.pdf');
INSERT INTO `students` (`student_id`, `user_id`, `name`, `phone`, `department`, `gpa`, `resume`) VALUES (2, 5, 'Samruddhi Wagh', '9284899060', 'Computer Science', '3.59', NULL);

DROP TABLE IF EXISTS `system_feedback`;
CREATE TABLE `system_feedback` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `feedback_type` enum('suggestion','bug','improvement') NOT NULL,
  `message` text NOT NULL,
  `status` enum('pending','reviewed','resolved') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `system_feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','faculty','admin') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`user_id`, `email`, `password`, `role`, `created_at`) VALUES (1, 'student1@gmail.com', 'Student@123', 'student', '2026-10-03 14:45:25');
INSERT INTO `users` (`user_id`, `email`, `password`, `role`, `created_at`) VALUES (2, 'faculty@student2career.com', 'Faculty@123', 'faculty', '2026-10-04 08:36:51');
INSERT INTO `users` (`user_id`, `email`, `password`, `role`, `created_at`) VALUES (3, 'admin@student2career.com', 'Admin@123', 'admin', '2026-10-04 08:36:51');
INSERT INTO `users` (`user_id`, `email`, `password`, `role`, `created_at`) VALUES (5, 'samruddhi.wagh24@sanjivani.edu.in', '12345678', 'student', '2026-10-13 06:41:03');

