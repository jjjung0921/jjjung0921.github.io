---
title: "Why do DDA papers solve the same problem at different levels?"
lang: "en"
translationKey: "dda-research-map"
date: "2026-07-30"
lastUpdated: "2026-09-25"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 1
projects: ["staged-dda"]
status: "reading"
summary: "Five DDA papers placed in one table along four axes: decision, observation, adaptation, and evaluation. They differ in what they adjust, what signal they read, and how they validate. Only one is explicitly bi-level, and none keeps a per-player model."
problem: "Under the single name DDA, state estimation, meta balancing, encounter generation, and AI weakening blur into one category, which makes it unclear which method should anchor the experimental testbed."
coreIdea: "Splitting each paper by 'what does it decide, what does it observe, how does it adapt to the player, and how is it evaluated' separates the five into three families and reduces the shared skeleton to a lower-level player model and an upper-level difficulty policy."
connection: "This is the map Research Roadmap Stage 4 relies on when it picks staged-dda as the testbed. The fact that every evaluation cell differs is the evidence behind Stage 4's claim that DDA evaluation is not standardized."
tags: ["dda", "research-map", "bi-level-optimization", "personalization", "flow"]
---

# Putting five DDA papers on a single map

> Under the same name DDA, what does each of these papers adjust, and how does it validate the result?

## Background

This post used to be split into one map and five per-paper reviews. In the [Research Roadmap](/en/notes/roadmap-tutorial-personal-agentic-model/), DDA moved from being the research topic to being the testbed, and what I needed changed with it. Instead of each paper's details, I needed a comparison that shows at a glance where the five part ways. So I folded the five reviews into this one map. The paper selection and interpretations started from my Notion [collection of DDA paper reviews](https://app.notion.com/p/374fb10f650180de9af1eea957ddd205) and [DDA research notes](https://app.notion.com/p/37bfb10f650180f9b7c2f6dd561c4fa5).

I did not pick the five papers by any fixed criterion. This post is therefore not a landscape of the whole DDA field but **a map of the five papers I read**.

## 1. Four axes: decision, observation, adaptation, evaluation

In the [tutorial](/en/notes/roadmap-tutorial-personal-agentic-model/) I defined an agentic model as "a model that makes its own decisions, observes how those decisions change the user's responses, and adapts its next decisions to that user." DDA papers can be cut along the same verbs. I add evaluation as a fourth axis, since it is the first thing that matters when choosing a testbed.

| Axis | Question |
|---|---|
| Decision | What does it adjust (control knob)? |
| Observation | What signal does it read? |
| Adaptation | Does it model the player, and with what? |
| Evaluation | How is it validated? |

I also note when learning and adjustment happen. Whether a method is trained in advance with offline simulation or adjusts in real time during play decides how it can be moved to a testbed.

## 2. The map

| Paper | Decision | Observation | Adaptation | Timing | Evaluation |
|---|---|---|---|---|---|
| BiGMB (AAMAS 2023) | Game meta parameters $\theta$ | Entropy of the equilibrium strategy distribution | None (meta level) | Offline search | Simulator benchmarks, no human study |
| Imitation + RL (2024) | Policy of the opponent RL agent | Player behavior, HP-centered reward | Imitation proxy | Background training, periodic replacement | 5-person user study |
| NTRL (2025) | Encounter composition | Party state, simulated reward | Party state only, no preference model | Offline training, instant online generation | Simulator, comparison with human DMs |
| Player State MCTS (ESWA 2022) | MCTS move selection | Predicted Challenge, Competence, Valence, Flow | Player state model (not per player) | Real time | 20-person user study |
| AlphaDDA (2021) | Simulation count, dropout, UCT score | Averaged board value $\bar v_n$ | None | Real time | AI-vs-AI (Elo, win/loss/draw) |

Read column by column, the five papers split into three families.

1. Estimating player state to choose actions: Imitation + RL, Player State MCTS
2. Regenerating encounters or the meta: NTRL, BiGMB
3. Deliberately weakening an already strong AI: AlphaDDA

## 3. What to keep from each paper

### BiGMB: measuring meta diversity with entropy

Bilevel Entropy based Mechanism Design moves the criterion of balance from a win-rate table to the diversity of the equilibrium strategy distribution. The inner level approximates a mixed-strategy Nash equilibrium with Nash Monte-Carlo Learning, and the outer level searches the meta parameters $\theta$ with CMA-ES. Of the five, **this is the only paper that is explicitly bi-level**.

$$
\max_{\theta}\; H(Y)-\big\|r\odot\theta-r\odot\theta_0\big\|_2,
\qquad
H(\sigma_i)=-\sum_{s\in S_i}\sigma_i(s)\log\sigma_i(s)
$$

The entropy term pushes diversity up, and the regularizer holds on to the design intent in the initial meta $\theta_0$. It was evaluated on RPSFW, Workshop Warfare, and Pokémon VGC, and its advantage over baselines grew with the size of the strategy space. There is no personalization and no human study, and a diverse meta is not guaranteed to be a good experience. What I take from it is entropy as an auxiliary term against strategy collapse, rather than as the objective itself.

### Imitation + RL: train an opponent to beat a proxy of the player

In FightingICE, an adaptive random forest imitates the player's behavior. An A2C opponent is trained against that imitation agent and periodically replaces the real opponent. Imitation accuracy was about 82–87%. In a 5-person user study, the mean rating was $7.0\pm1.09$ for the proposed agent and $6.6\pm1.01$ for MCTS. The paper has no bi-level formula; reading it as a player proxy below and an opponent policy above is my own rewrite. The reward is HP-centered, so experience is not optimized directly, and if the proxy misses the player's long-term strategy, the opponent may end up exploiting only the proxy.

### NTRL: turning difficulty into encounter generation

NTRL rewrites D&D encounter balancing as generating enemy compositions instead of tuning an XP budget. A policy network that takes party state as features samples the next enemy class or STOP. It is trained with a contextual bandit and REINFORCE, and the reward is a weighted sum of five proxies, including win probability.

$$
R(p,e)=\alpha\cdot wp+\beta\cdot fl+\gamma\cdot mhp+\delta\cdot dmg+\lambda\cdot dth
$$

Expensive simulation is pushed into offline training, and online it generates immediately from party state alone. It tended to produce longer fights than the static heuristic while keeping win probability high. My Notion notes record the win-probability figures inconsistently across contexts, so I keep only the trend here. Its limits are the hand-crafted proxy reward, the gap between simulated combat AI and humans, and an experimental range restricted to level-5 parties.

### Player State MCTS: choose the move that induces the target state, not the winning move

This paper replaces the MCTS score, HP difference, with a prediction of player state. It concatenates 4.5 seconds of real play log with 0.5 seconds of MCTS-simulated future, predicts Challenge, Competence, Valence, and Flow, and uses the prediction as the node value. Rewritten in my notation:

$$
\mathrm{score}_q(\tau)=P^q_\phi\big(y_q=1\mid I_p\oplus I_s\big)
$$

The player state model was trained on 688 logs from 43 players, with accuracies of 71.5% (Challenge), 69.4% (Competence), 68.4% (Valence), and 73.1% (Flow). In a 20-person user study, the Competence, Valence, and Flow agents gave better subjective experience than the HP baseline, while the Challenge agent showed no significant improvement. Labels come from post-game GEQ questionnaires, so they are not moment-level states, and the model is not per player. Still, of the five, it puts player experience into the objective most directly.

### AlphaDDA: weakening a strong AI without retraining it

It keeps a fully trained AlphaZero as is and uses the average of recent board values as the strength signal.

$$
\bar v_n=\frac{1}{N_h}\sum_{i=0}^{N_h-1}v_{n-i}
$$

With this signal, AlphaDDA1 adjusts the MCTS simulation count, AlphaDDA2 the dropout probability, and AlphaDDA3 the UCT score. In AI-vs-AI evaluation on Connect4, 6×6 Othello, and Othello, variants 1 and 2 matched most opponents, while variant 3 became too weak. There is no human study, and because it relies on board value, it does not transfer directly to games with hidden information or chance. It is the baseline with the clearest knob, but it does not address whom to match and at what strength.

## 4. What the map shows

### The shared skeleton is a lower-level player model and an upper-level difficulty policy

Only BiGMB is explicitly bi-level, but all five can be rewritten in the same shape.

$$
\phi^*(\psi)\in\arg\min_\phi\mathcal{L}_{player}\big(\phi;\mathcal{D}(\psi)\big)
\qquad
\psi^*\in\arg\min_\psi\mathcal{L}_{DDA}\big(\psi;\phi^*(\psi)\big)
$$

The lower level learns a player model or an outcome proxy, and the upper level uses the result to choose a difficulty policy or content parameters. This formula is my rewrite of the papers' shared structure. The dependence of lower-level data on the upper variable through $\mathcal{D}(\psi)$ is the same performative structure as in [Stage 2](/en/notes/roadmap-performative-prediction/).

### Every evaluation cell differs

The five evaluations are simulator benchmarks, a 5-person user study, a simulator plus human-DM comparison, a 20-person user study, and AI-vs-AI Elo. Even when results look similar, the units of measurement differ, so the papers cannot be ranked. This column is the evidence behind Stage 4(forthcoming)'s view that DDA evaluation is not standardized.

### No per-player model

Two papers model the player. Imitation + RL keeps a proxy that imitates the current player, and Player State MCTS uses a shared state model trained on logs from many players. The latter also feeds in the short future created by the AI's move, so it models the response to a decision one step ahead. But that model is not per player, and neither paper handles players changing as responses accumulate. Neither puts "adapting quickly to a new player" into its objective.

So the separations my research needs come down to three:

- state estimation versus the control policy
- capability-based difficulty versus player-relative difficulty
- proxy metrics versus subjective experience

> [!interpretation] My interpretation
> After drawing this map, two things bothered me. First, DDA has no standardized evaluation metric. Since all five cells in the evaluation column differ, I cannot say one paper's improvement beats another's, and there is no common benchmark to put my own method on. Second, none of the five papers shows original play by the model. AlphaDDA weakens a strong AI's moves, and Imitation + RL learns against a proxy that imitates the player. NTRL picks compositions within a fixed set of enemy classes, and BiGMB shifts meta parameters. Player State MCTS, too, only chooses moves that induce a desired state; it does not form a strategy of its own. What the model decides is 'how hard', not 'what play'. In the definition of an agentic model, 'makes its own decisions' has shrunk to the single axis of difficulty. So if DDA is the testbed, it can show adaptation but hardly the range of decisions, and a separate standard for comparing results has to be set up.

## 5. Limits

This map is a tool for deciding what to group and what to separate, not for deciding which paper is better. Since the five papers were not chosen by a criterion, an empty cell here cannot be read as a gap in the field; a landscape of the whole field has to be redrawn around review papers. The per-paper figures were carried over after checking the Notion notes against the original papers, but where my notes disagreed with themselves, as with NTRL, I kept only the trend.

## Connections

- Related project: [General-purpose staged-DDA](/en/projects/dda-blackjack/)
- Related series: Research Roadmap Stage 4(forthcoming)
- Next question: where do these five papers sit in the field as a whole? A landscape built on review papers does not exist yet.

## References

- [Bilevel Entropy based Mechanism Design for Balancing Meta in Video Games](https://www.ifaamas.org/Proceedings/aamas2023/pdfs/p2134.pdf) (AAMAS 2023)
- [Personalized Dynamic Difficulty Adjustment – Imitation Learning Meets Reinforcement Learning](https://arxiv.org/pdf/2408.06818) (arXiv 2024)
- [NTRL: Encounter Generation via Reinforcement Learning for Dynamic Difficulty Adjustment in Dungeons and Dragons](https://arxiv.org/pdf/2506.19530) (arXiv 2025)
- [Diversifying Dynamic Difficulty Adjustment Agent by Integrating Player State Models into Monte-Carlo Tree Search](https://cilab.gist.ac.kr/hp/wp-content/uploads/publications/international_journal/2022/ESWA_DDA.pdf) (ESWA 2022)
- [AlphaDDA: Strategies for Adjusting the Playing Strength of a Fully Trained AlphaZero System to a Suitable Human Training Partner](https://arxiv.org/pdf/2111.06266) (arXiv 2021)
- Notion notes: [BiGMB](https://app.notion.com/p/374fb10f6501804c8721dc1b3daad34b) · [Personalized DDA](https://app.notion.com/p/374fb10f65018061a4cdc77dc2603afa) · [NTRL](https://app.notion.com/p/374fb10f65018073b85bd133c3862b18) · [Player State MCTS](https://app.notion.com/p/37afb10f6501804f96b7ff251493afad) · [AlphaDDA](https://app.notion.com/p/37afb10f650180c086d1e1a16e4cbb0a)
