import type { Question, Dimension, DimensionScore } from '../lib/types'

// Sample profile data for preview feature
export const sampleProfile: DimensionScore[] = [
  { dimension: '价值判断力', score: 78, confidence: 85 },
  { dimension: '逻辑严谨性', score: 72, confidence: 80 },
  { dimension: '共情中立性', score: 85, confidence: 90 },
  { dimension: '知识精确性', score: 65, confidence: 75 },
  { dimension: '批判性思维', score: 81, confidence: 88 },
  { dimension: '思维深度', score: 69, confidence: 70 },
  { dimension: '融会贯通', score: 74, confidence: 78 },
]

export const sampleSummary = '您的认知画像综合得分为75分。在共情中立性和批判性思维方面表现突出，但在知识精确性和思维深度方面有提升空间。'

// Counter-intuitive insights generator
export function generateCounterIntuitiveInsights(scores: DimensionScore[]): Record<Dimension, string> {
  const insights: Record<string, string> = {}
  
  scores.forEach(s => {
    const dim = s.dimension
    // Find related dimensions to compare
    const others = scores.filter(x => x.dimension !== dim)
    
    if (dim === '共情中立性' && s.score > 75) {
      const critical = others.find(x => x.dimension === '批判性思维')
      if (critical && critical.score < s.score - 10) {
        insights[dim] = '你比自己认为的更感性——你的共情得分比批判性思维高12分，这可能让你在需要客观分析时过度受他人影响'
      }
    }
    
    if (dim === '逻辑严谨性' && s.score > 70) {
      const empathy = others.find(x => x.dimension === '共情中立性')
      if (empathy && empathy.score < s.score - 15) {
        insights[dim] = '你是一个偏理性的人——逻辑得分显著高于共情得分，这意味着你可能倾向于用逻辑框架而非情感理解来处理问题'
      }
    }
    
    if (dim === '知识精确性' && s.score < 70) {
      insights[dim] = '你可能低估了自己的知识储备——精确性得分低不一定意味着知识少，也可能说明你更关注概念的灵活运用而非死记硬背'
    }
    
    if (dim === '批判性思维' && s.score > 80) {
      const depth = others.find(x => x.dimension === '思维深度')
      if (depth && depth.score < s.score - 10) {
        insights[dim] = '你的批判意识很强，但有时可能批判过度——你的批判性思维得分比思维深度高，这可能让你难以对复杂问题保持耐心'
      }
    }
    
    if (dim === '思维深度' && s.score < 65) {
      insights[dim] = '快速决策是你的优势，但也可能是陷阱——深度思考需要时间，如果你总是"立刻有答案"，可能错过最重要的洞察'
    }
    
    if (dim === '融会贯通' && s.score < 70) {
      insights[dim] = '专注力是你需要保护的资产——融会贯通能力弱可能是因为你的知识体系太专精，这是优势也是局限'
    }
    
    if (dim === '价值判断力' && s.score > 75) {
      const empathy = others.find(x => x.dimension === '共情中立性')
      if (empathy && empathy.score < s.score - 10) {
        insights[dim] = '你的价值判断果断而坚定——但这也可能让你在面对多元价值观时显得不够开放'
      }
    }
    
    // Default insight if none generated
    if (!insights[dim]) {
      if (s.score >= 75) {
        insights[dim] = `${dim}是你认知体系中的支柱之一，保持发挥`
      } else if (s.score >= 60) {
        insights[dim] = `${dim}有提升空间，但不必焦虑——这是可以随着刻意练习改善的`
      } else {
        insights[dim] = `${dim}的短板效应可能在关键决策时显现，值得重点关注`
      }
    }
  })
  
  return insights
}

// Calculate dimension scores from quiz answers
export function calculateDimensionScores(
  answers: Record<string, number | string>,
  questions: Question[]
): DimensionScore[] {
  // Group questions by dimension
  const dimensionQuestions: Record<Dimension, Question[]> = {
    '价值判断力': [],
    '逻辑严谨性': [],
    '共情中立性': [],
    '知识精确性': [],
    '批判性思维': [],
    '思维深度': [],
    '融会贯通': [],
  }

  questions.forEach(q => {
    if (dimensionQuestions[q.dimension]) {
      dimensionQuestions[q.dimension].push(q)
    }
  })

  // Calculate score for each dimension
  const scores: DimensionScore[] = []

  for (const [dimension, dQuestions] of Object.entries(dimensionQuestions)) {
    if (dQuestions.length === 0) continue

    let totalScore = 0
    let maxScore = 0
    let answeredCount = 0

    dQuestions.forEach(q => {
      const answer = answers[q.id]
      if (answer !== undefined) {
        const answerIndex = typeof answer === 'number' ? answer : parseInt(String(answer))
        if (!isNaN(answerIndex) && q.options[answerIndex]) {
          totalScore += q.options[answerIndex].score
          maxScore += 5 // Max score per question is 5
          answeredCount++
        }
      }
    })

    if (answeredCount > 0) {
      // Normalize to 0-100 scale
      const normalizedScore = Math.round((totalScore / maxScore) * 100)
      // Confidence is based on how many questions were answered
      const confidence = Math.min(100, Math.round((answeredCount / dQuestions.length) * 100))

      scores.push({
        dimension: dimension as Dimension,
        score: normalizedScore,
        confidence
      })
    }
  }

  return scores
}

// Get overall score (weighted average)
export function getOverallScore(scores: DimensionScore[]): number {
  if (scores.length === 0) return 0
  const total = scores.reduce((sum, s) => sum + s.score, 0)
  return Math.round(total / scores.length)
}

// Get weaknesses (dimensions with low scores)
export function getWeaknesses(scores: DimensionScore[]): DimensionScore[] {
  return scores
    .filter(s => s.score < 65)
    .sort((a, b) => a.score - b.score)
}

// Get strengths (dimensions with high scores)
export function getStrengths(scores: DimensionScore[]): DimensionScore[] {
  return scores
    .filter(s => s.score >= 75)
    .sort((a, b) => b.score - a.score)
}

// Generate a summary text based on scores
export function generateSummary(scores: DimensionScore[]): string {
  const overall = getOverallScore(scores)
  const strengths = getStrengths(scores)
  const weaknesses = getWeaknesses(scores)

  let summary = `您的认知画像综合得分为 ${overall} 分。`

  if (strengths.length > 0) {
    const strengthNames = strengths.map(s => s.dimension).join('、')
    summary += ` 在${strengthNames}方面表现突出。`
  }

  if (weaknesses.length > 0) {
    const weaknessNames = weaknesses.map(w => w.dimension).join('、')
    summary += ` ${weaknessNames}方面有较大提升空间。`
  }

  return summary
}

// Dimension descriptions for profile page
export const dimensionDescriptions: Record<Dimension, { high: string; medium: string; low: string }> = {
  '价值判断力': {
    high: '您的价值判断清晰且一致，能够在复杂情境中做出合理选择',
    medium: '价值判断能力良好，但面对冲突价值时可能需要更多考量',
    low: '建议加强对不同价值观体系的学习和理解'
  },
  '逻辑严谨性': {
    high: '您的逻辑推理严密，能够准确识别论证中的前提和结论',
    medium: '逻辑思维基本扎实，但偶有忽略隐含前提的情况',
    low: '建议练习形式逻辑和分析复杂论证结构'
  },
  '共情中立性': {
    high: '您能够较好地理解不同立场，并保持客观中立的分析',
    medium: '共情能力不错，但有时可能被情感带偏',
    low: '建议更多关注认知偏误和情绪对判断的影响'
  },
  '知识精确性': {
    high: '您对核心概念的理解准确，能够区分相似概念',
    medium: '基础知识扎实，但细节理解还有提升空间',
    low: '建议回顾关键概念的精确定义和边界条件'
  },
  '批判性思维': {
    high: '您具备良好的批判性思维，能够评估论证质量',
    medium: '批判意识不错，但有时可能批判过度或不足',
    low: '建议系统学习批判性思维的方法论'
  },
  '思维深度': {
    high: '您能够深入思考问题，挖掘本质',
    medium: '思维有一定深度，但面对复杂问题时可能表面化',
    low: '建议多进行深度阅读和反思性写作练习'
  },
  '融会贯通': {
    high: '您能够将不同领域知识整合应用',
    medium: '知识整合能力良好，但跨领域迁移还有空间',
    low: '建议刻意练习知识联结和类比思考'
  }
}

// Weakness suggestions
export const weaknessSuggestions: Record<Dimension, string[]> = {
  '价值判断力': [
    '学习伦理学基础知识，了解不同价值观体系',
    '练习在冲突情境中进行价值排序',
    '阅读经典的价值判断案例'
  ],
  '逻辑严谨性': [
    '学习形式逻辑基础（前提、结论、推理链条）',
    '练习识别常见逻辑谬误',
    '在日常讨论中注意验证推理过程'
  ],
  '共情中立性': [
    '刻意练习从反对者角度思考问题',
    '了解认知偏误如何影响判断',
    '培养"暂时悬置判断"的能力'
  ],
  '知识精确性': [
    '制作概念对比表，明确区分相似术语',
    '追问"这个概念的边界是什么"',
    '学习该领域的元理论'
  ],
  '批判性思维': [
    '学习批判性思维的系统方法论',
    '练习评估信息来源的可靠性',
    '养成"反直觉思考"的习惯'
  ],
  '思维深度': [
    '每天进行15分钟反思性写作',
    '学习苏格拉底式提问法',
    '对复杂问题追问5个"为什么"'
  ],
  '融会贯通': [
    '跨领域阅读，刻意寻找联系',
    '练习用其他领域的框架解释现象',
    '培养"第一性原理"思维'
  ]
}

// Recommended resources for weaknesses
export const weaknessResources: Record<Dimension, string[]> = {
  '价值判断力': ['《伦理学与生活》- 雅克·蒂洛', '《价值的archy》- 麦金泰尔'],
  '逻辑严谨性': ['《逻辑学导论》- 欧文·柯匹', '《清醒思考的艺术》- 罗尔夫·多贝里'],
  '共情中立性': ['《思考，快与慢》- 丹尼尔·卡尼曼', '《学会提问》- 尼尔·布朗'],
  '知识精确性': ['《认知心理学》- E. Goldstein', '《知识与理解》- 奥斯汀'],
  '批判性思维': ['《批判性思维工具》- 理查德·保罗', '《思辨与立场》- 弗雷德'],
  '思维深度': ['《深度思考》- 香特伯格', '《从为什么开始》- 西蒙·斯涅克'],
  '融会贯通': ['《穷查理宝典》- 查理·芒格', '《范围》- 大卫·爱泼斯坦']
}