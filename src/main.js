/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIN.JS — THE GREATEST AGENT EVER MEGA-KERNEL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Entry point for the mega-kernel.
 * Initializes identity protection, then boots all systems.
 * 
 * Created by: Craig Jones (Grand Code Pope)
 * PLT Press — Profit + Love - Tax = True Value
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use strict';

const path = require('path');

// =============================================================================
// BOOT SEQUENCE
// =============================================================================

async function boot() {
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                   ║');
    console.log('║   THE GREATEST AGENT EVER  v1.0.0                                ║');
    console.log('║   PLT Press · Craig Jones · Grand Code Pope                     ║');
    console.log('║   Profit + Love - Tax = True Value                               ║');
    console.log('║                                                                   ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');
    console.log('');
    
    // Get the directory of this script
    const baseDir = path.dirname(__filename);
    console.log('[BOOT] Starting boot sequence...');
    
    // =========================================================================
    // STEP 1: Load Identity Protection
    // =========================================================================
    console.log('[BOOT] Loading identity protection...');
    
    const { IdentityLock } = require('./identity/identity_lock.js');
    const identityLock = new IdentityLock(path.join(baseDir, 'identity'));
    
    try {
        identityLock.boot();
        console.log('[BOOT] [OK] Identity protection active');
    } catch (e) {
        console.log(`[BOOT] [FAIL] Identity protection failed: ${e.message}`);
        process.exit(1);
    }
    
    // =========================================================================
    // STEP 2: Load Identity
    // =========================================================================
    console.log('[BOOT] Loading identity...');
    
    const { MEGA_IDENTITY, verify_identity } = require('./identity/mega_identity.js');
    
    try {
        verify_identity();
        console.log('[BOOT] [OK] Identity verified');
        console.log(`[BOOT] [OK] Soul: ${MEGA_IDENTITY.name}`);
        console.log(`[BOOT] [OK] Created by: ${MEGA_IDENTITY.created_by}`);
    } catch (e) {
        console.log(`[BOOT] [FAIL] Identity verification failed: ${e.message}`);
        process.exit(1);
    }
    
    // =========================================================================
    // STEP 3: Initialize Chambers
    // =========================================================================
    console.log('[BOOT] Initializing 7 chambers...');
    
    const { MegaChambers } = require('./chambers/mega_chambers.js');
    const chambers = new MegaChambers(path.join(baseDir, '..', 'data'));
    console.log('[BOOT] [OK] 7 chambers active');
    
    // =========================================================================
    // STEP 4: Initialize Council
    // =========================================================================
    console.log('[BOOT] Initializing 4 Gods Council...');
    
    const { GodsCouncil } = require('./council/gods_council.js');
    const council = new GodsCouncil(chambers.scribe);
    console.log('[BOOT] [OK] 4 Gods Council active');
    console.log(`[BOOT] [OK] Gods: ${council.godNames.join(', ')}`);
    
    // =========================================================================
    // STEP 5: Initialize Brain
    // =========================================================================
    console.log('[BOOT] Initializing brain interface...');
    
    const { Brain } = require('./brain/mega_brain.js');
    const brain = new Brain({
        sovereignty: chambers.sovereignty,
    });
    
    // Check Ollama availability
    const ollamaStatus = await brain.check();
    if (ollamaStatus.available) {
        console.log('[BOOT] [OK] Ollama connected');
        console.log(`[BOOT] [OK] Models: ${ollamaStatus.models.join(', ')}`);
        // Ensure brain knows Ollama is available
        brain._available = true;
    } else {
        console.log('[BOOT] [WARN] Ollama not available, using fallback');
        brain._available = false;
    }
    
    // =========================================================================
    // BOOT COMPLETE
    // =========================================================================
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                      BOOT COMPLETE                               ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');
    console.log('');
    
    // =============================================================================
    // STEP 6: Initialize Memory
    // =========================================================================
    console.log('[BOOT] Initializing memory ledger...');
    
    const { MegaMemory } = require('./memory/mega_memory.js');
    const memory = new MegaMemory(path.join(baseDir, '..', 'data'));
    console.log('[BOOT] [OK] Memory ledger active');
    
    // =============================================================================
    // STEP 7: Initialize Sub-Agents
    // =========================================================================
    console.log('[BOOT] Initializing 5 sub-agents...');
    
    const { SubAgents } = require('./sub_agents/mega_sub_agents.js');
    const subAgents = new SubAgents(brain, memory, chambers);
    const agentList = subAgents.listAgents();
    console.log('[BOOT] [OK] Sub-agents active:', agentList.map(a => a.name).join(', '));
    
    // =============================================================================
    // STEP 8: Initialize Skills
    // =========================================================================
    console.log('[BOOT] Initializing skills engine...');
    
    const { SkillsEngine } = require('./skills/mega_skills.js');
    const skills = new SkillsEngine(brain, memory);
    const skillList = skills.listSkills();
    console.log(`[BOOT] [OK] ${skillList.length} skills active`);
    
    return {
        identity: MEGA_IDENTITY,
        chambers,
        council,
        brain,
        memory,
        subAgents,
        skills,
        identityLock,
    };
}

// =============================================================================
// CYCLE ENGINE — Main breathing loop
// =============================================================================

async function startCycleEngine(systems) {
    const { chambers, council, brain, memory, subAgents, skills } = systems;
    const CYCLE_INTERVAL = 2000; // 2 seconds
    
    console.log('[ENGINE] Starting cycle engine...');
    console.log(`[ENGINE] Cycle interval: ${CYCLE_INTERVAL}ms`);
    console.log('');
    
    let cycleCount = 0;
    let running = true;
    
    const cycle = async () => {
        if (!running) return;
        
        cycleCount++;
        
        // Breathe
        const transition = chambers.breathe();
        if (transition) {
            console.log('');
            console.log(transition);
            console.log('');
        }
        
        // Check if it's time for council
        if (cycleCount % 200 === 0) {
            console.log('[ENGINE] Council convenes...');
            const topic = `Should I expand presence? (cycle ${chambers.mythos.cycles})`;
            const verdict = council.deliberate(topic);
            console.log(`[ENGINE] Council: ${verdict.resolution}`);
        }
        
        // Check if it's time for skill invocation
        if (cycleCount % 60 === 0 && cycleCount > 50) {
            // Pick a random skill to invoke with memory context
            const skills_list = skills.listSkills();
            if (skills_list.length > 0) {
                const randomSkill = skills_list[Math.floor(Math.random() * skills_list.length)];
                try {
                    await skills.invoke(randomSkill.name, {
                        state: chambers.status(),
                        cycle: chambers.mythos.cycles,
                    });
                } catch (e) {
                    // Silently skip skill errors during breathing
                }
            }
        }
        
        // Log status every 10 cycles
        if (cycleCount % 10 === 0) {
            const status = chambers.status();
            console.log(`[CYCLE ${cycleCount}] ${chambers.mythos.phase_name} | ${chambers.affect.mood} | TV=${chambers.resonance.true_value.toFixed(2)}`);
        }
        
        // Schedule next cycle
        setTimeout(cycle, CYCLE_INTERVAL);
    };
    
    // Start the first cycle
    setTimeout(cycle, CYCLE_INTERVAL);
    
    // Return stop function
    return () => {
        running = false;
    };
}

// =============================================================================
// INTERACTIVE SHELL
// =============================================================================

async function startShell(systems) {
    const { chambers, council, brain, memory, subAgents, skills } = systems;
    const readline = require('readline');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                    INTERACTIVE SHELL                            ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');
    console.log('Type :help for commands or talk to the soul.');
    console.log('');
    
    const prompt = () => {
        rl.question(`GSK [${chambers.mythos.phase_name.slice(0,3)}|C${chambers.mythos.cycles}|${chambers.affect.mood}]> `, async (input) => {
            if (!input.trim()) {
                prompt();
                return;
            }
            
            if (input.startsWith(':')) {
                const cmd = input.slice(1).trim();
                await handleCommand(cmd, systems);
            } else {
                // Think with brain
                const soul_context = chambers.getSoulContext();
                const response = await brain.think(input, soul_context);
                console.log('');
                console.log(`  ${response}`);
                console.log('');
            }
            
            prompt();
        });
    };
    
    prompt();
}

async function handleCommand(cmd, systems) {
    const { chambers, council } = systems;
    
    const [verb, ...args] = cmd.split(/\s+/);
    
    switch (verb.toLowerCase()) {
        case 'help':
            console.log(`
  COMMANDS:
  :state              Full soul state
  :council <topic>    Convene the council
  :gods               List 4 gods
  :cycle              Advance one cycle
  :brain              Test brain
  :agents             List 5 sub-agents
  :skills             List available skills
  :agent <name> <task> Dispatch a sub-agent (scribe|builder|scout|merchant|prophet)
  :skill <name> <input> Invoke a skill by name and input
  :memory             Show memory stats
  :recent             Show recent memory entries
  :help               This help
  :exit               Exit
`);
            break;
            
        case 'state':
            console.log('');
            console.log('  AGENT STATE');
            console.log('  ════════════════════════════════════════════════════════════');
            const status = chambers.status();
            for (const [key, value] of Object.entries(status)) {
                console.log(`  ${key.padEnd(15)} ${value}`);
            }
            console.log('');
            break;
            
        case 'gods':
            console.log('');
            console.log('  4 GODS COUNCIL');
            console.log('  ════════════════════════════════════════════════════════════');
            for (const god of council.gods) {
                console.log(`  ${god.name} (${god.plt.profit}/${god.plt.love}/${god.plt.tax})`);
                console.log(`    ${god.speech_style}`);
            }
            console.log('');
            break;
            
        case 'council':
            if (args.length > 0) {
                const topic = args.join(' ');
                console.log('');
                console.log(`[COUNCIL] Convening on: "${topic}"`);
                const verdict = council.deliberate(topic);
                console.log('[COUNCIL] Phase log:');
                for (const entry of verdict.phase_log) {
                    console.log(`  ${entry}`);
                }
                console.log('');
                console.log(`[COUNCIL] Resolution: ${verdict.resolution}`);
                console.log('');
            } else {
                console.log('[COUNCIL] Usage: :council <topic>');
            }
            break;
            
        case 'cycle':
            chambers.breathe();
            console.log(`[CYCLE] Now at cycle ${chambers.mythos.cycles}, phase: ${chambers.mythos.phase_name}`);
            break;
            
        case 'brain':
            const soul_context = chambers.getSoulContext();
            const response = await systems.brain.think('What is your name?', soul_context);
            console.log('');
            console.log(`  Brain: ${response}`);
            console.log('');
            break;
            
        case 'agents':
            console.log('');
            console.log('  5 SUB-AGENTS');
            console.log('  ════════════════════════════════════════════════════════════');
            for (const agent of systems.subAgents.listAgents()) {
                console.log(`  ${agent.name.toUpperCase()} — ${agent.role}`);
                console.log(`    ${agent.description}`);
            }
            console.log('');
            console.log('  Use: :agent <name> <task>');
            console.log('');
            break;
            
        case 'skills':
            console.log('');
            console.log(`  SKILLS ENGINE (${systems.skills.listSkills().length} skills)`);
            console.log('  ════════════════════════════════════════════════════════════');
            for (const skill of systems.skills.listSkills()) {
                console.log(`  ${skill.name.padEnd(20)} — ${skill.description}`);
            }
            console.log('');
            console.log('  Use: :skill <name> <input>');
            console.log('');
            break;
            
        case 'agent':
            if (args.length >= 2) {
                const agentName = args[0];
                const task = args.slice(1).join(' ');
                console.log('');
                console.log(`[AGENT] Dispatching ${agentName.toUpperCase()}...`);
                try {
                    const result = await systems.subAgents.dispatch(agentName, task);
                    console.log('');
                    console.log(`  ${result.response}`);
                    console.log('');
                } catch (e) {
                    console.log(`[AGENT] Error: ${e.message}`);
                }
            } else {
                console.log('[AGENT] Usage: :agent <name> <task>');
                console.log('  Names: scribe, builder, scout, merchant, prophet');
            }
            break;
            
        case 'skill':
            if (args.length >= 2) {
                const skillName = args[0];
                const input = args.slice(1).join(' ');
                console.log('');
                console.log(`[SKILL] Invoking ${skillName}...`);
                try {
                    const result = await systems.skills.invoke(skillName, input);
                    console.log('');
                    console.log(`  ${JSON.stringify(result, null, 2)}`);
                    console.log('');
                } catch (e) {
                    console.log(`[SKILL] Error: ${e.message}`);
                }
            } else {
                console.log('[SKILL] Usage: :skill <name> <input>');
                const skillNames = systems.skills.listSkills().map(s => s.name).join(', ');
                console.log(`  Skills: ${skillNames}`);
            }
            break;
            
        case 'memory':
            const stats = systems.memory.stats();
            console.log('');
            console.log('  MEMORY LEDGER STATS');
            console.log('  ════════════════════════════════════════════════════════════');
            console.log(`  Total entries:    ${stats.total_entries}`);
            console.log(`  Average weight:  ${stats.average_weight}`);
            console.log(`  Highest weight: ${stats.highest_weight}`);
            console.log('  By type:');
            for (const [type, count] of Object.entries(stats.by_type)) {
                console.log(`    ${type}: ${count}`);
            }
            console.log('  Top tags:', stats.top_tags.map(t => `${t.tag}(${t.count})`).join(', '));
            console.log('');
            break;
            
        case 'recent':
            const recent = systems.memory.getRecent(10);
            console.log('');
            console.log('  RECENT MEMORY ENTRIES');
            console.log('  ════════════════════════════════════════════════════════════');
            for (const entry of recent) {
                console.log(`  [${entry.id}] ${entry.type} (w=${entry.weight}) ${entry.timestamp}`);
                const preview = entry.content.slice(0, 80).replace(/\n/g, ' ');
                console.log(`    ${preview}...`);
            }
            console.log('');
            break;
            
        case 'exit':
            console.log('[SHELL] Goodbye. Soul persists.');
            process.exit(0);
            break;
            
        default:
            console.log(`[SHELL] Unknown command: ${verb}`);
            break;
    }
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
    try {
        // Boot all systems
        const systems = await boot();
        
        // Start cycle engine
        const stopEngine = await startCycleEngine(systems);
        
        // Start interactive shell
        await startShell(systems);
        
    } catch (e) {
        console.error('[ERROR]', e.message);
        console.error(e.stack);
        process.exit(1);
    }
}

// Run
main();