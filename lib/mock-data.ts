import type { Job } from "./types"

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Experienced web designer needed for B2B business redesign",
    companyId: "1",
    description:
      "We are looking for a skilled professional to join our team full-time. Your responsibilities will include building, editing, and managing our website, creating engaging PowerPoint presentations.",
    location: "Remote",
    locationType: "Remote",
    jobType: "Freelance",
    opportunityType: "Job",
    experienceLevel: "Intermediate",
    deadline: "2024-02-15",
    applicants: 120,
    postedDate: new Date("2024-01-15"),
    featured: true,
    applicationLink: "https://plusai.com/careers/apply",
  },
  {
    id: "2",
    title: "Senior product designer / UI/UX designer",
    companyId: "2",
    description:
      "We are seeking a talented and experienced Senior Product Designer / UI/UX Designer to join our team at Anyday Design This role involves working independently on the design of web applications.",
    location: "Remote",
    locationType: "Remote",
    jobType: "Freelance",
    opportunityType: "Job",
    experienceLevel: "Expert",
    deadline: "2024-02-20",
    applicants: 24,
    postedDate: new Date("2024-01-14"),
    applicationLink: "https://apollo.io/careers/senior-designer",
  },
  {
    id: "3",
    title: "Frontend Developer Internship",
    companyId: "3",
    description:
      "Looking for an enthusiastic intern to learn and build a modern SaaS dashboard using React and TypeScript. Great opportunity for students or recent graduates.",
    location: "United States",
    locationType: "Remote",
    jobType: "Part-time",
    opportunityType: "Internship",
    experienceLevel: "Entry level",
    applicants: 45,
    postedDate: new Date("2024-01-13"),
    applicationLink: "mailto:jobs@techflow.com?subject=Frontend Developer Application",
  },
  {
    id: "4",
    title: "Design Scholarship Program 2024",
    companyId: "4",
    description:
      "Full scholarship program for aspiring designers. Includes mentorship, design tools, and portfolio development. No prior experience required.",
    location: "London, UK",
    locationType: "Hybrid",
    jobType: "Part-time",
    opportunityType: "Scholarship",
    experienceLevel: "Entry level",
    deadline: "2024-03-01",
    applicants: 67,
    postedDate: new Date("2024-01-12"),
    applicationLink: "https://designhub.io/apply/mobile-designer",
  },
  {
    id: "5",
    title: "Full Stack Developer - E-commerce Platform",
    companyId: "5",
    description:
      "Seeking a full stack developer to build and maintain our e-commerce platform. Must have experience with payment integrations and database management.",
    location: "Remote",
    locationType: "Remote",
    jobType: "Full-time",
    opportunityType: "Job",
    experienceLevel: "Expert",
    applicants: 89,
    postedDate: new Date("2024-01-11"),
    applicationLink: "https://shoptech.com/careers/fullstack-developer",
  },
  {
    id: "6",
    title: "Software Engineering Internship Program",
    companyId: "6",
    description:
      "6-month paid internship program for computer science students. Work on real projects, learn from senior engineers, and gain industry experience.",
    location: "Remote",
    locationType: "Remote",
    jobType: "Full-time",
    opportunityType: "Internship",
    experienceLevel: "Entry level",
    deadline: "2024-02-28",
    applicants: 156,
    postedDate: new Date("2024-01-10"),
    applicationLink: "mailto:hiring@contentpro.com?subject=Content Writer Application",
  },
]

export const experienceLevels = ["Entry level", "Intermediate", "Expert"]

export const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance"]

export const opportunityTypes = ["Job", "Internship", "Scholarship", "Education"]
