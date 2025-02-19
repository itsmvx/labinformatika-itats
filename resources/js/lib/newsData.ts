export const newsArticles = [
    {
        id: 1,
        title: "New Advanced Teaching Techniques Workshop Announced",
        date: "2025-02-10",
        description:
            "Join us for a two-day intensive workshop on the latest teaching methodologies and classroom technologies.",
        content:
            "We are excited to announce our upcoming Advanced Teaching Techniques Workshop, scheduled for March 15-16, 2025. This intensive two-day program is designed to equip lecturers with cutting-edge teaching methodologies and introduce them to the latest classroom technologies.\n\nTopics covered will include:\n- Adaptive learning strategies\n- Integrating AI in education\n- Effective use of virtual and augmented reality in teaching\n- Designing engaging online and hybrid courses\n\nThe workshop will be led by renowned education expert Dr. Emily Carter and will feature guest speakers from leading EdTech companies. Participants will receive a certificate of completion and access to exclusive online resources.\n\nDon't miss this opportunity to revolutionize your teaching approach and enhance your students' learning experience. Space is limited, so register early to secure your spot!",
    },
    {
        id: 2,
        title: "Lecturer Academy Receives Excellence in Education Award",
        date: "2025-02-05",
        description:
            "Our institution has been recognized for its outstanding contribution to higher education and innovative teaching practices.",
        content:
            "We are proud to announce that Lecturer Academy has been awarded the prestigious Excellence in Education Award by the National Board of Higher Education. This recognition is a testament to our unwavering commitment to innovative teaching practices and our significant contributions to the field of higher education.\n\nThe award committee highlighted several key factors that led to this honor:\n1. Our pioneering work in integrating technology into traditional teaching methods\n2. The success of our mentorship program for new lecturers\n3. Our ongoing research into effective learning strategies\n4. The high satisfaction rates among both students and faculty\n\nThis award not only celebrates our past achievements but also motivates us to continue pushing the boundaries of educational excellence. We extend our heartfelt gratitude to all our dedicated faculty, staff, and students who have made this achievement possible.\n\nAs we move forward, we remain committed to our mission of providing world-class education and fostering an environment of continuous learning and innovation.",
    },
    {
        id: 3,
        title: "Summer Research Grants Now Available for Faculty",
        date: "2025-01-28",
        description:
            "Applications are now open for our annual summer research grants. Don't miss this opportunity to further your academic pursuits.",
        content:
            "We are pleased to announce that applications are now open for the Lecturer Academy Summer Research Grants program. This annual initiative aims to support our faculty in pursuing innovative research projects during the summer months.\n\nKey details of the program:\n- Grant amounts range from $5,000 to $20,000\n- Research period: June 1 to August 31, 2025\n- Open to all full-time faculty members\n- Priority given to interdisciplinary projects and those involving student researchers\n\nApplication process:\n1. Submit a detailed research proposal (max. 5 pages)\n2. Provide a budget breakdown\n3. Include a CV and list of recent publications\n4. Deadline for submissions: March 31, 2025\n\nSuccessful applicants will be notified by April 30, 2025. Grant recipients are expected to present their research findings at the annual Faculty Research Symposium in September.\n\nThis is an excellent opportunity to advance your academic pursuits, contribute to your field, and enhance the research profile of Lecturer Academy. We encourage all eligible faculty members to apply and look forward to supporting groundbreaking research initiatives.",
    },
    {
        id: 4,
        title: "Upcoming Guest Lecture Series: 'The Future of Online Learning'",
        date: "2025-01-20",
        description:
            "We're excited to host a series of guest lectures exploring the evolving landscape of online and hybrid learning environments.",
        content:
            "Lecturer Academy is thrilled to announce our upcoming guest lecture series titled 'The Future of Online Learning'. This series will bring together leading experts in educational technology and online pedagogy to explore the rapidly evolving landscape of digital and hybrid learning environments.\n\nSchedule:\n1. February 5, 2025: 'AI-Powered Personalized Learning' by Dr. Sarah Chen, Chief AI Officer at EduTech Innovations\n2. February 12, 2025: 'Creating Engaging Virtual Classrooms' by Prof. Michael Roberts, Virtual Reality in Education Specialist\n3. February 19, 2025: 'Data Analytics in Online Education' by Lisa Thompson, Head of Analytics at Global Online University\n4. February 26, 2025: 'The Role of Social Learning in Online Environments' by Dr. James Wilson, Author of 'Connected Learning in the Digital Age'\n\nAll lectures will be held from 3:00 PM to 4:30 PM in the Main Auditorium and will also be livestreamed for remote attendance. Each session will include a Q&A segment, allowing attendees to engage directly with our guest speakers.\n\nThis lecture series is open to all faculty, staff, and students. It presents a unique opportunity to gain insights into the future of education and how we can prepare for the challenges and opportunities ahead.\n\nDon't miss this chance to be at the forefront of educational innovation. Mark your calendars and join us for these enlightening sessions!",
    },
]

export function getArticleById(id: number) {
    return newsArticles.find((article) => article.id === id)
}

