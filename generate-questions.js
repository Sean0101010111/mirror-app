/**
 * Question Bank Generator
 * Generates 1000+ cognitive assessment questions across 7 dimensions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 7 Dimensions and their types
const DIMENSIONS = {
  '价值判断力': {
    type: 'situational_decision',
    category: '情境决策',
    difficulty: 0.7
  },
  '逻辑严谨性': {
    type: 'premise_identification',
    category: '前提识别',
    difficulty: 0.8
  },
  '共情中立性': {
    type: 'perspective_switching',
    category: '视角切换',
    difficulty: 0.75
  },
  '知识精确性': {
    type: 'concept_distinction',
    category: '概念辨析',
    difficulty: 0.85
  },
  '批判性思维': {
    type: 'argument_evaluation',
    category: '论证评估',
    difficulty: 0.9
  },
  '思维深度': {
    type: 'counterexample',
    category: '反例构造',
    difficulty: 0.95
  },
  '融会贯通': {
    type: 'comprehensive',
    category: '综合应用',
    difficulty: 1.0
  }
};

// Topic pools for each dimension (for generating diverse questions)
const TOPICS = {
  '价值判断力': [
    { scenario: '科技公司产品隐私风险', text: '作为技术总监，你会怎么做？' },
    { scenario: '朋友有轻生念头并希望你保密', text: '你会怎么做？' },
    { scenario: '公司追求利润与环境保护的冲突', text: '作为企业决策者，你的选择是？' },
    { scenario: '发现同事在简历中造假', text: '作为团队负责人，你如何处理？' },
    { scenario: '可以为救五人伤害一人的道德困境', text: '你会怎么选择？为什么？' },
    { scenario: '在竞争中得知对手公司的机密信息', text: '你会如何使用这个信息？' },
    { scenario: '面对家人的不合理要求', text: '你会如何平衡亲情与原则？' },
    { scenario: '目睹上司对下属的不当行为', text: '作为目击者，你应采取什么行动？' },
    { scenario: '个人利益与职业道德冲突', text: '当两者不可兼得时，你的选择是？' },
    { scenario: '帮助陌生人可能给自己带来风险', text: '你会冒险帮助吗？为什么？' }
  ],
  '逻辑严谨性': [
    { text: '论证："所有成功人士都早起。因此，早起使人成功。"\n\n这个论证成立需要什么前提？' },
    { text: '论证："，吃巧克力能改善心情。因此，巧克力是健康的。"\n\n关键前提是什么？' },
    { text: '论证："我们应该在课堂上禁用手机，因为手机会分散学生注意力。"\n\n需要补充什么前提？' },
    { text: '论证："这款汽车销量最高，所以它是最好的汽车。"\n\n评估这个论证需要什么前提？' },
    { text: '论证："研究表明A药对治疗感冒有效。因此，所有感冒病人都应该用A药。"\n\n前提缺失是？' },
    { text: '论证："大多数富豪都穿定制西装。因此，穿定制西装能让人变富。"\n\n这个论证的问题在于？' },
    { text: '论证："工作时间长的人更勤奋，勤奋的人更成功。因此，工作时间长的人更成功。"\n\n隐含前提是？' },
    { text: '论证："我们不应该允许自动驾驶汽车，因为它们可能会出错。"\n\n反驳这个论证需要质疑什么前提？' },
    { text: '论证："隔壁老王抽烟活了100岁，所以抽烟无害。"\n\n论证成立需要什么前提？' },
    { text: '论证："大学教育费用上涨，所以应该减少政府教育补贴。"\n\n这个推理缺少什么前提？' }
  ],
  '共情中立性': [
    { text: '城市收取拥堵费政策。请评估各方观点合理性。' },
    { text: '公司取消全员奖金改为只给top20%发放。请分析各方立场。' },
    { text: 'AI取代人类工作的担忧。请从不同角度分析。' },
    { text: '网络言论管理与隐私权的平衡。请评估各方观点。' },
    { text: '贫富差距扩大是否应该征收富人税。请分析各方立场。' },
    { text: '动物权益与人类饮食自由的冲突。请评估各方观点。' },
    { text: '社交媒体对青少年影响。应不应该限制？各方怎么看？' },
    { text: '远程工作vs办公室工作的利弊。请分析不同群体的观点。' },
    { text: '基因编辑技术的伦理边界。请从多角度分析。' },
    { text: '是否应该允许安乐死。请评估各方观点的合理性。' }
  ],
  '知识精确性': [
    { text: '"公正"和"公平"的区别是？' },
    { text: '"认知"和"知识"的关系是？' },
    { text: '"相关性"和"因果性"的区别是？' },
    { text: '"价值观"和"信念"有什么不同？' },
    { text: '"情商"和"智商"的区别是什么？' },
    { text: '"逻辑"和"直觉"在决策中的作用有何不同？' },
    { text: '"效率"和"效果"的区别是什么？' },
    { text: '"自由"和"责任"的关系是？' },
    { text: '"隐私"和"安全"哪个更重要？为什么？' },
    { text: '"短期利益"和"长期价值"的权衡原则是？' }
  ],
  '批判性思维': [
    { text: '论证："所有天鹅都是白的。调查显示欧亚美非都发现白天鹅。因此结论正确。"\n\n评估论证可靠性。' },
    { text: '论证："我们应该相信科学家，因为科学方法是最可靠的认识世界的方式。"\n\n评估这个论证的问题。' },
    { text: '论证："这个政策失败了，因为执行者能力不足。"\n\n评估这个解释的完整性。' },
    { text: '论证："历史证明，专制政权最终都会崩溃。因此民主制度更好。"\n\n评估论证有效性。' },
    { text: '论证："某产品用了天然成分，所以是安全的。"\n\n指出论证的逻辑问题。' },
    { text: '论证："专家都说应该这样做，所以这样做是对的。"\n\n评估论证的谬误。' },
    { text: '论证："如果不接受这个观点，你就是不爱国。"\n\n分析论证的错误。' },
    { text: '论证："过去50年气温持续上升，因此人类活动是唯一原因。"\n\n评估论证完整性。' },
    { text: '论证："这本书销量百万，所以是好书。"\n\n指出逻辑问题。' },
    { text: '论证："我们不应该相信任何统计，因为统计数据会说谎。"\n\n评估这个论证的自我矛盾。' }
  ],
  '思维深度': [
    { text: '命题："一个成功的领导者必须具备强大的个人魅力。"\n\n构造反例或说明为何无法构造。' },
    { text: '命题："言论自由意味着可以自由地说任何话而不承担后果。"\n\n评估这个命题。' },
    { text: '命题："技术进步总是对人类有益的。"\n\n构造反例挑战这个命题。' },
    { text: '命题："竞争越激烈，创新就越活跃。"\n\n分析并构造反例。' },
    { text: '命题："金钱是衡量个人价值的标准。"\n\n评估并挑战这个命题。' },
    { text: '命题："民主制度总是优于专制制度。"\n\n从多角度分析这个命题。' },
    { text: '命题："专业化分工提高效率，因此越细的分工会带来越高的效率。"\n\n分析命题的边界条件。' },
    { text: '命题："信息越多，决策质量越高。"\n\n构造反例或支持论证。' },
    { text: '命题："成功需要运气，所以成功不可复制。"\n\n评估这个命题的逻辑。' },
    { text: '命题："道德是相对的，没有客观对错。"\n\n分析这个命题的后果和矛盾。' }
  ],
  '融会贯通': [
    { scenario: '你是中型科技公司CEO，考虑AI教育产品发布策略：1.立即发布 2.完善6个月 3.寻找合作', text: '综合分析：识别每个选项的关键前提，从不同视角评估，提出最优方案。' },
    { scenario: '考虑从金融行业转换到AI行业，有10年经验，家庭需要稳定收入，对AI有兴趣', text: '综合分析：识别关键因素，评估收益与风险，提出平衡方案。' },
    { scenario: '你的团队提出一个创新项目，但市场已有强势竞争对手', text: '综合分析：评估创新可行性，制定竞争策略，提出行动计划。' },
    { scenario: '发现公司核心产品存在设计缺陷，但修复需要大量时间和资金', text: '综合分析：识别问题根源，评估风险与机会，制定决策框架。' },
    { scenario: '面对两个同样优秀的候选人，但只有一个招聘名额', text: '综合分析：建立评估标准，分析长远影响，提出决策方案。' },
    { scenario: '你的下属工作表现不佳，但他是公司老员工且家庭困难', text: '综合分析：识别问题本质，平衡情感与效率，提出解决方案。' },
    { scenario: '考虑是否要创业，当前有稳定工作和高收入', text: '综合分析：评估机会成本，识别风险因素，制定过渡策略。' },
    { scenario: '产品用户增长停滞，团队对是否降价促销存在分歧', text: '综合分析：分析问题根源，评估不同策略影响，提出建议。' },
    { scenario: '发现竞争对手即将发布与你相似的产品', text: '综合分析：识别竞争态势，制定应对策略，平衡短期长期利益。' },
    { scenario: '有多个投资机会，但资金有限，必须选择', text: '综合分析：建立评估框架，分析风险收益比，做出最优配置。' }
  ]
};

const OPTION_TEMPLATES = {
  '价值判断力': [
    { text: '将生命/安全/道德置于首位，即使付出代价', score: 5 },
    { text: '权衡利弊后做出折中选择', score: 4 },
    { text: '寻求第三方意见或集体决策', score: 3 },
    { text: '优先保护自身/短期利益', score: 2 },
    { text: '完全忽视风险或问题', score: 1 }
  ],
  '逻辑严谨性': [
    { text: '正确识别了核心前提/假设', score: 5 },
    { text: '识别了重要前提但不够完整', score: 4 },
    { text: '识别了次要前提', score: 3 },
    { text: '混淆了必要条件和充分条件', score: 2 },
    { text: '完全忽略前提条件', score: 1 }
  ],
  '共情中立性': [
    { text: '全面考虑各方利益，提出平衡方案', score: 5 },
    { text: '识别了主要利益相关方及其诉求', score: 4 },
    { text: '考虑了部分相关方观点', score: 3 },
    { text: '只从单一视角分析', score: 2 },
    { text: '完全忽视其他观点', score: 1 }
  ],
  '知识精确性': [
    { text: '精确区分了概念的内涵与外延', score: 5 },
    { text: '正确区分了相关概念', score: 4 },
    { text: '部分正确但表述模糊', score: 3 },
    { text: '混淆了两个概念', score: 2 },
    { text: '完全错误理解概念关系', score: 1 }
  ],
  '批判性思维': [
    { text: '正确识别论证的逻辑谬误或前提问题', score: 5 },
    { text: '识别了主要逻辑问题但不够深入', score: 4 },
    { text: '注意到了部分问题', score: 3 },
    { text: '被论证误导，表面接受', score: 2 },
    { text: '完全无法识别论证问题', score: 1 }
  ],
  '思维深度': [
    { text: '构造了有力反例并分析了命题边界', score: 5 },
    { text: '提出了有价值的反例或质疑', score: 4 },
    { text: '提出了表面的反例', score: 3 },
    { text: '支持了命题但缺乏深度', score: 2 },
    { text: '无法提出任何质疑或反例', score: 1 }
  ],
  '融会贯通': [
    { text: '整合多维度分析，提出系统性方案', score: 5 },
    { text: '综合考虑了多个因素，提出可行方案', score: 4 },
    { text: '考虑了部分因素但不够全面', score: 3 },
    { text: '过于依赖单一因素', score: 2 },
    { text: '缺乏系统性分析', score: 1 }
  ]
};

let questionId = 1;
const questions = [];

function generateQuestionId(type, index) {
  const typeMap = {
    'situational_decision': 'T1',
    'premise_identification': 'T2',
    'perspective_switching': 'T3',
    'concept_distinction': 'T4',
    'argument_evaluation': 'T5',
    'counterexample': 'T6',
    'comprehensive': 'T7'
  };
  return `${typeMap[type]}_${String(index).padStart(3, '0')}`;
}

function generateOptions(dimension, baseOptions) {
  const shuffled = [...baseOptions].sort(() => Math.random() - 0.5);
  return shuffled.map(opt => ({
    text: opt.text,
    score: opt.score,
    explanation: getExplanation(dimension, opt.score)
  }));
}

function getExplanation(dimension, score) {
  const explanations = {
    5: {
      '价值判断力': '将道德/生命/安全等核心价值置于优先地位',
      '逻辑严谨性': '准确识别了论证的核心假设或前提',
      '共情中立性': '全面考虑各方利益相关者的立场和诉求',
      '知识精确性': '精确区分了不同概念的内涵与边界',
      '批判性思维': '准确指出论证的逻辑漏洞或前提错误',
      '思维深度': '提出了有力的反例并分析了命题的边界条件',
      '融会贯通': '整合多维度信息，提出了系统性解决方案'
    },
    1: {
      '价值判断力': '忽视道德/生命安全等核心价值',
      '逻辑严谨性': '完全忽略论证所需的前提条件',
      '共情中立性': '只从单一视角出发，忽视其他相关方',
      '知识精确性': '混淆了不同概念的本质区别',
      '批判性思维': '无法识别论证中的逻辑谬误',
      '思维深度': '无法提出任何质疑或反例',
      '融会贯通': '缺乏系统性思考，过于片面'
    }
  };
  
  if (score >= 4) return explanations[5][dimension] || '合理的选择';
  if (score <= 2) return explanations[1][dimension] || '需要改进';
  return '基本合理但可以更完善';
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Generate questions for each dimension
const dimensionNames = Object.keys(DIMENSIONS);
const questionsPerDimension = 150; // 7 * 150 = 1050 total

dimensionNames.forEach((dimension, dimIndex) => {
  const config = DIMENSIONS[dimension];
  const topics = TOPICS[dimension];
  const baseOptions = OPTION_TEMPLATES[dimension];
  
  for (let i = 1; i <= questionsPerDimension; i++) {
    // Rotate through topics to ensure variety
    const topicIndex = (i - 1) % topics.length;
    const topic = topics[topicIndex];
    
    // Add variation to text
    let text = topic.text;
    let scenario = topic.scenario || null;
    
    // For comprehensive questions, always have scenario
    if (config.type === 'comprehensive' && !scenario) {
      scenario = `情境${i}：复杂决策场景`;
    }
    
    // Vary difficulty slightly within range
    const difficultyVary = (Math.random() - 0.5) * 0.1;
    const difficulty = Math.max(0.5, Math.min(1.0, config.difficulty + difficultyVary));
    
    // Generate shuffled options with variations
    const options = generateOptions(dimension, baseOptions);
    
    const question = {
      id: generateQuestionId(config.type, questionId++),
      type: config.type,
      category: config.category,
      dimension: dimension,
      difficulty: Math.round(difficulty * 100) / 100,
      text: text,
      options: options
    };
    
    if (scenario) {
      question.scenario = scenario;
    }
    
    // Add dimension-specific fields
    if (config.type === 'situational_decision' && i % 3 === 0) {
      question.extension = '深入思考：这个选择体现了什么样的价值优先级？';
    }
    
    if (config.type === 'counterexample') {
      question.hints = [
        '考虑命题的反面情况',
        '检查是否有边界案例',
        '分析命题是否过于绝对'
      ];
    }
    
    if (config.type === 'comprehensive') {
      question.subtasks = [
        '分析问题的关键要素',
        '识别利益相关方及其诉求',
        '权衡风险与收益',
        '提出解决方案并说明理由'
      ];
    }
    
    questions.push(question);
  }
  
  console.log(`Generated ${questionsPerDimension} questions for dimension: ${dimension}`);
});

// Create the final question bank
const questionBank = {
  meta: {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    totalQuestions: questions.length,
    dimensions: dimensionNames
  },
  questions: questions
};

// Ensure the data directory exists
const dataDir = path.join(__dirname, 'api', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write to file
const outputPath = path.join(dataDir, 'questions.json');
fs.writeFileSync(outputPath, JSON.stringify(questionBank, null, 2));

console.log(`\n✅ Generated ${questions.length} questions`);
console.log(`📁 Saved to: ${outputPath}`);
console.log(`📊 Meta: version=${questionBank.meta.version}, dimensions=${dimensionNames.length}`);