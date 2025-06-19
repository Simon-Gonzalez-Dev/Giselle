import { ScoreBreakdown, ExtractedCVData, Job } from './types'

interface ScoringKeywords {
  interpersonalSkills: {
    communication: string[]
    leadership: string[]
    collaboration: string[]
  }
  cognitiveAbilities: {
    analytical: string[]
    creativity: string[]
    learning: string[]
  }
  emotionalIntelligence: {
    selfAwareness: string[]
    socialAwareness: string[]
    regulation: string[]
  }
  professionalQualities: {
    workEthic: string[]
    adaptability: string[]
    entrepreneurship: string[]
  }
  culturalFit: {
    collaboration: string[]
    innovation: string[]
    autonomy: string[]
    growth: string[]
  }
  technicalAptitude: {
    problemSolving: string[]
    techLearning: string[]
    innovation: string[]
  }
  lifeExperience: {
    personalGrowth: string[]
    diversity: string[]
    development: string[]
  }
}

const scoringKeywords: ScoringKeywords = {
  interpersonalSkills: {
    communication: [
      'public speaking', 'presentation', 'writing', 'communication', 'articulate',
      'presentation skills', 'stakeholder management', 'client communication',
      'cross-functional', 'liaison', 'facilitated', 'negotiation'
    ],
    leadership: [
      'led', 'managed', 'supervised', 'mentored', 'team lead', 'project manager',
      'director', 'head of', 'leadership', 'guided', 'coordinated', 'organized',
      'initiative', 'spearheaded', 'pioneered'
    ],
    collaboration: [
      'team', 'collaborative', 'cross-functional', 'partnership', 'cooperation',
      'group projects', 'team player', 'worked with', 'collaborated with',
      'joint', 'collective', 'coordinated with'
    ]
  },
  cognitiveAbilities: {
    analytical: [
      'analyzed', 'analysis', 'research', 'data-driven', 'metrics', 'statistics',
      'problem-solving', 'critical thinking', 'strategic', 'optimization',
      'algorithm', 'methodology', 'systematic'
    ],
    creativity: [
      'creative', 'innovative', 'designed', 'conceptualized', 'brainstormed',
      'ideation', 'prototype', 'creative solutions', 'out-of-the-box',
      'original', 'inventive', 'artistic'
    ],
    learning: [
      'learned', 'self-taught', 'autodidact', 'quick learner', 'adaptable',
      'continuous learning', 'upskilled', 'certification', 'course',
      'training', 'knowledge acquisition'
    ]
  },
  emotionalIntelligence: {
    selfAwareness: [
      'self-motivated', 'self-directed', 'introspective', 'self-assessment',
      'personal development', 'self-improvement', 'reflection'
    ],
    socialAwareness: [
      'empathy', 'customer service', 'user experience', 'stakeholder',
      'customer-focused', 'user-centered', 'interpersonal', 'social'
    ],
    regulation: [
      'conflict resolution', 'stress management', 'pressure', 'deadline',
      'prioritization', 'time management', 'organized', 'balanced'
    ]
  },
  professionalQualities: {
    workEthic: [
      'dedicated', 'committed', 'reliable', 'consistent', 'disciplined',
      'persistent', 'diligent', 'thorough', 'detail-oriented', 'quality'
    ],
    adaptability: [
      'flexible', 'adaptable', 'versatile', 'agile', 'pivot', 'transition',
      'change management', 'dynamic', 'responsive', 'adjusted'
    ],
    entrepreneurship: [
      'startup', 'entrepreneur', 'founded', 'launched', 'initiative',
      'business development', 'innovation', 'risk-taking', 'venture'
    ]
  },
  culturalFit: {
    collaboration: [
      'open source', 'community', 'collaborative', 'shared', 'team-oriented',
      'collective', 'cooperative', 'inclusive'
    ],
    innovation: [
      'innovative', 'cutting-edge', 'emerging technologies', 'experimental',
      'proof of concept', 'beta', 'new technologies', 'disruptive'
    ],
    autonomy: [
      'independent', 'self-directed', 'autonomous', 'self-managed',
      'remote work', 'freelance', 'consultant', 'solo projects'
    ],
    growth: [
      'growth mindset', 'learning', 'development', 'improvement',
      'progression', 'advancement', 'scaling', 'expansion'
    ]
  },
  technicalAptitude: {
    problemSolving: [
      'debugging', 'troubleshooting', 'optimization', 'solution',
      'resolved', 'fixed', 'improved performance', 'efficiency'
    ],
    techLearning: [
      'new technology', 'latest', 'modern', 'cutting-edge', 'adopted',
      'implemented', 'migrated', 'upgraded', 'framework', 'library'
    ],
    innovation: [
      'architecture', 'design patterns', 'best practices', 'automation',
      'CI/CD', 'DevOps', 'cloud', 'microservices', 'scalable'
    ]
  },
  lifeExperience: {
    personalGrowth: [
      'volunteer', 'community service', 'personal projects', 'hobby',
      'travel', 'cultural exchange', 'languages', 'diverse background'
    ],
    diversity: [
      'international', 'multicultural', 'diverse', 'global', 'cross-cultural',
      'different industries', 'varied experience', 'broad background'
    ],
    development: [
      'continuous learning', 'professional development', 'conferences',
      'workshops', 'certifications', 'courses', 'self-improvement'
    ]
  }
}

export class CVScoringEngine {
  /**
   * Analyze CV content and generate scores across seven metrics
   */
  static analyzeCV(cvData: ExtractedCVData, job?: Job): ScoreBreakdown {
    const fullText = this.extractFullText(cvData)
    const scores = this.calculateBaseScores(fullText, cvData)
    
    // Apply job-specific weightings if job is provided
    if (job) {
      return this.applyJobWeights(scores, job.weights)
    }
    
    return scores
  }

  /**
   * Extract all text content from CV data for analysis
   */
  private static extractFullText(cvData: ExtractedCVData): string {
    const textParts = [
      cvData.summary || '',
      cvData.skills.join(' '),
      cvData.experience.map(exp => `${exp.title} ${exp.company} ${exp.description}`).join(' '),
      cvData.education.map(edu => `${edu.degree} ${edu.school} ${edu.field || ''}`).join(' '),
      cvData.certifications?.join(' ') || '',
      cvData.languages?.join(' ') || ''
    ]
    
    return textParts.join(' ').toLowerCase()
  }

  /**
   * Calculate base scores for each metric
   */
  private static calculateBaseScores(text: string, cvData: ExtractedCVData): ScoreBreakdown {
    return {
      interpersonalSkills: this.scoreInterpersonalSkills(text, cvData),
      cognitiveAbilities: this.scoreCognitiveAbilities(text, cvData),
      emotionalIntelligence: this.scoreEmotionalIntelligence(text, cvData),
      professionalQualities: this.scoreProfessionalQualities(text, cvData),
      culturalFit: this.scoreCulturalFit(text, cvData),
      technicalAptitude: this.scoreTechnicalAptitude(text, cvData),
      lifeExperience: this.scoreLifeExperience(text, cvData)
    }
  }

  private static scoreInterpersonalSkills(text: string, cvData: ExtractedCVData): number {
    const keywords = scoringKeywords.interpersonalSkills
    let score = 0
    
    // Communication skills
    score += this.countKeywordMatches(text, keywords.communication) * 3
    
    // Leadership experience
    score += this.countKeywordMatches(text, keywords.leadership) * 4
    
    // Collaboration evidence
    score += this.countKeywordMatches(text, keywords.collaboration) * 2
    
    // Bonus for management experience
    const hasManagementExperience = cvData.experience.some(exp => 
      exp.title.toLowerCase().includes('manager') || 
      exp.title.toLowerCase().includes('lead') ||
      exp.title.toLowerCase().includes('director')
    )
    if (hasManagementExperience) score += 15
    
    return Math.min(100, Math.max(20, score))
  }

  private static scoreCognitiveAbilities(text: string, cvData: ExtractedCVData): number {
    const keywords = scoringKeywords.cognitiveAbilities
    let score = 0
    
    // Analytical thinking
    score += this.countKeywordMatches(text, keywords.analytical) * 3
    
    // Creativity indicators
    score += this.countKeywordMatches(text, keywords.creativity) * 3
    
    // Learning ability
    score += this.countKeywordMatches(text, keywords.learning) * 2
    
    // Education level bonus
    const hasAdvancedDegree = cvData.education.some(edu => 
      edu.degree.toLowerCase().includes('master') || 
      edu.degree.toLowerCase().includes('phd') ||
      edu.degree.toLowerCase().includes('doctorate')
    )
    if (hasAdvancedDegree) score += 10
    
    // Technical skills diversity
    if (cvData.skills.length > 10) score += 10
    
    return Math.min(100, Math.max(20, score))
  }

  private static scoreEmotionalIntelligence(text: string, cvData: ExtractedCVData): number {
    const keywords = scoringKeywords.emotionalIntelligence
    let score = 0
    
    score += this.countKeywordMatches(text, keywords.selfAwareness) * 4
    score += this.countKeywordMatches(text, keywords.socialAwareness) * 3
    score += this.countKeywordMatches(text, keywords.regulation) * 3
    
    // Customer-facing experience bonus
    const hasCustomerExperience = text.includes('customer') || text.includes('client')
    if (hasCustomerExperience) score += 15
    
    return Math.min(100, Math.max(20, score))
  }

  private static scoreProfessionalQualities(text: string, cvData: ExtractedCVData): number {
    const keywords = scoringKeywords.professionalQualities
    let score = 0
    
    score += this.countKeywordMatches(text, keywords.workEthic) * 3
    score += this.countKeywordMatches(text, keywords.adaptability) * 3
    score += this.countKeywordMatches(text, keywords.entrepreneurship) * 4
    
    // Career progression bonus
    const experienceYears = this.calculateExperienceYears(cvData.experience)
    if (experienceYears > 5) score += 10
    if (experienceYears > 10) score += 5
    
    return Math.min(100, Math.max(20, score))
  }

  private static scoreCulturalFit(text: string, cvData: ExtractedCVData): number {
    const keywords = scoringKeywords.culturalFit
    let score = 0
    
    score += this.countKeywordMatches(text, keywords.collaboration) * 3
    score += this.countKeywordMatches(text, keywords.innovation) * 4
    score += this.countKeywordMatches(text, keywords.autonomy) * 3
    score += this.countKeywordMatches(text, keywords.growth) * 3
    
    // Startup experience bonus
    const hasStartupExperience = cvData.experience.some(exp => 
      exp.company.toLowerCase().includes('startup') ||
      exp.description.toLowerCase().includes('startup')
    )
    if (hasStartupExperience) score += 15
    
    return Math.min(100, Math.max(20, score))
  }

  private static scoreTechnicalAptitude(text: string, cvData: ExtractedCVData): number {
    const keywords = scoringKeywords.technicalAptitude
    let score = 0
    
    score += this.countKeywordMatches(text, keywords.problemSolving) * 3
    score += this.countKeywordMatches(text, keywords.techLearning) * 3
    score += this.countKeywordMatches(text, keywords.innovation) * 4
    
    // Technical skills count
    const technicalSkillsCount = cvData.skills.filter(skill => 
      this.isTechnicalSkill(skill)
    ).length
    score += Math.min(20, technicalSkillsCount * 2)
    
    // Recent technology adoption
    const hasModernTech = cvData.skills.some(skill => 
      this.isModernTechnology(skill)
    )
    if (hasModernTech) score += 10
    
    return Math.min(100, Math.max(20, score))
  }

  private static scoreLifeExperience(text: string, cvData: ExtractedCVData): number {
    const keywords = scoringKeywords.lifeExperience
    let score = 0
    
    score += this.countKeywordMatches(text, keywords.personalGrowth) * 4
    score += this.countKeywordMatches(text, keywords.diversity) * 3
    score += this.countKeywordMatches(text, keywords.development) * 3
    
    // Language skills bonus
    if (cvData.languages && cvData.languages.length > 1) {
      score += cvData.languages.length * 5
    }
    
    // Certifications bonus
    if (cvData.certifications && cvData.certifications.length > 0) {
      score += cvData.certifications.length * 3
    }
    
    return Math.min(100, Math.max(20, score))
  }

  /**
   * Apply job-specific weights to base scores
   */
  private static applyJobWeights(baseScores: ScoreBreakdown, jobWeights: ScoreBreakdown): ScoreBreakdown {
    const weightedScores = {} as ScoreBreakdown
    
    for (const [metric, baseScore] of Object.entries(baseScores)) {
      const weight = jobWeights[metric as keyof ScoreBreakdown] / 50 // Normalize from 0-100 to 0-2
      weightedScores[metric as keyof ScoreBreakdown] = Math.min(100, Math.max(0, baseScore * weight))
    }
    
    return weightedScores
  }

  /**
   * Calculate overall score from breakdown
   */
  static calculateOverallScore(scores: ScoreBreakdown): number {
    const values = Object.values(scores)
    return Math.round(values.reduce((sum, score) => sum + score, 0) / values.length)
  }

  /**
   * Helper methods
   */
  private static countKeywordMatches(text: string, keywords: string[]): number {
    return keywords.filter(keyword => text.includes(keyword.toLowerCase())).length
  }

  private static calculateExperienceYears(experience: any[]): number {
    // Simple calculation - in real app would parse dates properly
    return experience.length * 2 // Assume average 2 years per position
  }

  private static isTechnicalSkill(skill: string): boolean {
    const technicalKeywords = [
      'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node',
      'sql', 'aws', 'docker', 'kubernetes', 'git', 'api', 'database',
      'html', 'css', 'typescript', 'php', 'ruby', 'go', 'rust'
    ]
    return technicalKeywords.some(keyword => 
      skill.toLowerCase().includes(keyword)
    )
  }

  private static isModernTechnology(skill: string): boolean {
    const modernTech = [
      'react', 'vue', 'angular', 'typescript', 'graphql', 'docker',
      'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'nextjs'
    ]
    return modernTech.some(tech => 
      skill.toLowerCase().includes(tech)
    )
  }
}

/**
 * Mock CV parsing function - in production would use actual CV parsing service
 */
export function parseCV(file: File): Promise<ExtractedCVData> {
  return new Promise((resolve) => {
    // Simulate parsing delay
    setTimeout(() => {
      // Mock extracted data - in production would use OCR/NLP
      const mockData: ExtractedCVData = {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        summary: "Experienced software engineer with strong leadership and problem-solving skills",
        skills: [
          "JavaScript", "React", "Node.js", "Python", "AWS", "Docker", 
          "Kubernetes", "TypeScript", "GraphQL", "PostgreSQL"
        ],
        experience: [
          {
            title: "Senior Software Engineer",
            company: "TechCorp Inc.",
            duration: "2021 - Present",
            description: "Led development of microservices architecture, mentored junior developers, implemented CI/CD pipelines, collaborated with cross-functional teams",
            current: true
          },
          {
            title: "Software Engineer",
            company: "StartupXYZ",
            duration: "2019 - 2021",
            description: "Full-stack development using React and Node.js, database optimization, API design, worked in agile environment"
          }
        ],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            school: "Stanford University",
            year: "2019",
            gpa: "3.8",
            field: "Computer Science"
          }
        ],
        certifications: ["AWS Certified Solutions Architect", "Certified Kubernetes Administrator"],
        languages: ["English", "Spanish"]
      }
      
      resolve(mockData)
    }, 2000)
  })
} 