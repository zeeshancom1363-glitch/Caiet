// ============================================
// FILE: seed.js
// WHAT IT DOES: Fills the database with sample data
// so the website looks alive immediately after setup.
// Creates: admin account, site settings, courses,
// instructors, team members, services, blogs, FAQs,
// sample applications, email templates, and activity logs.
//
// HOW TO RUN: npx prisma db seed
// ============================================
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Checking if database requires seeding...\n');

    // If an admin user already exists, assume the database is already seeded
    const existingAdmins = await prisma.adminUser.count();
    if (existingAdmins > 0) {
        console.log('✅ Database is already seeded. Skipping seed execution.');
        return;
    }

    console.log('🌱 Database is empty. Seeding database...\n');

    // ===== 1. ADMIN USER =====
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.adminUser.upsert({
        where: { email: 'admin@caiet.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'admin@caiet.com',
            password: hashedPassword,
            role: 'superadmin',
        },
    });
    console.log('✅ Admin user created');

    // ===== 2. SITE SETTINGS (singleton) =====
    await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            siteName: 'CAI&ET',
            tagline: 'Center for AI & Emerging Technologies',
            email: 'info@caiet.com',
            phone: '+92 300 1234567',
            whatsappNumber: '+92 300 1234567',
            address: '123 Tech Avenue, Innovation District, Lahore, Pakistan',
            facebookUrl: 'https://facebook.com/caiet',
            instagramUrl: 'https://instagram.com/caiet',
            linkedinUrl: 'https://linkedin.com/company/caiet',
            youtubeUrl: 'https://youtube.com/@caiet',
            footerAboutText: 'CAI&ET is a premier technology academy dedicated to empowering the next generation of tech leaders through cutting-edge AI and emerging technology education.',
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3403.0!2d74.35!3d31.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sen!2s!4v1',
        },
    });
    console.log('✅ Site settings created');

    // ===== 3. BANNER SETTINGS (singleton) =====
    await prisma.bannerSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            mainText: 'ADMISSIONS OPEN FOR 2025!',
            highlightText: '50% OFF – Limited Time!',
            linkUrl: '/apply',
            isActive: true,
        },
    });
    console.log('✅ Banner settings created');

    // ===== 4. ABOUT SECTION (singleton) =====
    await prisma.aboutSection.upsert({
        where: { id: 1 },
        update: {},
        create: {
            heading: 'About CAI&ET',
            description: 'The Center for AI & Emerging Technologies (CAI&ET) is a forward-thinking academy established to bridge the gap between traditional education and the rapidly evolving technology landscape. Our mission is to equip students, professionals, and organizations with the skills and knowledge needed to thrive in the age of artificial intelligence, machine learning, data science, and modern software development.\n\nFounded by a team of passionate technologists and educators, CAI&ET delivers hands-on, project-based training that goes beyond theory. Our curriculum is designed in collaboration with industry experts to ensure that every graduate is job-ready from day one.',
            image: null,
            missionText: 'To democratize access to world-class technology education and empower individuals with the skills needed to lead innovation in the AI era.',
            visionText: 'To become the leading center for AI and emerging technology education in South Asia, producing a new generation of tech leaders who drive positive change.',
            yearsExperience: 5,
            studentsCount: 2500,
            coursesCount: 25,
            instructorsCount: 15,
        },
    });
    console.log('✅ About section created');

    // ===== 5. COURSE CATEGORIES =====
    const categories = await Promise.all([
        prisma.courseCategory.create({
            data: { name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Master AI, ML, and deep learning technologies', iconName: 'Brain', displayOrder: 1 },
        }),
        prisma.courseCategory.create({
            data: { name: 'Web Development', slug: 'web-development', description: 'Build modern full-stack web applications', iconName: 'Globe', displayOrder: 2 },
        }),
        prisma.courseCategory.create({
            data: { name: 'App Development', slug: 'app-development', description: 'Create cross-platform mobile applications', iconName: 'Smartphone', displayOrder: 3 },
        }),
        prisma.courseCategory.create({
            data: { name: 'Data Science', slug: 'data-science', description: 'Analyze data and extract actionable insights', iconName: 'BarChart3', displayOrder: 4 },
        }),
    ]);
    console.log('✅ Course categories created');

    // ===== 6. INSTRUCTORS =====
    const instructors = await Promise.all([
        prisma.instructor.create({
            data: {
                fullName: 'Muhammad Umair Khan', designation: 'AI Instructor',
                bio: 'Muhammad Umair Khan is a seasoned AI researcher and instructor with 7+ years of experience in machine learning, deep learning, and computer vision. He has trained over 500 students and led multiple industry AI projects.',
                expertiseTags: 'Machine Learning,Deep Learning,Computer Vision,NLP',
                linkedinUrl: 'https://linkedin.com/in/umair-khan', displayOrder: 1, isActive: true,
            },
        }),
        prisma.instructor.create({
            data: {
                fullName: 'Sarah Ahmed', designation: 'Full Stack Developer',
                bio: 'Sarah Ahmed is a full-stack developer with expertise in React, Node.js, and cloud technologies. She brings 5 years of industry experience from leading tech companies and is passionate about making web development accessible to everyone.',
                expertiseTags: 'React,Node.js,JavaScript,AWS,MongoDB',
                linkedinUrl: 'https://linkedin.com/in/sarah-ahmed', displayOrder: 2, isActive: true,
            },
        }),
        prisma.instructor.create({
            data: {
                fullName: 'Ali Hassan', designation: 'Mobile App Expert',
                bio: 'Ali Hassan specializes in cross-platform mobile development using Flutter and React Native. With experience building 20+ production apps, he guides students through real-world app development challenges.',
                expertiseTags: 'Flutter,React Native,Dart,Firebase,iOS,Android',
                linkedinUrl: 'https://linkedin.com/in/ali-hassan', displayOrder: 3, isActive: true,
            },
        }),
        prisma.instructor.create({
            data: {
                fullName: 'Dr. Fatima Zahra', designation: 'Data Science Lead',
                bio: 'Dr. Fatima Zahra holds a PhD in Data Science and has published numerous research papers on predictive analytics. She combines academic rigor with practical industry experience to deliver world-class data science education.',
                expertiseTags: 'Python,R,SQL,Tableau,Power BI,Statistics',
                linkedinUrl: 'https://linkedin.com/in/fatima-zahra', displayOrder: 4, isActive: true,
            },
        }),
    ]);
    console.log('✅ Instructors created');

    // ===== 7. COURSES =====
    const courses = await Promise.all([
        prisma.course.create({
            data: {
                title: 'Machine Learning Fundamentals', slug: 'machine-learning-fundamentals',
                categoryId: categories[0].id, instructorId: instructors[0].id,
                shortDescription: 'Master the foundations of machine learning with hands-on projects and real-world datasets.',
                fullDescription: 'This comprehensive course covers everything from basic statistics to advanced ML algorithms. You will learn supervised and unsupervised learning, model evaluation, feature engineering, and deployment strategies. By the end, you will have built 5 complete ML projects for your portfolio.',
                price: 45000, discountPrice: 22500, durationText: '3 Months',
                level: 'Intermediate',
                syllabus: 'Module 1: Python for Data Science\nModule 2: Statistics & Probability\nModule 3: Supervised Learning (Regression & Classification)\nModule 4: Unsupervised Learning (Clustering & Dimensionality Reduction)\nModule 5: Model Evaluation & Tuning\nModule 6: Feature Engineering\nModule 7: Ensemble Methods\nModule 8: Neural Networks Basics\nModule 9: ML Pipeline & Deployment\nModule 10: Capstone Project',
                totalSeats: 30, startDate: '2025-03-01', isFeatured: true, isActive: true,
            },
        }),
        prisma.course.create({
            data: {
                title: 'Deep Learning & Neural Networks', slug: 'deep-learning-neural-networks',
                categoryId: categories[0].id, instructorId: instructors[0].id,
                shortDescription: 'Dive deep into neural networks, CNNs, RNNs, and transformers with TensorFlow and PyTorch.',
                fullDescription: 'An advanced course designed for students who want to specialize in deep learning. Covers convolutional neural networks, recurrent neural networks, GANs, transformers, and more. Hands-on labs with TensorFlow and PyTorch.',
                price: 55000, discountPrice: 27500, durationText: '4 Months',
                level: 'Advanced',
                syllabus: 'Module 1: Deep Learning Foundations\nModule 2: Convolutional Neural Networks (CNNs)\nModule 3: Image Classification & Object Detection\nModule 4: Recurrent Neural Networks (RNNs & LSTMs)\nModule 5: Natural Language Processing\nModule 6: Generative Adversarial Networks (GANs)\nModule 7: Transformers & Attention Mechanisms\nModule 8: Transfer Learning\nModule 9: Model Optimization\nModule 10: Production Deployment',
                totalSeats: 25, startDate: '2025-04-01', isFeatured: true, isActive: true,
            },
        }),
        prisma.course.create({
            data: {
                title: 'Full Stack Web Development', slug: 'full-stack-web-development',
                categoryId: categories[1].id, instructorId: instructors[1].id,
                shortDescription: 'Build complete web applications from scratch using React, Node.js, and modern databases.',
                fullDescription: 'Become a full-stack developer in 4 months! Learn HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB. Build real projects including an e-commerce site, social media app, and portfolio website.',
                price: 40000, discountPrice: 20000, durationText: '4 Months',
                level: 'Beginner',
                syllabus: 'Module 1: HTML5 & CSS3 Fundamentals\nModule 2: JavaScript Essentials\nModule 3: Advanced JavaScript & ES6+\nModule 4: React.js Fundamentals\nModule 5: React Router & State Management\nModule 6: Node.js & Express.js\nModule 7: MongoDB & Mongoose\nModule 8: REST API Design\nModule 9: Authentication & Authorization\nModule 10: Deployment & DevOps Basics',
                totalSeats: 40, startDate: '2025-02-15', isFeatured: true, isActive: true,
            },
        }),
        prisma.course.create({
            data: {
                title: 'React & Next.js Masterclass', slug: 'react-nextjs-masterclass',
                categoryId: categories[1].id, instructorId: instructors[1].id,
                shortDescription: 'Advanced React patterns and server-side rendering with Next.js for production apps.',
                fullDescription: 'Take your React skills to the next level. Learn advanced hooks, context API, Redux Toolkit, Next.js server-side rendering, API routes, and deployment on Vercel.',
                price: 35000, discountPrice: null, durationText: '2 Months',
                level: 'Intermediate',
                syllabus: 'Module 1: Advanced React Patterns\nModule 2: Custom Hooks & Performance\nModule 3: State Management with Redux Toolkit\nModule 4: Next.js Fundamentals\nModule 5: Server-Side Rendering & ISR\nModule 6: API Routes & Middleware\nModule 7: Authentication in Next.js\nModule 8: Deployment & CI/CD',
                totalSeats: 25, startDate: '2025-03-15', isFeatured: false, isActive: true,
            },
        }),
        prisma.course.create({
            data: {
                title: 'Flutter App Development', slug: 'flutter-app-development',
                categoryId: categories[2].id, instructorId: instructors[2].id,
                shortDescription: 'Build beautiful cross-platform mobile apps with Flutter and Dart.',
                fullDescription: 'Learn to build stunning, natively compiled applications for mobile, web, and desktop from a single codebase. Master Dart, Flutter widgets, state management, Firebase integration, and app store deployment.',
                price: 42000, discountPrice: 21000, durationText: '3 Months',
                level: 'Beginner',
                syllabus: 'Module 1: Dart Programming Language\nModule 2: Flutter Basics & Widgets\nModule 3: Layouts & Navigation\nModule 4: State Management (Provider & Riverpod)\nModule 5: API Integration\nModule 6: Firebase (Auth, Firestore, Storage)\nModule 7: Local Storage & SQLite\nModule 8: Animations & Custom Widgets\nModule 9: Testing & Debugging\nModule 10: App Store Deployment',
                totalSeats: 35, startDate: '2025-02-20', isFeatured: true, isActive: true,
            },
        }),
        prisma.course.create({
            data: {
                title: 'React Native Mobile Development', slug: 'react-native-mobile-development',
                categoryId: categories[2].id, instructorId: instructors[2].id,
                shortDescription: 'Create native mobile apps for iOS and Android using React Native and JavaScript.',
                fullDescription: 'For JavaScript developers who want to build mobile apps. Learn React Native, Expo, navigation, native modules, and play store publishing.',
                price: 38000, discountPrice: null, durationText: '3 Months',
                level: 'Intermediate',
                syllabus: 'Module 1: React Native & Expo Setup\nModule 2: Core Components & Styling\nModule 3: Navigation with React Navigation\nModule 4: API Integration & Networking\nModule 5: State Management\nModule 6: Native Modules & Device APIs\nModule 7: Push Notifications\nModule 8: Deployment to App/Play Store',
                totalSeats: 30, startDate: '2025-04-10', isFeatured: false, isActive: true,
            },
        }),
        prisma.course.create({
            data: {
                title: 'Data Analysis with Python', slug: 'data-analysis-with-python',
                categoryId: categories[3].id, instructorId: instructors[3].id,
                shortDescription: 'Learn data analysis, visualization, and storytelling using Python, Pandas, and Matplotlib.',
                fullDescription: 'Transform raw data into actionable insights. This course covers Python programming, Pandas, NumPy, data cleaning, exploratory analysis, and beautiful visualizations with Matplotlib and Seaborn.',
                price: 30000, discountPrice: 15000, durationText: '2 Months',
                level: 'Beginner',
                syllabus: 'Module 1: Python Basics\nModule 2: NumPy for Numerical Computing\nModule 3: Pandas for Data Manipulation\nModule 4: Data Cleaning & Preprocessing\nModule 5: Exploratory Data Analysis\nModule 6: Data Visualization (Matplotlib & Seaborn)\nModule 7: Statistical Analysis\nModule 8: Capstone: Real-World Dataset Analysis',
                totalSeats: 35, startDate: '2025-03-05', isFeatured: true, isActive: true,
            },
        }),
        prisma.course.create({
            data: {
                title: 'Power BI & Business Intelligence', slug: 'power-bi-business-intelligence',
                categoryId: categories[3].id, instructorId: instructors[3].id,
                shortDescription: 'Master Power BI to create stunning dashboards and drive data-driven business decisions.',
                fullDescription: 'Become a business intelligence professional. Learn Power BI Desktop, DAX formulas, data modeling, interactive dashboards, and Power BI Service for publishing.',
                price: 25000, discountPrice: null, durationText: '6 Weeks',
                level: 'Beginner',
                syllabus: 'Module 1: Introduction to BI & Power BI\nModule 2: Data Import & Transformation\nModule 3: Data Modeling & Relationships\nModule 4: DAX Formulas\nModule 5: Visualizations & Charts\nModule 6: Interactive Dashboards\nModule 7: Publishing & Sharing\nModule 8: Real-World BI Project',
                totalSeats: 40, startDate: '2025-03-20', isFeatured: false, isActive: true,
            },
        }),
    ]);
    console.log('✅ Courses created');

    // ===== 8. TEAM MEMBERS =====
    await Promise.all([
        prisma.teamMember.create({
            data: {
                fullName: 'Azhar Iqbal', designation: 'CEO & Co-Founder',
                bio: 'Visionary leader with 15+ years in tech education. Azhar founded CAI&ET to make world-class tech education accessible to everyone in Pakistan.',
                linkedinUrl: 'https://linkedin.com/in/azhar-iqbal', facebookUrl: 'https://facebook.com/azhar.iqbal',
                displayOrder: 1, isActive: true,
            },
        }),
        prisma.teamMember.create({
            data: {
                fullName: 'Muhammad Umair Khan', designation: 'CTO & Co-Founder',
                bio: 'Tech innovator and AI specialist. Umair leads the technical direction of CAI&ET, ensuring our curriculum stays at the cutting edge of technology.',
                linkedinUrl: 'https://linkedin.com/in/umair-khan', facebookUrl: 'https://facebook.com/umair.khan',
                displayOrder: 2, isActive: true,
            },
        }),
        prisma.teamMember.create({
            data: {
                fullName: 'Ayesha Malik', designation: 'Director of Education',
                bio: 'Education strategist with a passion for curriculum design. Ayesha ensures every course delivers maximum learning outcomes and real-world applicability.',
                linkedinUrl: 'https://linkedin.com/in/ayesha-malik', displayOrder: 3, isActive: true,
            },
        }),
        prisma.teamMember.create({
            data: {
                fullName: 'Hassan Raza', designation: 'Head of Student Success',
                bio: 'Student advocate and career counselor. Hassan helps every CAI&ET student find their career path and succeed in the technology industry.',
                linkedinUrl: 'https://linkedin.com/in/hassan-raza', displayOrder: 4, isActive: true,
            },
        }),
    ]);
    console.log('✅ Team members created');

    // ===== 9. SERVICE CATEGORIES =====
    const serviceCategories = await Promise.all([
        prisma.serviceCategory.create({
            data: { name: 'Software Development', slug: 'software-development', description: 'Custom software solutions', iconName: 'Code', displayOrder: 1 },
        }),
        prisma.serviceCategory.create({
            data: { name: 'AI & Data Solutions', slug: 'ai-data-solutions', description: 'AI-powered business solutions', iconName: 'Brain', displayOrder: 2 },
        }),
        prisma.serviceCategory.create({
            data: { name: 'Training & Consulting', slug: 'training-consulting', description: 'Corporate training and tech consulting', iconName: 'Users', displayOrder: 3 },
        }),
    ]);
    console.log('✅ Service categories created');

    // ===== 10. SERVICES =====
    await Promise.all([
        prisma.service.create({
            data: {
                title: 'Custom Web Application Development', slug: 'custom-web-application-development',
                categoryId: serviceCategories[0].id,
                shortDescription: 'End-to-end web application development tailored to your business needs.',
                fullDescription: 'We build scalable, secure, and high-performance web applications using modern technologies like React, Node.js, and cloud platforms. From concept to deployment, our team handles every aspect of your project.',
                iconName: 'Globe', priceText: 'Starting from $2,999', isFeatured: true, isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Mobile App Development', slug: 'mobile-app-development',
                categoryId: serviceCategories[0].id,
                shortDescription: 'Cross-platform mobile apps that deliver native performance.',
                fullDescription: 'Build beautiful, high-performance mobile applications for iOS and Android. We use Flutter and React Native to deliver native-quality apps with a single codebase, reducing time-to-market.',
                iconName: 'Smartphone', priceText: 'Starting from $4,999', isFeatured: true, isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'AI Model Development', slug: 'ai-model-development',
                categoryId: serviceCategories[1].id,
                shortDescription: 'Custom AI and machine learning models for your business.',
                fullDescription: 'Leverage the power of AI to automate processes, gain insights, and make data-driven decisions. We develop custom ML models, NLP solutions, and computer vision systems tailored to your specific requirements.',
                iconName: 'Cpu', priceText: 'Starting from $5,999', isFeatured: true, isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Data Analytics & BI Dashboards', slug: 'data-analytics-bi-dashboards',
                categoryId: serviceCategories[1].id,
                shortDescription: 'Turn your data into actionable business intelligence.',
                fullDescription: 'We help organizations unlock the value of their data through comprehensive analytics pipelines, interactive dashboards, and automated reporting systems using Power BI, Tableau, and custom solutions.',
                iconName: 'BarChart3', priceText: 'Starting from $1,999', isFeatured: false, isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Corporate Training Programs', slug: 'corporate-training-programs',
                categoryId: serviceCategories[2].id,
                shortDescription: 'Upskill your workforce with customized technology training.',
                fullDescription: 'Tailored training programs designed for corporate teams. We cover AI/ML, web development, cloud computing, cybersecurity, and more. On-site and remote options available.',
                iconName: 'GraduationCap', priceText: 'Custom Pricing', isFeatured: true, isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Technology Consulting', slug: 'technology-consulting',
                categoryId: serviceCategories[2].id,
                shortDescription: 'Expert guidance on technology strategy and digital transformation.',
                fullDescription: 'Our consultants help businesses navigate the complex technology landscape. From architecture reviews and tech stack selection to digital transformation roadmaps, we provide the expertise you need.',
                iconName: 'MessageSquare', priceText: 'Starting from $999', isFeatured: false, isActive: true,
            },
        }),
    ]);
    console.log('✅ Services created');

    // ===== 11. SERVICES PAGE SETTINGS =====
    await prisma.servicesPageSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            pageHeading: 'Our Services',
            pageSubheading: 'Empowering businesses with cutting-edge technology solutions',
            introText: 'At CAI&ET, we go beyond education. Our team of experienced developers, data scientists, and consultants deliver end-to-end technology solutions that drive business growth and innovation.',
        },
    });
    console.log('✅ Services page settings created');

    // ===== 12. BLOG POSTS =====
    await Promise.all([
        prisma.blogPost.create({
            data: {
                title: 'The Future of AI in Education: How Machine Learning is Transforming Learning',
                slug: 'future-of-ai-in-education',
                excerpt: 'Explore how artificial intelligence is revolutionizing the education sector, from personalized learning paths to automated assessment systems.',
                content: '## Introduction\n\nArtificial Intelligence is no longer a futuristic concept — it is actively reshaping how we learn, teach, and interact with educational content. From adaptive learning platforms to AI-powered tutoring systems, the transformation is already underway.\n\n## Personalized Learning Paths\n\nOne of the most significant impacts of AI in education is the ability to create truly personalized learning experiences. AI algorithms analyze student performance data to identify strengths, weaknesses, and learning patterns, then automatically adjust the curriculum to match each student&apos;s pace and style.\n\n## Automated Assessment\n\nAI-powered grading systems can evaluate not just multiple-choice answers, but essays, code submissions, and even creative projects. This frees teachers to focus on mentoring and one-on-one guidance.\n\n## The Road Ahead\n\nAs AI technology continues to evolve, we can expect even more innovative applications in education. Virtual reality classrooms, AI teaching assistants, and predictive analytics for student success are just the beginning.\n\n## Conclusion\n\nThe integration of AI in education is not about replacing teachers — it is about empowering them with better tools and insights. At CAI&ET, we are at the forefront of this revolution, training the next generation to build and leverage these technologies.',
                authorName: 'Muhammad Umair Khan', category: 'AI & Technology',
                tags: 'AI,Education,Machine Learning,EdTech',
                isPublished: true, publishedAt: new Date('2025-01-15'),
            },
        }),
        prisma.blogPost.create({
            data: {
                title: 'Why Flutter is the Future of Mobile App Development in 2025',
                slug: 'flutter-future-mobile-development-2025',
                excerpt: 'Discover why Flutter has become the go-to framework for mobile development and how it compares to React Native and native development.',
                content: '## Why Flutter?\n\nFlutter has taken the mobile development world by storm. With its rich widget library, hot reload feature, and single codebase approach, it offers the perfect balance of development speed and app performance.\n\n## Key Advantages\n\n1. **Single Codebase** — Write once, deploy to iOS, Android, Web, and Desktop\n2. **Hot Reload** — See changes instantly without losing app state\n3. **Beautiful UI** — Rich set of customizable widgets that look native on every platform\n4. **Growing Ecosystem** — Thousands of packages available on pub.dev\n5. **Backed by Google** — Continuous investment and improvement\n\n## Flutter vs React Native\n\nWhile both frameworks serve similar purposes, Flutter offers better performance through its custom rendering engine, while React Native relies on JavaScript bridges. Flutter also provides a more consistent look across platforms.\n\n## Getting Started\n\nAt CAI&ET, our Flutter App Development course takes you from zero to app store deployment in just 3 months. Join our next batch and start building amazing apps!',
                authorName: 'Ali Hassan', category: 'Mobile Development',
                tags: 'Flutter,Mobile,Dart,App Development',
                isPublished: true, publishedAt: new Date('2025-01-20'),
            },
        }),
        prisma.blogPost.create({
            data: {
                title: '10 Essential Skills Every Full-Stack Developer Needs in 2025',
                slug: '10-essential-skills-full-stack-developer-2025',
                excerpt: 'The web development landscape is evolving rapidly. Here are the top skills you need to stay competitive as a full-stack developer.',
                content: '## The Modern Full-Stack Developer\n\nFull-stack development has evolved far beyond just knowing HTML, CSS, and a backend language. In 2025, employers expect a diverse skill set that spans multiple domains.\n\n## The Top 10 Skills\n\n1. **JavaScript/TypeScript** — The foundation of modern web development\n2. **React or Next.js** — The dominant frontend frameworks\n3. **Node.js & Express** — Server-side JavaScript for full-stack consistency\n4. **Database Design** — Both SQL (PostgreSQL) and NoSQL (MongoDB)\n5. **API Design** — RESTful APIs and GraphQL\n6. **Git & Version Control** — Essential for team collaboration\n7. **Cloud Services** — AWS, Azure, or GCP basics\n8. **Docker & Containerization** — Modern deployment practices\n9. **Testing** — Unit, integration, and E2E testing\n10. **Soft Skills** — Communication, problem-solving, and continuous learning\n\n## How to Learn These Skills\n\nOur Full Stack Web Development course at CAI&ET covers all these skills with hands-on projects. Start your journey today!',
                authorName: 'Sarah Ahmed', category: 'Web Development',
                tags: 'Web Development,Full Stack,JavaScript,Career',
                isPublished: true, publishedAt: new Date('2025-02-01'),
            },
        }),
        prisma.blogPost.create({
            data: {
                title: 'Getting Started with Data Science: A Beginner&apos;s Roadmap',
                slug: 'getting-started-data-science-beginners-roadmap',
                excerpt: 'Want to start a career in data science? Here is a step-by-step roadmap to go from absolute beginner to data scientist.',
                content: '## What is Data Science?\n\nData science combines statistics, programming, and domain expertise to extract meaningful insights from data. It is one of the most in-demand careers in 2025.\n\n## The Roadmap\n\n### Phase 1: Foundation (Month 1-2)\n- Learn Python programming\n- Understand basic statistics and probability\n- Get comfortable with Jupyter notebooks\n\n### Phase 2: Data Analysis (Month 3-4)\n- Master Pandas and NumPy\n- Learn data visualization with Matplotlib and Seaborn\n- Practice with real datasets\n\n### Phase 3: Machine Learning (Month 5-6)\n- Study supervised and unsupervised learning\n- Learn scikit-learn\n- Build predictive models\n\n### Phase 4: Specialization (Month 7+)\n- Choose a focus area: NLP, Computer Vision, or Deep Learning\n- Build a portfolio of projects\n- Contribute to open source\n\n## Start Your Journey at CAI&ET\n\nOur Data Analysis with Python course is the perfect starting point. Check it out!',
                authorName: 'Dr. Fatima Zahra', category: 'Data Science',
                tags: 'Data Science,Python,Career,Beginners',
                isPublished: true, publishedAt: new Date('2025-02-10'),
            },
        }),
    ]);
    console.log('✅ Blog posts created');

    // ===== 13. FAQs =====
    await Promise.all([
        prisma.fAQ.create({ data: { question: 'What are the admission requirements?', answer: 'We welcome students from all educational backgrounds. Basic computer literacy is required for beginner courses. For intermediate and advanced courses, prerequisites are listed on each course page.', category: 'Admissions', displayOrder: 1 } }),
        prisma.fAQ.create({ data: { question: 'How do I apply for a course?', answer: 'You can apply directly through our website by clicking the "Apply Now" button. Fill out the application form, select your preferred course, and submit. Our admissions team will contact you within 24-48 hours.', category: 'Admissions', displayOrder: 2 } }),
        prisma.fAQ.create({ data: { question: 'Are there any scholarships available?', answer: 'Yes! We offer merit-based scholarships and need-based financial aid. Currently, we have a 50% discount offer on selected courses. Contact our admissions office for more details.', category: 'Admissions', displayOrder: 3 } }),
        prisma.fAQ.create({ data: { question: 'What is the class schedule?', answer: 'We offer both weekday (Mon-Fri evening) and weekend (Sat-Sun) batches. Online and on-campus options are available for most courses.', category: 'Courses', displayOrder: 1 } }),
        prisma.fAQ.create({ data: { question: 'Do I get a certificate after completing a course?', answer: 'Yes, all students receive a verified digital certificate upon successful completion of their course. This certificate can be shared on LinkedIn and included in your resume.', category: 'Courses', displayOrder: 2 } }),
        prisma.fAQ.create({ data: { question: 'Are the courses online or in-person?', answer: 'We offer both! Most courses are available in hybrid mode — you can attend live sessions on-campus or join remotely via our virtual classroom platform.', category: 'Courses', displayOrder: 3 } }),
        prisma.fAQ.create({ data: { question: 'What support do students receive?', answer: 'Students get access to recorded lectures, practice labs, mentorship sessions, career counseling, and a vibrant community of fellow learners. Our instructors are available for one-on-one doubt clearing sessions.', category: 'General', displayOrder: 1 } }),
        prisma.fAQ.create({ data: { question: 'Does CAI&ET offer placement assistance?', answer: 'Yes, we provide career guidance, resume reviews, mock interviews, and connect students with our network of hiring partners. Many of our graduates have been placed at leading tech companies.', category: 'General', displayOrder: 2 } }),
    ]);
    console.log('✅ FAQs created');

    // ===== 14. SAMPLE APPLICATIONS =====
    await Promise.all([
        prisma.application.create({
            data: {
                fullName: 'Ahmed Ali', email: 'ahmed.ali@email.com', phone: '+92 301 1111111',
                courseId: courses[0].id, city: 'Lahore', educationLevel: 'Bachelor\'s Degree',
                message: 'I am a CS graduate interested in transitioning to AI/ML. Looking forward to this course!',
                status: 'Pending',
            },
        }),
        prisma.application.create({
            data: {
                fullName: 'Zara Khan', email: 'zara.khan@email.com', phone: '+92 302 2222222',
                courseId: courses[2].id, city: 'Karachi', educationLevel: 'Intermediate',
                message: 'I want to learn web development to start freelancing. Very excited about this opportunity!',
                status: 'Approved',
            },
        }),
        prisma.application.create({
            data: {
                fullName: 'Bilal Hussain', email: 'bilal.h@email.com', phone: '+92 303 3333333',
                courseId: courses[4].id, city: 'Islamabad', educationLevel: 'Bachelor\'s Degree',
                message: 'Interested in Flutter development. I have basic programming experience.',
                status: 'Pending',
            },
        }),
    ]);
    console.log('✅ Sample applications created');

    // ===== 15. EMAIL TEMPLATES =====
    await Promise.all([
        prisma.emailTemplate.create({
            data: {
                templateName: 'Welcome Email',
                subject: 'Welcome to CAI&ET! 🚀',
                bodyText: 'Dear {student_name},\n\nWelcome to CAI&ET – Center for AI & Emerging Technologies!\n\nWe are thrilled to have you join our community of learners. Your journey into the world of technology starts now.\n\nYour enrolled course: {course_name}\nStart date: {start_date}\n\nIf you have any questions, feel free to reach out.\n\nBest regards,\nThe CAI&ET Team',
                templateType: 'welcome',
            },
        }),
        prisma.emailTemplate.create({
            data: {
                templateName: 'Application Received',
                subject: 'Application Received – CAI&ET',
                bodyText: 'Dear {applicant_name},\n\nThank you for applying to CAI&ET!\n\nWe have received your application for {course_name}. Our admissions team will review it and get back to you within 24-48 hours.\n\nApplication Status: Under Review\n\nBest regards,\nThe CAI&ET Admissions Team',
                templateType: 'application_received',
            },
        }),
        prisma.emailTemplate.create({
            data: {
                templateName: 'Application Approved',
                subject: 'Congratulations! Your Application is Approved 🎉',
                bodyText: 'Dear {applicant_name},\n\nGreat news! Your application for {course_name} has been approved.\n\nPlease complete your enrollment by paying the course fee. You can visit our office or contact us for online payment options.\n\nCourse: {course_name}\nFee: {course_fee}\nStart Date: {start_date}\n\nWelcome aboard!\n\nBest regards,\nThe CAI&ET Admissions Team',
                templateType: 'application_approved',
            },
        }),
    ]);
    console.log('✅ Email templates created');

    // ===== 16. ACTIVITY LOG (sample entries) =====
    await Promise.all([
        prisma.activityLog.create({
            data: { adminName: 'Super Admin', actionType: 'added', itemType: 'Course', itemName: 'Machine Learning Fundamentals', createdAt: new Date('2025-01-10') },
        }),
        prisma.activityLog.create({
            data: { adminName: 'Super Admin', actionType: 'added', itemType: 'Course', itemName: 'Full Stack Web Development', createdAt: new Date('2025-01-11') },
        }),
        prisma.activityLog.create({
            data: { adminName: 'Super Admin', actionType: 'changed', itemType: 'Banner Settings', itemName: 'Announcement Banner', createdAt: new Date('2025-01-12') },
        }),
        prisma.activityLog.create({
            data: { adminName: 'Super Admin', actionType: 'added', itemType: 'Blog Post', itemName: 'The Future of AI in Education', createdAt: new Date('2025-01-15') },
        }),
        prisma.activityLog.create({
            data: { adminName: 'Super Admin', actionType: 'deleted', itemType: 'FAQ', itemName: 'Old FAQ about registration', createdAt: new Date('2025-01-16') },
        }),
    ]);
    console.log('✅ Activity log entries created');

    // ===== DONE =====
    console.log('\n🎉 ============================================');
    console.log('🎉  Database seeded successfully!');
    console.log('🎉 ============================================');
    console.log('');
    console.log('📧 Admin Email:    admin@caiet.com');
    console.log('🔑 Admin Password: Admin@123');
    console.log('');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
