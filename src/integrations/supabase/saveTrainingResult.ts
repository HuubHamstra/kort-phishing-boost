import { supabase } from "./client";
import type { TablesInsert } from "./types";

export interface TrainingAnswerRecord {
  question_id: number;
  is_phishing_correct: boolean; // of je het goed had
  user_answer: boolean; // wat gebruiker koos
  correct_answer: boolean; // juiste waarde
}

export type TrainingResultInsert = TablesInsert<"training_results">;

/**
 * Slaat een trainingsresultaat op in de database.
 * Geeft het ingevoegde record of een fout terug.
 */
export async function saveTrainingResult(
  data: Omit<TrainingResultInsert, "percentage"> & { percentage?: number }
) {
  const percentage =
    data.percentage ?? (data.score / data.total_questions) * 100;
  const payload: TrainingResultInsert = {
    ...data,
    percentage: Math.round(percentage),
  } as TrainingResultInsert;

  const { data: inserted, error } = await supabase
    .from("training_results")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }
  return inserted;
}
