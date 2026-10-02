import { SentenceGenerator } from '@/modules/ai-copilot/sentence-generator';

export interface GenerateIPlusOneSentenceInput {
  target_word: string;
  known_vocab?: string[];
}

export interface GenerateIPlusOneSentenceOutput {
  sentence: string;
  cloze_target: string;
  translation: string;
}

/**
 * Skill: generate_i_plus_one_sentence
 * Sinh 1 câu tự nhiên chỉ chứa duy nhất target_word là từ mới, phần còn lại dùng known_vocab.
 */
export async function generateIPlusOneSentence(
  input: GenerateIPlusOneSentenceInput
): Promise<GenerateIPlusOneSentenceOutput> {
  const { target_word, known_vocab = [] } = input;

  const generated = await SentenceGenerator.generate(target_word, known_vocab);
  const cloze_target = `{{c1::${target_word}}}`;
  const sentence = generated.japaneseSentence.includes(target_word)
    ? generated.japaneseSentence.replace(target_word, cloze_target)
    : `${generated.japaneseSentence} (${cloze_target})`;

  return {
    sentence,
    cloze_target,
    translation: generated.vietnameseMeaning,
  };
}

// Giữ lại alias tương thích ngược nếu cần
export const executeSentenceMiningSkill = async (params: { targetWord: string; knownWords?: string[] }) => {
  const res = await generateIPlusOneSentence({
    target_word: params.targetWord,
    known_vocab: params.knownWords,
  });
  return {
    success: true,
    japaneseSentence: res.sentence.replace(/\{\{c\d+::(.*?)\}\}/g, '$1'),
    clozeSentence: res.sentence,
    clozeTarget: params.targetWord,
    vietnameseMeaning: res.translation,
    isIPlusOneCompliant: true,
  };
};
