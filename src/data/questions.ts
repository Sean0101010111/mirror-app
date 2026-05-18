import type { Question } from '../lib/types'

// Complete question bank with all 7 types
export const questionBank: Question[] = [
  // ========== T1: 情境决策题 ==========
  {
    id: 'T1_001',
    type: 'situational_decision',
    category: '情境决策',
    dimension: '价值判断力',
    difficulty: 0.7,
    scenario: '你是一家科技公司的技术总监，公司正在开发一款AI产品。项目临近上线时，发现产品存在一个潜在的隐私泄露风险，但修复这个问题需要推迟上线2周，可能损失大量用户和投资。',
    text: '作为技术总监，你会怎么做？',
    extension: '如果你选择了"修复后上线"，请思考：这是否意味着用户隐私比商业利益更重要？为什么？',
    options: [
      { text: '立即修复问题，推迟上线，即使损失用户和投资', score: 5, explanation: '将用户隐私置于商业利益之上' },
      { text: '先上线密切监控，发现问题再紧急修复', score: 2, explanation: '侥幸心理，风险较大' },
      { text: '召开董事会讨论，让决策层决定', score: 3, explanation: '推卸责任，但也不失为一种做法' },
      { text: '评估风险程度，如果风险可控则先上线', score: 4, explanation: '理性评估后再决策' },
    ]
  },
  {
    id: 'T1_002',
    type: 'situational_decision',
    category: '情境决策',
    dimension: '价值判断力',
    difficulty: 0.7,
    scenario: '你的朋友向你倾诉他最近因为工作压力而产生了轻生的念头，并希望你不要告诉任何人。',
    text: '你会怎么做？',
    options: [
      { text: '承诺保密，并尝试自己帮助他', score: 1, explanation: '这可能让情况更危险' },
      { text: '暂时保密，但密切关注的他的状态', score: 2, explanation: '仍有风险，但你尝试了' },
      { text: '告诉他的家人，哪怕违背承诺', score: 5, explanation: '生命优先于承诺' },
      { text: '建议他寻求专业心理帮助', score: 4, explanation: '合理的建议，但可能不够' },
    ]
  },

  // ========== T2: 前提识别题 ==========
  {
    id: 'T2_001',
    type: 'premise_identification',
    category: '前提识别',
    dimension: '逻辑严谨性',
    difficulty: 0.8,
    text: '论证："我们应该禁止所有形式的网络匿名发言，因为网络匿名导致了太多网络暴力。"\n\n这个论证成立需要以下哪个前提？',
    options: [
      { text: '网络暴力都是匿名的', score: 3, explanation: '隐含假设：匿名是网络暴力的充分条件' },
      { text: '禁止匿名就能减少网络暴力', score: 4, explanation: '核心假设：措施能达到目的' },
      { text: '网络匿名没有任何正面价值', score: 2, explanation: '过于极端' },
      { text: '所有发达国家都禁止网络匿名', score: 1, explanation: '诉诸权威/从众' },
    ]
  },
  {
    id: 'T2_002',
    type: 'premise_identification',
    category: '前提识别',
    dimension: '逻辑严谨性',
    difficulty: 0.8,
    text: '论证："研究表明，喝红酒的人普遍比不喝红酒的人更健康。因此，喝红酒让人更健康。"\n\n这个论证的关键前提是什么？',
    options: [
      { text: '研究样本足够大且具有代表性', score: 4, explanation: '研究有效性的前提' },
      { text: 'correlation implies causation', score: 1, explanation: '这是错误假设' },
      { text: '所有红酒的健康成分都一样', score: 2, explanation: '不必要的前提' },
      { text: '不喝红酒的人都不关心健康', score: 1, explanation: '无关前提' },
    ]
  },

  // ========== T3: 视角切换题 ==========
  {
    id: 'T3_001',
    type: 'perspective_switching',
    category: '视角切换',
    dimension: '共情中立性',
    difficulty: 0.75,
    text: '某城市为了缓解交通拥堵，宣布对进入中心城区的车辆征收"拥堵费"。\n\n请评估以下各方的观点：',
    options: [
      { text: '支持方：价格机制可以有效调节需求，减少拥堵', score: 4, explanation: '经济学视角，有一定道理' },
      { text: '反对方：这是对低收入群体的不公平惩罚', score: 4, explanation: '社会公平视角，值得考虑' },
      { text: '中立方：需要配套公共交通改善，否则只是劫富济贫', score: 5, explanation: '系统思维，全面考虑' },
      { text: '实用方：看看其他城市的效果再决定', score: 3, explanation: '经验主义，但可能过于保守' },
    ]
  },
  {
    id: 'T3_002',
    type: 'perspective_switching',
    category: '视角切换',
    dimension: '共情中立性',
    difficulty: 0.75,
    text: '一家公司宣布取消全员绩效奖金，改为只给 top 20% 的员工发放高额奖金。\n\n请评估各方观点的合理性（1-5分）：',
    options: [
      { text: '管理层：激励最优秀的员工，创造差异化优势', score: 4 },
      { text: '普通员工：这是对大多数人的不公平对待', score: 3 },
      { text: 'HR专家：这可能导致团队协作精神崩塌', score: 4 },
      { text: '股东：提高效率，符合股东利益', score: 3 },
    ]
  },

  // ========== T4: 概念辨析题 ==========
  {
    id: 'T4_001',
    type: 'concept_distinction',
    category: '概念辨析',
    dimension: '知识精确性',
    difficulty: 0.85,
    text: '"公正"和"公平"这两个概念：\n\n请选择对两者关系的理解：',
    options: [
      { text: '它们是同一个概念，可以互换使用', score: 1, explanation: '错误：两者有微妙区别' },
      { text: '公正是"程序上的一致性"，公平时"结果上的一致性"', score: 5, explanation: '正确：程序正义 vs 实质正义' },
      { text: '公正比公平更重要', score: 2, explanation: '价值判断，非概念辨析' },
      { text: '两者都属于道德哲学概念，无实际区别', score: 2, explanation: '过于模糊' },
    ]
  },
  {
    id: 'T4_002',
    type: 'concept_distinction',
    category: '概念辨析',
    dimension: '知识精确性',
    difficulty: 0.85,
    text: '"认知"和"知识"的关系是：',
    options: [
      { text: '认知是获取知识的过程，知识是认知的结果', score: 5, explanation: '正确区分了动态与静态' },
      { text: '认知就是知识，两者无区别', score: 1, explanation: '混淆过程与结果' },
      { text: '知识比认知更重要', score: 2, explanation: '价值判断而非概念辨析' },
      { text: '认知是主观的，知识是客观的', score: 3, explanation: '部分正确，但不完整' },
    ]
  },

  // ========== T5: 论证评估题 ==========
  {
    id: 'T5_001',
    type: 'argument_evaluation',
    category: '论证评估',
    dimension: '批判性思维',
    difficulty: 0.9,
    text: '以下是一个完整的论证：\n\n"所有天鹅都是白的。经过实地调查，我们在欧洲、亚洲、美洲、非洲都发现了白天鹅。因此，这个结论是正确的。"\n\n请评估这个论证的可靠性：',
    options: [
      { text: '非常可靠 — 有实地调查支持', score: 1, explanation: '忽略了黑天鹅的存在（归纳谬误）' },
      { text: '较可靠 — 样本覆盖多个大洲', score: 2, explanation: '样本仍然不够全面' },
      { text: '不可靠 — 归纳推理不能得出绝对结论', score: 5, explanation: '正确：归纳法无法得出必然结论' },
      { text: '需要更多样本才能判断', score: 3, explanation: '谨慎但未指出核心问题' },
    ]
  },
  {
    id: 'T5_002',
    type: 'argument_evaluation',
    category: '论证评估',
    dimension: '批判性思维',
    difficulty: 0.9,
    text: '论证："我们应该相信科学家，因为科学方法是最可靠的认识世界的方式。"\n\n请评估这个论证的问题：',
    options: [
      { text: '没有问题，科学家确实最可信', score: 1, explanation: '循环论证：用科学证明科学的可靠性' },
      { text: '问题在于"科学方法"本身可能有问题', score: 2, explanation: '过于相对主义' },
      { text: '问题在于：科学方法的可靠性需要用非科学方式来证明', score: 5, explanation: '正确指出了循环论证的问题' },
      { text: '问题是科学家也是人，会有偏见', score: 3, explanation: '有一定道理但未指出论证核心缺陷' },
    ]
  },

  // ========== T6: 反例构造题 ==========
  {
    id: 'T6_001',
    type: 'counterexample',
    category: '反例构造',
    dimension: '思维深度',
    difficulty: 0.95,
    text: '命题："一个成功的领导者必须具备强大的个人魅力。"\n\n请分析这个命题，并构造一个反例或说明为何无法构造：',
    options: [
      { text: '这个命题是正确的，不需要反例', score: 1 },
      { text: '反例：某些技术型领导者（如张一鸣）更依赖专业能力而非个人魅力', score: 5, explanation: '成功挑战了命题' },
      { text: '无法构造反例，因为"成功"和"领导力"都难以定义', score: 2, explanation: '过度相对主义' },
      { text: '反例：马云的个人魅力很强但公司治理有问题', score: 2, explanation: '混淆了个人魅力与领导力' },
    ]
  },
  {
    id: 'T6_002',
    type: 'counterexample',
    category: '反例构造',
    dimension: '思维深度',
    difficulty: 0.95,
    text: '命题："言论自由意味着一个人可以自由地说任何话，而不必承担任何后果。"\n\n请评估这个命题：',
    options: [
      { text: '正确，言论自由是绝对权利', score: 1 },
      { text: '错误：言论自由不保护诽谤、威胁等行为的后果', score: 5, explanation: '正确区分了权利与责任' },
      { text: '错误：言论自由需要与他人权利平衡', score: 4, explanation: '也是正确的视角' },
      { text: '命题本身矛盾，无法判断', score: 2, explanation: '过于悲观' },
    ]
  },

  // ========== T7: 综合应用题 ==========
  {
    id: 'T7_001',
    type: 'comprehensive',
    category: '综合应用',
    dimension: '融会贯通',
    difficulty: 1.0,
    scenario: '你是一家中型科技公司的CEO，公司正在开发一款AI教育产品。市场上已有强势竞争对手，但您的团队相信自己的产品有明显技术优势。\n\n公司面临以下决策：\n1. 立即发布产品抢占市场先机\n2. 继续完善产品6个月后再发布\n3. 寻找战略合作伙伴共同推广\n\n每种选择都有其支持者和反对者。',
    text: '综合分析这个商业情境，你需要：\n① 识别每个选项成立所需的关键前提\n② 从不同利益相关方视角评估影响\n③ 选择最优方案并说明理由',
    subtasks: [
      '分析三个选项各自的优劣势',
      '识别每个选项的关键风险',
      '提出你的最终决策及理由'
    ],
    options: [
      { text: '选择①立即发布 — 市场窗口期重要，技术优势可以快速迭代', score: 3 },
      { text: '选择②继续完善 — 产品质量比速度更重要，打磨后再发布', score: 3 },
      { text: '选择③寻找合作 — 借助伙伴资源降低风险，加速市场渗透', score: 4 },
      { text: '综合方案：根据竞争态势动态调整，初期小规模试水再决定', score: 5, explanation: '整合性思维，灵活应对' },
    ]
  },
  {
    id: 'T7_002',
    type: 'comprehensive',
    category: '综合应用',
    dimension: '融会贯通',
    difficulty: 1.0,
    scenario: '你正在考虑是否要转换职业跑道，从現在の稳定的金融行业转到新兴的AI行业。\n\n当前情况：\n- 你在金融行业有10年经验，已经是中层管理者\n- AI行业对你的技能需求很高，但需要重新学习\n- 你的家庭需要稳定的收入\n- 你对AI有浓厚兴趣，但不确定能否成功',
    text: '请综合分析这个人生重大决策：',
    subtasks: [
      '识别你做这个决策需要考虑的关键因素',
      '评估每个选项的潜在收益与风险',
      '提出一个平衡各方需求的行动方案'
    ],
    options: [
      { text: '立即转型 — 趁年轻还有机会，勇敢追求兴趣', score: 2 },
      { text: '绝对不要转型 — 放弃10年积累太冒险', score: 2 },
      { text: '边工作边学习，先兼职了解AI行业再做决定', score: 4, explanation: '平衡风险与机会' },
      { text: '详细列出技能转移的可行性和时间表，量化分析后再决定', score: 5, explanation: '系统性分析' },
    ]
  }
]

// Get random questions for a quiz session
export function getRandomQuestions(count: number = 10): Question[] {
  const shuffled = [...questionBank].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// Get questions by type
export function getQuestionsByType(type: Question['type']): Question[] {
  return questionBank.filter(q => q.type === type)
}

// Get questions by dimension
export function getQuestionsByDimension(dimension: Question['dimension']): Question[] {
  return questionBank.filter(q => q.dimension === dimension)
}

// Get dimensions distribution in a set of questions
export function getDimensionDistribution(questions: Question[]): Record<string, number> {
  return questions.reduce((acc, q) => {
    acc[q.dimension] = (acc[q.dimension] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}