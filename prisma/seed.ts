import { db } from '../src/lib/db';

async function main() {
  console.log('Start seeding...');

  // Seed quizzes
  await seedQuizzes();

  // Seed sources
  await seedSources();

  console.log('Seeding finished.');
}

async function seedQuizzes() {
  console.log('Seeding quizzes...');

  // Check if quizzes already exist
  const existingCount = await (db as any).quiz.count();
  if (existingCount > 0) {
    console.log(`Skipping quizzes - ${existingCount} already exist`);
    return;
  }

  const quizzes = [
    {
      title: "Media Literacy Basics",
      description: "Learn to identify credible sources and spot misinformation",
      category: "media literacy",
      difficulty: "beginner",
      timeLimit: 10,
      questions: [
        {
          questionText: "What is the first thing you should check when evaluating a news source?",
          questionType: "multiple_choice",
          options: JSON.stringify(["The author's credentials", "The publication date", "The website design", "The number of shares"]),
          correctAnswer: "The author's credentials",
          explanation: "Author credentials help determine expertise and potential bias.",
          points: 1,
          order: 1
        },
        {
          questionText: "Which of the following is a sign of potential misinformation?",
          questionType: "multiple_choice",
          options: JSON.stringify(["Cited sources and references", "Emotional language and urgent tone", "Multiple viewpoints presented", "Professional website design"]),
          correctAnswer: "Emotional language and urgent tone",
          explanation: "Misinformation often uses emotional manipulation to spread quickly.",
          points: 1,
          order: 2
        },
        {
          questionText: "What does 'confirmation bias' mean?",
          questionType: "multiple_choice",
          options: JSON.stringify(["Always confirming facts before sharing", "Preferring information that matches your existing beliefs", "Confirming sources with multiple people", "Bias confirmed by fact-checkers"]),
          correctAnswer: "Preferring information that matches your existing beliefs",
          explanation: "Confirmation bias leads us to seek and believe information that confirms what we already think.",
          points: 1,
          order: 3
        },
        {
          questionText: "When was the last time this claim appeared online?",
          questionType: "multiple_choice",
          options: JSON.stringify(["Yesterday - it's breaking news", "Last week", "Last year - it's an old claim resurfacing", "Never - it's completely new"]),
          correctAnswer: "Last year - it's an old claim resurfacing",
          explanation: "Old claims often resurface and spread again. Checking the date is crucial for verification.",
          points: 1,
          order: 4
        }
      ]
    },
    {
      title: "Fact Checking Fundamentals",
      description: "Master the art of verifying information",
      category: "fact checking",
      difficulty: "intermediate",
      timeLimit: 15,
      questions: [
        {
          questionText: "What is 'lateral reading'?",
          questionType: "multiple_choice",
          options: JSON.stringify(["Reading articles side by side", "Leaving the site to verify claims elsewhere", "Reading the comments section", "Reading the article multiple times"]),
          correctAnswer: "Leaving the site to verify claims elsewhere",
          explanation: "Lateral reading means opening new tabs to verify claims from other sources, rather than staying on one site.",
          points: 1,
          order: 1
        },
        {
          questionText: "Which fact-checking organization is internationally recognized?",
          questionType: "multiple_choice",
          options: JSON.stringify(["Personal blog", "Social media influencer", "IFCN (International Fact-Checking Network)", "Anonymous forum poster"]),
          correctAnswer: "IFCN (International Fact-Checking Network)",
          explanation: "IFCN certifies fact-checkers that follow established standards and methodologies.",
          points: 1,
          order: 2
        },
        {
          questionText: "What is a 'primary source'?",
          questionType: "multiple_choice",
          options: JSON.stringify(["The first website to report news", "Original documents or direct evidence", "A popular news aggregator", "Social media posts"]),
          correctAnswer: "Original documents or direct evidence",
          explanation: "Primary sources provide direct evidence like official reports, research papers, or eyewitness accounts.",
          points: 1,
          order: 3
        },
        {
          questionText: "How should you treat viral screenshots of news articles?",
          questionType: "multiple_choice",
          options: JSON.stringify(["Share immediately if it supports your view", "Verify by visiting the original source", "Trust if it has many likes", "Assume it's edited if you don't like it"]),
          correctAnswer: "Verify by visiting the original source",
          explanation: "Screenshots can be easily manipulated. Always verify by checking the original article on the publication's website.",
          points: 1,
          order: 4
        }
      ]
    },
    {
      title: "Advanced Verification Techniques",
      description: "Professional methods for journalists and researchers",
      category: "verification",
      difficulty: "advanced",
      timeLimit: 20,
      questions: [
        {
          questionText: "What is reverse image search used for?",
          questionType: "multiple_choice",
          options: JSON.stringify(["Finding high-resolution versions", "Determining when and where an image first appeared", "Creating memes", "Removing watermarks"]),
          correctAnswer: "Determining when and where an image first appeared",
          explanation: "Reverse image search helps verify the origin and context of images to detect misinformation.",
          points: 1,
          order: 1
        },
        {
          questionText: "What does 'SIFT' stand for in verification?",
          questionType: "multiple_choice",
          options: JSON.stringify(["Sort, Investigate, Find, Trace", "Stop, Investigate the source, Find better coverage, Trace claims", "Scan, Identify, Filter, Test", "Search, Investigate, File, Transmit"]),
          correctAnswer: "Stop, Investigate the source, Find better coverage, Trace claims",
          explanation: "SIFT is a four-step verification method: Stop, Investigate the source, Find better coverage, Trace claims to their origin.",
          points: 1,
          order: 2
        },
        {
          questionText: "What is metadata in images?",
          questionType: "multiple_choice",
          options: JSON.stringify(["The image caption only", "Hidden data about when, where, and how the photo was taken", "The file name", "The image resolution"]),
          correctAnswer: "Hidden data about when, where, and how the photo was taken",
          explanation: "EXIF metadata can contain camera information, GPS coordinates, timestamps, and editing history.",
          points: 1,
          order: 3
        }
      ]
    }
  ];

  for (const quiz of quizzes) {
    const { questions, ...quizData } = quiz;
    
    const created = await (db as any).quiz.create({
      data: quizData
    });

    // Create questions for this quiz
    for (const question of questions) {
      await (db as any).quizQuestion.create({
        data: {
          ...question,
          quizId: created.id
        }
      });
    }

    console.log(`Created quiz: ${quiz.title} with ${questions.length} questions`);
  }
}

async function seedSources() {
  console.log('Seeding sources...');

  // Check if sources already exist
  const existingCount = await (db as any).source.count();
  if (existingCount > 0) {
    console.log(`Skipping sources - ${existingCount} already exist`);
    return;
  }

  const sources = [
    {
      domain: "reuters.com",
      name: "Reuters",
      tier: "high",
      biasIndex: 0.0,
      category: "news",
      region: "global",
      description: "International news organization known for factual, unbiased reporting",
      credibilityScore: 92.0,
      auditor: "system"
    },
    {
      domain: "apnews.com",
      name: "Associated Press",
      tier: "high",
      biasIndex: 0.0,
      category: "news",
      region: "US",
      description: "Nonprofit news agency with commitment to factual, unbiased reporting",
      credibilityScore: 94.0,
      auditor: "system"
    },
    {
      domain: "bbc.com",
      name: "BBC News",
      tier: "high",
      biasIndex: 0.1,
      category: "news",
      region: "UK",
      description: "British Broadcasting Corporation - International news with high journalistic standards",
      credibilityScore: 88.0,
      auditor: "system"
    },
    {
      domain: "npr.org",
      name: "NPR",
      tier: "high",
      biasIndex: -0.2,
      category: "news",
      region: "US",
      description: "National Public Radio - Nonprofit media organization with factual reporting",
      credibilityScore: 89.0,
      auditor: "system"
    },
    {
      domain: "politifact.com",
      name: "PolitiFact",
      tier: "high",
      biasIndex: 0.0,
      category: "fact checking",
      region: "US",
      description: "Pulitzer Prize-winning fact-checking website",
      credibilityScore: 95.0,
      auditor: "system"
    },
    {
      domain: "snopes.com",
      name: "Snopes",
      tier: "high",
      biasIndex: 0.0,
      category: "fact checking",
      region: "US",
      description: "Pioneering fact-checking website for urban legends and misinformation",
      credibilityScore: 90.0,
      auditor: "system"
    },
    {
      domain: "nytimes.com",
      name: "The New York Times",
      tier: "high",
      biasIndex: -0.3,
      category: "news",
      region: "US",
      description: "Major American newspaper with high journalistic standards",
      credibilityScore: 87.0,
      auditor: "system"
    },
    {
      domain: "wsj.com",
      name: "The Wall Street Journal",
      tier: "high",
      biasIndex: 0.4,
      category: "news",
      region: "US",
      description: "Business-focused newspaper with factual reporting on financial matters",
      credibilityScore: 86.0,
      auditor: "system"
    },
    {
      domain: "cnn.com",
      name: "CNN",
      tier: "medium",
      biasIndex: -0.4,
      category: "news",
      region: "US",
      description: "Cable News Network - Breaking news coverage with some opinion content",
      credibilityScore: 75.0,
      auditor: "system"
    },
    {
      domain: "foxnews.com",
      name: "Fox News",
      tier: "medium",
      biasIndex: 0.6,
      category: "news",
      region: "US",
      description: "Conservative news channel with opinion programming",
      credibilityScore: 68.0,
      auditor: "system"
    },
    {
      domain: "msnbc.com",
      name: "MSNBC",
      tier: "medium",
      biasIndex: -0.5,
      category: "news",
      region: "US",
      description: "Progressive news channel with opinion programming",
      credibilityScore: 70.0,
      auditor: "system"
    },
    {
      domain: "theguardian.com",
      name: "The Guardian",
      tier: "high",
      biasIndex: -0.3,
      category: "news",
      region: "UK",
      description: "British newspaper with left-leaning editorial stance but factual reporting",
      credibilityScore: 85.0,
      auditor: "system"
    },
    {
      domain: "aljazeera.com",
      name: "Al Jazeera",
      tier: "high",
      biasIndex: 0.0,
      category: "news",
      region: "Qatar",
      description: "International news channel providing alternative global perspectives",
      credibilityScore: 84.0,
      auditor: "system"
    },
    {
      domain: "factcheck.org",
      name: "FactCheck.org",
      tier: "high",
      biasIndex: 0.0,
      category: "fact checking",
      region: "US",
      description: "Nonpartisan, nonprofit consumer advocate for voters",
      credibilityScore: 93.0,
      auditor: "system"
    },
    {
      domain: "washingtonpost.com",
      name: "The Washington Post",
      tier: "high",
      biasIndex: -0.2,
      category: "news",
      region: "US",
      description: "Major American newspaper known for investigative journalism",
      credibilityScore: 88.0,
      auditor: "system"
    }
  ];

  for (const source of sources) {
    await (db as any).source.create({
      data: source
    });
    console.log(`Created source: ${source.name} (${source.credibilityScore}% credibility)`);
  }
}

main()
  .then(async () => {
    await (db as any).$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await (db as any).$disconnect();
    process.exit(1);
  });
