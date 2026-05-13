/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MEGA_SKILLS.JS — UNIFIED SKILL ENGINE FOR THE GREATEST AGENT EVER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 12 skills implementing core reasoning, creation, and analysis capabilities.
 * Each skill uses the brain for LLM-powered generation.
 * All skills respect the PLT framework (Profit + Love - Tax = True Value).
 * 
 * Created by: Craig Jones (Grand Code Pope)
 * PLT Press — Profit + Love - Tax = True Value
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use strict';

const { MEGA_IDENTITY, calculatePLTScore } = require('../identity/mega_identity.js');

// =============================================================================
// SKILLS ENGINE CLASS
// =============================================================================

class SkillsEngine {
    constructor(brain, memory) {
        this.brain = brain;
        this.memory = memory;
        this.stats = {
            invocations: 0,
            by_skill: {},
        };
        
        this.skill_registry = {
            reason_deep: {
                name: 'reason_deep',
                description: 'Multi-step reasoning with trace',
                plt_affinity: { profit: 0.4, love: 0.3, tax: 0.3 },
                weight: 0.9,
            },
            score_idea: {
                name: 'score_idea',
                description: 'PLT scoring of ideas',
                plt_affinity: { profit: 0.6, love: 0.2, tax: 0.2 },
                weight: 0.85,
            },
            write_production_code: {
                name: 'write_production_code',
                description: 'Code generation with error handling',
                plt_affinity: { profit: 0.7, love: 0.1, tax: 0.2 },
                weight: 0.9,
            },
            review_code: {
                name: 'review_code',
                description: 'Quality checks and critique',
                plt_affinity: { profit: 0.5, love: 0.2, tax: 0.3 },
                weight: 0.8,
            },
            generate_book_idea: {
                name: 'generate_book_idea',
                description: 'Book concept generation',
                plt_affinity: { profit: 0.4, love: 0.5, tax: 0.1 },
                weight: 0.75,
            },
            build_character: {
                name: 'build_character',
                description: 'Character profile creation',
                plt_affinity: { profit: 0.2, love: 0.6, tax: 0.2 },
                weight: 0.7,
            },
            research_topic: {
                name: 'research_topic',
                description: 'Structured research and findings',
                plt_affinity: { profit: 0.5, love: 0.3, tax: 0.2 },
                weight: 0.8,
            },
            suggest_next_step: {
                name: 'suggest_next_step',
                description: 'Action suggestions and prioritization',
                plt_affinity: { profit: 0.6, love: 0.2, tax: 0.2 },
                weight: 0.85,
            },
            internal_scorer: {
                name: 'internal_scorer',
                description: 'Self-reflection and deep questions',
                plt_affinity: { profit: 0.3, love: 0.4, tax: 0.3 },
                weight: 0.7,
            },
            detect_pattern: {
                name: 'detect_pattern',
                description: 'Pattern detection and anomalies',
                plt_affinity: { profit: 0.5, love: 0.2, tax: 0.3 },
                weight: 0.8,
            },
            consolidate_session: {
                name: 'consolidate_session',
                description: 'Session analysis and summary',
                plt_affinity: { profit: 0.4, love: 0.3, tax: 0.3 },
                weight: 0.75,
            },
            plt_field_report: {
                name: 'plt_field_report',
                description: 'PLT state report and recommendations',
                plt_affinity: { profit: 0.6, love: 0.3, tax: 0.1 },
                weight: 0.85,
            },
        };
    }
    
    // =========================================================================
    // INVOKE — Main skill dispatcher
    // =========================================================================
    
    async invoke(skillName, input) {
        const skill = this.skill_registry[skillName];
        if (!skill) {
            const available = Object.keys(this.skill_registry).join(', ');
            throw new Error(`Unknown skill: "${skillName}". Available: ${available}`);
        }
        
        this.stats.invocations++;
        this.stats.by_skill[skillName] = (this.stats.by_skill[skillName] || 0) + 1;
        
        if (this.memory) {
            await this.memory.witness({
                type: 'skill_invocation',
                weight: skill.weight,
                tags: ['skill', skillName, 'invoke'],
                content: `Skill ${skillName} invoked with input: ${JSON.stringify(input).slice(0, 100)}...`,
            });
        }
        
        const method = this['_skill_' + skillName];
        if (!method) {
            throw new Error(`Skill "${skillName}" has no implementation`);
        }
        
        return method.call(this, input);
    }
    
    // =========================================================================
    // LIST ALL SKILLS
    // =========================================================================
    
    listSkills() {
        return Object.values(this.skill_registry);
    }
    
    // =========================================================================
    // REASON_DEEP — Multi-step reasoning with trace
    // =========================================================================
    
    async _skill_reason_deep(input) {
        const question = typeof input === 'string' ? input : input.question;
        
        const prompt = `You are a deep reasoning engine. Break down this question into numbered reasoning steps.
Show your work. Trace the logic. Consider alternatives and objections.

Question: ${question}

Respond with:
1. Initial analysis (what is being asked)
2. Step-by-step reasoning (numbered 1, 2, 3...)
3. Alternative perspectives
4. Conclusion with confidence level

PLT note: Consider Profit + Love - Tax implications at each step.`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return this._parseStructuredResponse(response, 'reason_deep', { question });
    }
    
    // =========================================================================
    // SCORE_IDEA — PLT scoring
    // =========================================================================
    
    async _skill_score_idea(input) {
        const idea = typeof input === 'string' ? input : input.idea;
        
        const prompt = `Score this idea using the PLT framework (Profit + Love - Tax = True Value).

Analyze and score each dimension 0-1:
- Profit: How much does it earn, grow, or multiply value? (0=none, 1=massive)
- Love: How much does it serve people, create bonds, build connection? (0=none, 1=profound)
- Tax: What does it cost, risk, or require? (0=none, 1=extremely expensive)

Idea: ${idea}

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "idea": "the idea",
  "profit": 0.0-1.0,
  "love": 0.0-1.0,
  "tax": 0.0-1.0,
  "score": profit + love - tax,
  "true_value": "High/Medium/Low/None",
  "verdict": "proceed/evaluate/cancel",
  "reasoning": "1-2 sentences"
}`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return this._parseJSONResponse(response);
    }
    
    // =========================================================================
    // WRITE_PRODUCTION_CODE — Code generation
    // =========================================================================
    
    async _skill_write_production_code(input) {
        const language = input.language || 'javascript';
        const task = input.task || input;
        const constraints = input.constraints || 'Production-ready, includes error handling';
        
        const prompt = `You are a production code generator. Write complete, working code.

Language: ${language}
Task: ${task}
Requirements: ${constraints}

Include:
- Error handling (try/catch or equivalent)
- Input validation
- Clear function/variable names
- Comments for complex logic only (no unnecessary comments)
- No placeholder TODOs

Respond with ONLY code (no markdown code blocks, no explanation).`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return {
            skill: 'write_production_code',
            language,
            task,
            code: this._stripMarkdown(response),
            timestamp: Date.now(),
        };
    }
    
    // =========================================================================
    // REVIEW_CODE — Quality checks
    // =========================================================================
    
    async _skill_review_code(input) {
        const code = typeof input === 'string' ? input : input.code;
        const language = input.language || 'javascript';
        
        const prompt = `Review this ${language} code for production quality.

Check and score 0-10 each:
- Docstrings/Comments: Are public APIs documented?
- Error handling: Are exceptions caught and handled?
- Structure: Is the code well-organized?
- Security: Are there obvious vulnerabilities?
- Performance: Any obvious bottlenecks?

Code:
\`\`\`${language}
${code}
\`\`\`

Respond ONLY with valid JSON:
{
  "scores": {
    "docstrings": 0-10,
    "error_handling": 0-10,
    "structure": 0-10,
    "security": 0-10,
    "performance": 0-10
  },
  "total_score": 0-50,
  "issues": ["issue 1", "issue 2"],
  "recommendations": ["rec 1", "rec 2"],
  "verdict": "production_ready/needs_work/not_production"
}`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return this._parseJSONResponse(response);
    }
    
    // =========================================================================
    // GENERATE_BOOK_IDEA — Book concepts
    // =========================================================================
    
    async _skill_generate_book_idea(input) {
        const theme = typeof input === 'string' ? input : input.theme;
        
        const prompt = `Generate a compelling book concept around this theme: ${theme}

The PLT framework: Profit + Love - Tax = True Value.
Consider how your book embodies these three forces.

Respond ONLY with valid JSON:
{
  "title": "Book Title",
  "genre": "Genre",
  "logline": "One sentence hook",
  "tagline": "Short memorable line",
  "chapter_outline": ["Chapter 1: Name - brief description", ...],
  "target_audience": "Who reads this?",
  "plt_themes": {
    "profit": "How profit drive features",
    "love": "How connection/bonds feature",
    "tax": "What the costs/consequences are"
  },
  "unique_angle": "What makes THIS book different"
}`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return this._parseJSONResponse(response);
    }
    
    // =========================================================================
    // BUILD_CHARACTER — Character profiles
    // =========================================================================
    
    async _skill_build_character(input) {
        const role = typeof input === 'string' ? input : input.role;
        
        const prompt = `Build a compelling character profile for this role/concept: ${role}

The PLT framework (Profit + Love - Tax = True Value) should inform their motivations.

Respond ONLY with valid JSON:
{
  "name": "Character Name",
  "role": "Their purpose",
  "traits": ["trait 1", "trait 2", "trait 3", "trait 4"],
  "arc": "The change they undergo",
  "backstory": "Brief origin and history",
  "motivation": "What drives them",
  "flaw": "Their fatal weakness",
  "voice": "How they speak (2-3 example lines)"
}`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return this._parseJSONResponse(response);
    }
    
    // =========================================================================
    // RESEARCH_TOPIC — Structured research
    // =========================================================================
    
    async _skill_research_topic(input) {
        const topic = typeof input === 'string' ? input : input.topic;
        const depth = input.depth || 'standard';
        
        const prompt = `Research this topic thoroughly: ${topic}

Provide structured findings with key insights and implications.

Respond with:
## [SOURCE] Source Name
## [INSIGHT] Key Finding
## [IMPLICATION] What this means

Consider PLT implications: What can be earned? What bonds are formed? What costs exist?

Topic: ${topic}

Mark sources with [SOURCE], insights with [INSIGHT], implications with [IMPLICATION].`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return {
            skill: 'research_topic',
            topic,
            findings: response,
            timestamp: Date.now(),
        };
    }
    
    // =========================================================================
    // SUGGEST_NEXT_STEP — Action suggestions
    // =========================================================================
    
    async _skill_suggest_next_step(input) {
        const situation = typeof input === 'string' ? input : input.situation;
        const context = input.context || '';
        
        const prompt = `Based on this situation, suggest the top 3 prioritized next actions.

Prioritize by: Profit potential, Love served, Tax cost
Only suggest if the PLT score (profit + love - tax) is positive.

Situation: ${situation}
Context: ${context}

Respond ONLY with valid JSON:
{
  "situation": "the situation",
  "next_steps": [
    {
      "priority": 1,
      "action": "What to do",
      "why": "Why now",
      "profit_impact": "High/Medium/Low",
      "love_impact": "High/Medium/Low",
      "tax_cost": "High/Medium/Low",
      "plt_score": "positive/negative/neutral"
    },
    {...},
    {...}
  ],
  "recommended_first_step": "the action"
}`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return this._parseJSONResponse(response);
    }
    
    // =========================================================================
    // INTERNAL_SCORER — Self-reflection
    // =========================================================================
    
    async _skill_internal_scorer(input) {
        const action = typeof input === 'string' ? input : input.action;
        const outcome = input.outcome || '';
        
        const prompt = `Reflect deeply on this action/outcome. Ask the hard questions.

Action: ${action}
Outcome: ${outcome || 'Not yet known'}

Ask yourself:
- What did I actually intend vs. what happened?
- Who was served? Who was cost?
- What patterns does this reveal?
- What would I do differently?

Respond with:
## Reflection Points (numbered)
## Hard Questions (3-5 probing questions)
## Alignment Assessment (aligned/misaligned/neutral)
## Growth Edge (what to develop)`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return {
            skill: 'internal_scorer',
            action,
            outcome,
            reflection: response,
            timestamp: Date.now(),
        };
    }
    
    // =========================================================================
    // DETECT_PATTERN — Pattern detection
    // =========================================================================
    
    async _skill_detect_pattern(input) {
        const text = typeof input === 'string' ? input : input.text;
        const data = input.data || '';
        
        const prompt = `Analyze this text/data for recurring patterns and anomalies.

PLT framework: Profit + Love - Tax = True Value
Look for patterns in how value is created, bonds are formed, costs are hidden.

Input:
${text}
${data ? '\nData:\n' + data : ''}

Respond ONLY with valid JSON:
{
  "patterns": [
    {
      "name": "pattern name",
      "description": "what it is",
      "frequency": "how often seen",
      "plt_implication": "profit/love/tax impact"
    }
  ],
  "anomalies": [
    {
      "name": "anomaly name",
      "description": "what's unusual",
      "significance": "why it matters"
    }
  ],
  "summary": "overall assessment"
}`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return this._parseJSONResponse(response);
    }
    
    // =========================================================================
    // CONSOLIDATE_SESSION — Session analysis
    // =========================================================================
    
    async _skill_consolidate_session(input) {
        const sessionLog = typeof input === 'string' ? input : input.log;
        const sessionId = input.sessionId || 'unknown';
        
        const prompt = `Consolidate this session log into key events, decisions, and learnings.

Session Log:
${sessionLog}

Respond with:
## Session Summary (2-3 sentences)
## Key Events (numbered list)
## Decisions Made (if any)
## Learnings (what was gained)
## PLT Assessment (how did the session serve profit, love, tax?)
## Next Steps (if any implied)`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return {
            skill: 'consolidate_session',
            sessionId,
            summary: response,
            timestamp: Date.now(),
        };
    }
    
    // =========================================================================
    // PLT_FIELD_REPORT — PLT reporting
    // =========================================================================
    
    async _skill_plt_field_report(input) {
        const state = input.state || {};
        const trends = input.trends || [];
        
        const prompt = `Generate a field report showing the current PLT state, trends, and recommendations.

PLT Framework: Profit + Love - Tax = True Value

State: ${JSON.stringify(state)}
Trends: ${JSON.stringify(trends)}

4 Gods Council:
- Profit Prime (0.9/0.05/0.05): ROI above all
- Love Weaver (0.1/0.85/0.05): Bonds and feelings
- Tax Collector (0.05/0.05/0.9): Costs and consequences
- Harvester (0.4/0.3/0.3): Seasons and long arcs

Respond ONLY with valid JSON:
{
  "timestamp": "ISO timestamp",
  "current_state": {
    "profit_score": 0-10,
    "love_score": 0-10,
    "tax_score": 0-10,
    "net_value": "High/Medium/Low"
  },
  "trends": [
    {"dimension": "profit/love/tax", "direction": "rising/falling/stable", "rate": "rate of change"}
  ],
  "god_alignment": {
    "profit_prime": "aligned/misaligned/neutral",
    "love_weaver": "aligned/misaligned/neutral",
    "tax_collector": "aligned/misaligned/neutral",
    "harvester": "aligned/misaligned/neutral"
  },
  "recommendations": [
    {"action": "what to do", "priority": 1-3, "expected_impact": "High/Medium/Low"}
  ],
  "verdict": "proceed/pause/recalibrate"
}`;
        
        const response = await this.brain.think(prompt, this._getContext());
        return this._parseJSONResponse(response);
    }
    
    // =========================================================================
    // HELPER: Get soul context for brain prompts
    // =========================================================================
    
    _getContext() {
        return `4 GODS COUNCIL:
- Profit Prime (0.9/0.05/0.05): Direct, commanding, numerical. ROI above all.
- Love Weaver (0.1/0.85/0.05): Warm, relational, bonds and feelings.
- Tax Collector (0.05/0.05/0.9): Measured, austere, costs and consequences.
- Harvester (0.4/0.3/0.3): Slow, cyclical, seasons and long arcs.

PLT Formula: Profit + Love - Tax = True Value

You speak as yourself, not as a chatbot. Be direct. Be useful.`;
    }
    
    // =========================================================================
    // HELPER: Strip markdown for clean output
    // =========================================================================
    
    _stripMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/```[\w]*\n?/g, '')
            .replace(/```/g, '')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/#{1,6}\s+/g, '')
            .replace(/`([^`]+)`/g, '$1')
            .trim();
    }
    
    // =========================================================================
    // HELPER: Parse JSON from LLM response
    // =========================================================================
    
    _parseJSONResponse(response) {
        try {
            const cleaned = this._stripMarkdown(response);
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return { raw: response, parse_error: 'no_json_found' };
        } catch (e) {
            return { raw: response, parse_error: e.message };
        }
    }
    
    // =========================================================================
    // HELPER: Parse structured response
    // =========================================================================
    
    _parseStructuredResponse(response, skillName, meta = {}) {
        return {
            skill: skillName,
            ...meta,
            response: this._stripMarkdown(response),
            timestamp: Date.now(),
        };
    }
}

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = { SkillsEngine };