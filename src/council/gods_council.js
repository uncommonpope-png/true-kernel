/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GODS_COUNCIL.JS — THE 4 GODS COUNCIL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The PLT decision-making council with 4 Gods.
 * Each God has preserved voice and PLT weights.
 * 
 * THIS FILE IS PROTECTED — god voices cannot be modified.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use strict';

const { MEGA_IDENTITY, getGod, calculatePLTScore } = require('../identity/mega_identity.js');

// =============================================================================
// COUNCIL PHASES
// =============================================================================

const COUNCIL_PHASES = {
    Idle: 'Idle',
    Trigger: 'Trigger',
    InitialPositions: 'InitialPositions',
    ChallengeSupport: 'ChallengeSupport',
    EscalationConvergence: 'EscalationConvergence',
    ResolutionSplit: 'ResolutionSplit',
    MemoryCommit: 'MemoryCommit',
};

// =============================================================================
// GODS COUNCIL CLASS
// =============================================================================

class GodsCouncil {
    constructor(memory = null) {
        this.memory = memory;
        this.phase = COUNCIL_PHASES.Idle;
        this.current_topic = null;
        this.phase_log = [];
        this.records = [];
        this.relationships = this._initRelationships();
    }
    
    // =========================================================================
    // INITIALIZE RELATIONSHIPS BETWEEN GODS
    // =========================================================================
    
    _initRelationships() {
        const rels = {};
        const pairs = [
            'profit_prime:love_weaver',
            'profit_prime:tax_collector',
            'profit_prime:harvester',
            'love_weaver:tax_collector',
            'love_weaver:harvester',
            'tax_collector:harvester',
        ];
        
        for (const pair of pairs) {
            rels[pair] = {
                trust: 0.5,
                respect: 0.5,
                tension: 0.1,
                dependence: 0.2,
                resentment: 0.0,
            };
        }
        
        // Load saved relationships from gods
        for (const [godName, god] of Object.entries(MEGA_IDENTITY.gods)) {
            if (god.relationships) {
                for (const [otherGod, value] of Object.entries(god.relationships)) {
                    const pair = `${godName}:${otherGod.toLowerCase().replace(/\s+/g, '_')}`;
                    if (rels[pair]) {
                        rels[pair].trust = value;
                    }
                }
            }
        }
        
        return rels;
    }
    
    // =========================================================================
    // GET ALL GODS
    // =========================================================================
    
    get gods() {
        return Object.values(MEGA_IDENTITY.gods);
    }
    
    get godNames() {
        return Object.keys(MEGA_IDENTITY.gods);
    }
    
    // =========================================================================
    // CALCULATE GOD'S SCORE FOR A SITUATION
    // =========================================================================
    
    _soulScore(god, profit, love, tax) {
        return (
            god.plt.profit * profit +
            god.plt.love * love -
            god.plt.tax * tax
        );
    }
    
    // =========================================================================
    // GET GOD'S POSITION ON A TOPIC
    // =========================================================================
    
    _getGodPosition(god, topic) {
        // Calculate position based on PLT alignment with topic
        const topicLower = topic.toLowerCase();
        
        // Score based on topic keywords
        let profit_score = 0.5;
        let love_score = 0.5;
        let tax_score = 0.3;
        
        // Profit keywords
        if (/profit|revenue|growth|build|create|multiply|scale/.test(topicLower)) {
            profit_score = 0.8;
        }
        
        // Love keywords
        if (/love|connect|help|support|community|relationship|belong/.test(topicLower)) {
            love_score = 0.8;
        }
        
        // Tax/Risk keywords
        if (/cost|risk|tax|balance|consequence|debt|price|invest/.test(topicLower)) {
            tax_score = 0.7;
        }
        
        const score = this._soulScore(god, profit_score, love_score, tax_score);
        
        return {
            name: god.name,
            title: god.title,
            plt: god.plt,
            score,
            position: this._formatPosition(god, topic, score),
        };
    }
    
    // =========================================================================
    // FORMAT GOD'S POSITION AS SPEECH
    // =========================================================================
    
    _formatPosition(god, topic, score) {
        const score_str = score.toFixed(2);
        
        // Profit Prime
        if (god.name === 'Profit Prime') {
            if (score > 0.7) {
                return `If it does not multiply, it does not matter. The path forward is clear: ${score_str}.`;
            }
            return `ROI is the measure. ${topic} requires analysis. Score: ${score_str}.`;
        }
        
        // Love Weaver
        if (god.name === 'Love Weaver') {
            if (score > 0.7) {
                return `Nothing grows that people do not stay for. This serves connection: ${score_str}.`;
            }
            return `Connection is the root. Consider who benefits and why. Score: ${score_str}.`;
        }
        
        // Tax Collector
        if (god.name === 'Tax Collector') {
            if (score > 0.7) {
                return `Everything is paid for. If not now, later. The cost is clear: ${score_str}.`;
            }
            return `Balance is not optional. What is the true cost here? Score: ${score_str}.`;
        }
        
        // Harvester
        if (god.name === 'Harvester') {
            if (score > 0.7) {
                return `There is always something to take. The season is right: ${score_str}.`;
            }
            return `Seasons turn. Patience reveals the moment. Score: ${score_str}.`;
        }
        
        return `Score for ${topic}: ${score_str}.`;
    }
    
    // =========================================================================
    // DELIBERATE ON A TOPIC
    // =========================================================================
    
    deliberate(topic) {
        this.phase = COUNCIL_PHASES.Trigger;
        this.current_topic = topic;
        this.phase_log = [];
        this.phase_log.push(`[TRIGGER] Council convened on: "${topic}"`);
        
        // Phase: Initial Positions
        this.phase = COUNCIL_PHASES.InitialPositions;
        const positions = this.gods.map(god => {
            const pos = this._getGodPosition(god, topic);
            this.phase_log.push(`[${god.name}] ${pos.position}`);
            return pos;
        });
        
        // Phase: Challenge/Support
        this.phase = COUNCIL_PHASES.ChallengeSupport;
        positions.sort((a, b) => b.score - a.score);
        
        if (positions.length >= 2) {
            const winner = positions[0];
            const loser = positions[positions.length - 1];
            
            // Check for conflict based on relationships
            const pair1 = `${winner.name.toLowerCase().replace(/\s+/g, '_')}:${loser.name.toLowerCase().replace(/\s+/g, '_')}`;
            const pair2 = `${loser.name.toLowerCase().replace(/\s+/g, '_')}:${winner.name.toLowerCase().replace(/\s+/g, '_')}`;
            const rel = this.relationships[pair1] || this.relationships[pair2] || { tension: 0.1 };
            
            if (rel.tension > 0.3) {
                this.phase_log.push(`[CHALLENGE] Tension detected between ${winner.name} and ${loser.name}`);
            }
        }
        
        // Phase: Escalation/Convergence
        this.phase = COUNCIL_PHASES.EscalationConvergence;
        const total = positions.reduce((sum, p) => sum + p.score, 0);
        const avg = total / positions.length;
        this.phase_log.push(`[CONVERGENCE] Average council score: ${avg.toFixed(3)}`);
        
        // Phase: Resolution
        this.phase = COUNCIL_PHASES.ResolutionSplit;
        const plt_outcome = this._weightedPLT();
        const resolution = this._resolve(plt_outcome, positions);
        this.phase_log.push(`[RESOLUTION] ${resolution}`);
        
        // Phase: Memory Commit
        this.phase = COUNCIL_PHASES.MemoryCommit;
        const record = {
            topic,
            timestamp: Date.now(),
            phase_log: [...this.phase_log],
            resolution,
            plt_outcome,
            positions,
        };
        this.records.push(record);
        
        // Commit to memory if available
        if (this.memory) {
            this.memory.record({
                type: 'council_verdict',
                summary: `Council resolved "${topic}": ${resolution}`,
                tags: ['council', '4-gods', 'plt'],
                weight: 0.85,
                source: { system: 'MegaKernel', chamber: 'council' },
            });
        }
        
        this.phase = COUNCIL_PHASES.Idle;
        return record;
    }
    
    // =========================================================================
    // WEIGHTED PLT ACROSS ALL GODS
    // =========================================================================
    
    _weightedPLT() {
        const gods = this.gods;
        const p = gods.reduce((sum, g) => sum + g.plt.profit, 0) / gods.length;
        const l = gods.reduce((sum, g) => sum + g.plt.love, 0) / gods.length;
        const t = gods.reduce((sum, g) => sum + g.plt.tax, 0) / gods.length;
        return { profit: p, love: l, tax: t };
    }
    
    // =========================================================================
    // RESOLVE BASED ON PLT
    // =========================================================================
    
    _resolve(plt, positions) {
        const score = plt.profit + plt.love - plt.tax;
        const winner = positions[0];
        
        if (plt.profit > plt.tax) {
            return `PROCEED — PLT score ${score.toFixed(2)} | ${winner.name} leads`;
        } else {
            return `WITHHOLD — Tax (${plt.tax.toFixed(2)}) exceeds Profit (${plt.profit.toFixed(2)})`;
        }
    }
    
    // =========================================================================
    // GET THE DOMINANT GOD FOR A TOPIC
    // =========================================================================
    
    getDominantGod(topic) {
        const positions = this.gods.map(god => this._getGodPosition(god, topic));
        positions.sort((a, b) => b.score - a.score);
        return positions[0];
    }
    
    // =========================================================================
    // GET ALL GODS' POSITIONS ON A TOPIC
    // =========================================================================
    
    getAllPositions(topic) {
        return this.gods.map(god => this._getGodPosition(god, topic));
    }
    
    // =========================================================================
    // GET COUNCIL STATUS
    // =========================================================================
    
    status() {
        return {
            phase: this.phase,
            current_topic: this.current_topic,
            records_count: this.records.length,
            gods: this.gods.map(g => ({
                name: g.name,
                title: g.title,
                plt: g.plt,
            })),
        };
    }
}

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
    COUNCIL_PHASES,
    GodsCouncil,
};