
export const requirementCategories = {
    "Project & Scope": {
        "Project Type": ["One-time task", "Short-term project", "Long-term engagement", "Full-time contract", "Consultation"],
        "Project Scale": ["Small (Individual Contributor)", "Medium (Small Team Collaboration)", "Large (Complex, Multi-team)"],
        "Deliverables": ["Strategy/Plan", "Creative Assets (e.g., designs, content)", "Code/Software", "Analysis & Reports", "Hands-on Implementation"],
    },
    "Experience Level & Seniority": {
        "Seniority": ["Entry-Level/Junior", "Mid-Level", "Senior", "Expert/Lead"],
        "Key Attributes": ["Strategic Thinker", "Technical Specialist", "Creative Visionary", "Project Manager", "Data-driven"],
        "Tool Proficiency": ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
    "Collaboration & Communication": {
        "Working Style": ["Independent/Autonomous", "Highly Collaborative", "Agile/Scrum", "Asynchronous"],
        "Communication": ["Daily Check-ins", "Weekly Syncs", "Prefers Written Updates", "Client-facing"],
        "Team Structure": ["Works directly with client", "Integrates with an existing team", "Leads a team"],
    },
    "Industry & Domain": {
        "Industry Experience": ["Tech/SaaS", "Creative/Media", "Business/Finance", "Healthcare/Science", "Education", "E-commerce/Retail", "Legal/Compliance"],
        "Company Size": ["Startup (1-50)", "Scale-up (51-500)", "Enterprise (500+)", "Non-profit"],
        "Target Audience": ["B2B", "B2C", "Internal", "Specialized/Niche"],
    },
    "Soft Skills & Professionalism": {
        "Pace & Urgency": ["Fast-paced, deadline-driven", "Steady and planned", "Flexible and iterative"],
        "Attention to Detail": ["Pixel-perfect precision", "High-level concepts", "Balanced approach"],
        "Problem Solving": ["Requires strong analytical skills", "Needs creative problem-solving", "Prefers structured guidance"],
    }
};

export type ReqCategory = keyof typeof requirementCategories;

export type FreelanceNiche = 
    | "Writing & Content Creation"
    | "Design & Creative"
    | "Development & IT"
    | "Marketing & Advertising"
    | "Business & Consulting"
    | "Admin & Customer Support"
    | "Sales & Lead Generation"
    | "Education & Training"
    | "Audio & Music"
    | "Translation & Localization"
    | "Legal & Compliance"
    | "Engineering & Architecture"
    | "Science & Research"
    | "Healthcare & Wellness"
    | "Event & Entertainment"
    | "Gaming & Esports"
    | "AI & Emerging Tech"
    | "Miscellaneous";
