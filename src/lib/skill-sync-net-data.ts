
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

export const freelanceNiches = {
    "Writing & Content Creation": ["Blog Writing", "Copywriting", "Technical Writing", "SEO Writing", "Content Strategy", "Ghostwriting", "Grant Writing", "Scriptwriting", "Editing & Proofreading", "Social Media Content Creation", "Press Release Writing", "UX Writing", "Creative Writing", "Resume & Cover Letter Writing", "Newsletter Writing", "Product Description Writing"],
    "Design & Creative": ["Graphic Design", "UI/UX Design", "Web Design", "Illustration", "Animation", "Video Editing", "Photography", "Photo Editing/Retouching", "3D Modeling & Rendering", "Game Art Design", "Presentation Design", "Packaging Design", "Infographic Design", "Book Cover Design", "Fashion Design", "Interior Design"],
    "Development & IT": ["Web Development (frontend, backend, full-stack)", "Mobile App Development", "Software Development", "Game Development", "WordPress Development", "Shopify Development", "E-commerce Platform Development", "Database Management", "API Integration", "DevOps & Cloud Computing", "Cybersecurity Consulting", "Blockchain Development", "AI/ML Model Development", "Chatbot Development", "IT Support & Network Administration", "SaaS Product Development"],
    "Marketing & Advertising": ["Digital Marketing Strategy", "SEO", "SEM", "Social Media Marketing", "Email Marketing", "Content Marketing", "Affiliate Marketing", "Influencer Marketing", "PPC Campaign Management", "Marketing Analytics", "Brand Strategy", "Market Research", "Public Relations", "Crowdfunding Campaign Management", "Conversion Rate Optimization (CRO)"],
    "Business & Consulting": ["Business Plan Writing", "Financial Consulting", "Bookkeeping & Accounting", "Tax Preparation", "Management Consulting", "HR Consulting", "Project Management", "Operations Consulting", "Startup Consulting", "Virtual CFO Services", "Fundraising Consulting", "Risk Management Consulting", "Supply Chain Consulting", "CRM Setup", "E-commerce Business Consulting"],
    "Admin & Customer Support": ["Virtual Assistance", "Data Entry", "Customer Service", "Technical Support", "Order Processing", "Calendar Management", "Email Management", "Transcription", "Appointment Setting", "Research Assistance", "CRM Data Management", "Community Management"],
    "Sales & Lead Generation": ["Lead Generation", "Cold Calling", "Email Outreach", "Sales Funnel Creation", "B2B Sales Consulting", "LinkedIn Lead Generation", "Telesales", "Customer Retention Strategy", "Sales Copywriting"],
    "Education & Training": ["Online Tutoring", "Course Creation", "Instructional Design", "Corporate Training", "Life Coaching", "Career Coaching", "Test Prep Coaching", "Public Speaking Coaching", "Skill Workshop Facilitation", "Language Instruction", "Music Instruction", "Fitness Coaching"],
    "Audio & Music": ["Voiceover Acting", "Audio Editing & Mixing", "Podcast Production", "Music Composition", "Sound Design", "Audio Restoration", "Jingles & Ad Music Production", "Voice Synthesis & AI Voice Creation", "DJ Services"],
    "Translation & Localization": ["Document Translation", "Website Localization", "Software Localization", "Subtitling & Captioning", "Technical Translation", "Medical Translation", "Legal Translation", "Literary Translation", "Multilingual SEO"],
    "Legal & Compliance": ["Contract Drafting", "Legal Research", "Paralegal Services", "Intellectual Property Consulting", "Compliance Consulting", "GDPR/Data Privacy Consulting", "Immigration Consulting"],
    "Engineering & Architecture": ["CAD Design", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Structural Engineering", "Architectural Design", "Product Design", "Industrial Design", "Prototyping & 3D Printing"],
    "Science & Research": ["Data Analysis", "Statistical Analysis", "Scientific Writing", "Research Paper Editing", "Grant Research", "Qualitative Research", "Quantitative Research", "Bioinformatics Consulting", "Environmental Consulting"],
    "Healthcare & Wellness": ["Telehealth Consulting", "Medical Writing", "Health Coaching", "Nutrition Consulting", "Mental Health Coaching", "Wellness Program Design", "Medical Billing & Coding", "Healthcare Marketing"],
    "Event & Entertainment": ["Event Planning", "Virtual Event Management", "Wedding Planning", "Entertainment Booking", "Stage Design", "Live Streaming Setup", "Virtual Reality Event Production"],
    "Gaming & Esports": ["Game Testing", "Esports Coaching", "Game Streaming Setup", "Game Content Creation", "Esports Event Management", "Game Modding"],
    "AI & Emerging Tech": ["AI Prompt Engineering", "Machine Learning Consulting", "Data Annotation & Labeling", "AI Ethics Consulting", "AR/VR Development", "IoT Consulting", "Metaverse Content Creation"],
    "Miscellaneous": ["Voice Acting for AI/Apps", "Astrology/Tarot Services", "Personal Styling", "Travel Planning", "Genealogy Research", "Virtual Tour Creation", "NFT Creation & Consulting", "Podcast Guest Booking"],
};
export type FreelanceNiche = keyof typeof freelanceNiches;
