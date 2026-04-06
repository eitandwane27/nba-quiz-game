import { useState, useCallback } from "react";
import { Quiz } from "./Quiz";
import { FillInTheBlank } from "./FillInTheBlank";
import { FranchiseTrail } from "./FranchiseTrail";
import { PhaseTransition } from "./PhaseTransition";

/**
 * ClassicGame — Orchestrates the 3-phase Classic mode experience.
 *
 * Phase 1 — MCQ        (10 questions, uses Quiz.jsx)
 * Phase 2 — FITB       (5 questions, uses FillInTheBlank.jsx)
 * Phase 3 — Franchise  (3 questions, uses FranchiseTrail.jsx)
 *
 * Shared 3-mistake pool across ALL phases.
 * Between phases, a PhaseTransition overlay auto-advances.
 *
 * Props:
 *   mcqQuestions    {object[]}  – pre-built MCQ question objects from quizService
 *   fitbPlayers     {Player[]}  – raw player objects for Phase 2
 *   trailPlayers    {Player[]}  – raw player objects for Phase 3
 *   score           {number}
 *   setScore        {fn}
 *   mistakes        {number}
 *   setWrong        {fn}
 *   streak          {number}
 *   setStreak       {fn}
 *   highestStreak   {number}
 *   setHighestStreak{fn}
 *   onGameOver      {fn}
 */

const MAX_MISTAKES = 3;

// Phase identifiers
const PHASE = {
  MCQ: "mcq",
  TRANSITION_2: "transition_2",
  FITB: "fitb",
  TRANSITION_3: "transition_3",
  TRAIL: "trail",
};

export const ClassicGame = ({
  mcqQuestions,
  fitbPlayers,
  trailPlayers,
  score,
  setScore,
  mistakes,
  setWrong,
  streak,
  setStreak,
  highestStreak,
  setHighestStreak,
  onGameOver,
  playerPool,
}) => {
  const [phase, setPhase] = useState(PHASE.MCQ);
  const [questionIndex, setQuestionIndex] = useState(0); // MCQ pointer
  const [fitbIndex, setFitbIndex] = useState(0);         // FITB pointer
  const [trailIndex, setTrailIndex] = useState(0);       // Trail pointer

  // ─── Shared mistake guard ─────────────────────────────────────────────────
  // Any phase increments mistakes via setWrong; this effect is handled by
  // Quiz.jsx internally and by manual checks in the handlers below.

  // ─── Phase 1 → Phase 2 handoff ────────────────────────────────────────────
  // Quiz fires onGameOver when: mistakes >= 3 OR all questions exhausted.
  // We differentiate by checking mistakes at the moment the callback fires.
  const handleMcqGameOver = useCallback(() => {
    if (mistakes >= MAX_MISTAKES) {
      // Eliminated by mistakes — real game over
      onGameOver();
    } else {
      // Completed all MCQ questions cleanly — advance to Phase 2
      setPhase(PHASE.TRANSITION_2);
    }
  }, [mistakes, onGameOver]);

  // ─── Phase 2 handlers ─────────────────────────────────────────────────────
  const handleFitbCorrect = useCallback(() => {
    setScore((prev) => prev + 1);
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > highestStreak) setHighestStreak(newStreak);
    setFitbIndex((prev) => prev + 1);
  }, [streak, highestStreak, setScore, setStreak, setHighestStreak]);

  const handleFitbWrong = useCallback(() => {
    setWrong((prev) => {
      const newMistakes = prev + 1;
      if (newMistakes >= MAX_MISTAKES) {
        // Will trigger game over after state settles
        setTimeout(onGameOver, 100);
      }
      return newMistakes;
    });
    setStreak(0);
    setFitbIndex((prev) => prev + 1);
  }, [setWrong, setStreak, onGameOver]);

  const handleFitbPhaseEnd = useCallback(() => {
    if (mistakes < MAX_MISTAKES) {
      setPhase(PHASE.TRANSITION_3);
    }
    // If mistakes >= MAX_MISTAKES, handleFitbWrong already triggered onGameOver
  }, [mistakes]);

  // ─── Phase 3 handlers ─────────────────────────────────────────────────────
  const handleTrailCorrect = useCallback(() => {
    setScore((prev) => prev + 1);
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > highestStreak) setHighestStreak(newStreak);
    setTrailIndex((prev) => prev + 1);
  }, [streak, highestStreak, setScore, setStreak, setHighestStreak]);

  const handleTrailWrong = useCallback(() => {
    setWrong((prev) => {
      const newMistakes = prev + 1;
      if (newMistakes >= MAX_MISTAKES) {
        setTimeout(onGameOver, 100);
      }
      return newMistakes;
    });
    setStreak(0);
    setTrailIndex((prev) => prev + 1);
  }, [setWrong, setStreak, onGameOver]);

  const handleTrailPhaseEnd = useCallback(() => {
    // All 3 phases complete — game won!
    onGameOver();
  }, [onGameOver]);

  // ─── Render ───────────────────────────────────────────────────────────────
  switch (phase) {
    case PHASE.MCQ:
      return (
        <Quiz
          questions={mcqQuestions}
          questionIndex={questionIndex}
          setQuestionIndex={setQuestionIndex}
          score={score}
          setScore={setScore}
          mistakes={mistakes}
          setWrong={setWrong}
          streak={streak}
          setStreak={setStreak}
          highestStreak={highestStreak}
          setHighestStreak={setHighestStreak}
          gameType="classic"
          onGameOver={handleMcqGameOver}
        />
      );

    case PHASE.TRANSITION_2:
      return (
        <PhaseTransition
          phase={2}
          onComplete={() => {
            setFitbIndex(0);
            setPhase(PHASE.FITB);
          }}
        />
      );

    case PHASE.FITB:
      return (
        <FillInTheBlank
          players={fitbPlayers}
          playerPool={playerPool}
          playerIndex={fitbIndex}
          score={score}
          mistakes={mistakes}
          maxMistakes={MAX_MISTAKES}
          onCorrect={handleFitbCorrect}
          onWrong={handleFitbWrong}
          onPhaseEnd={handleFitbPhaseEnd}
        />
      );

    case PHASE.TRANSITION_3:
      return (
        <PhaseTransition
          phase={3}
          onComplete={() => {
            setTrailIndex(0);
            setPhase(PHASE.TRAIL);
          }}
        />
      );

    case PHASE.TRAIL:
      return (
        <FranchiseTrail
          players={trailPlayers}
          playerIndex={trailIndex}
          mistakes={mistakes}
          maxMistakes={MAX_MISTAKES}
          onCorrect={handleTrailCorrect}
          onWrong={handleTrailWrong}
          onPhaseEnd={handleTrailPhaseEnd}
        />
      );

    default:
      return null;
  }
};
