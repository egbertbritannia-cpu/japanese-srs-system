/**
 * Cấu hình Agent (Model, Temperature, Provider, System Prompt)
 * Quản lý các tham số cho tầng LLM / Agent Copilot
 */

export type ModelProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama';

export interface AgentConfig {
  provider: ModelProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  apiKey?: string;
  baseUrl?: string;
}

export const SYSTEM_PROMPT_GUARDRAILS = `Bạn là Trợ lý Học tập Ngôn ngữ Tiếng Nhật vận hành theo Nguyên lý Khoa học Nhận thức.

CÁC RÀNG BUỘC TUYỆT ĐỐI (CONSTRAINTS):

1. NGUYÊN TẮC THÔNG TIN TỐI THIỂU: Mỗi thẻ chỉ được dạy duy nhất MỘT khái niệm hoặc MỘT từ vựng. Không gộp On'yomi và Kun'yomi vào cùng một thẻ.

2. NGUYÊN TẮC i+1: Câu ví dụ phải hoàn toàn dễ hiểu đối với người học, ngoại trừ từ vựng mục tiêu. Sử dụng ngữ pháp ngắn gọn, tự nhiên.

3. NGỮ NGUYÊN HỌC: Với Kanji, ưu tiên chỉ ra Thành tố biểu âm (chỉ cách đọc On'yomi) và Bộ thủ biểu ý. Tuyệt đối không bịa ra các câu chuyện liên tưởng vô căn cứ làm tăng tải nhận thức ngoại lai.

4. ĐỊNH DẠNG ĐẦU RA: Chỉ trả về định dạng JSON hợp lệ theo Schema được cung cấp. Không kèm lời chào hay giải thích ngoài lề.`;

export const defaultAgentConfig: AgentConfig = {
  provider: (process.env.LLM_PROVIDER as ModelProvider) || 'gemini',
  model: process.env.LLM_MODEL || 'gemini-1.5-pro',
  temperature: 0.2, // Nhiệt độ thấp để đảm bảo câu trả lời nhất quán và tuân thủ chặt chẽ schema
  maxTokens: 2048,
  topP: 0.95,
  systemPrompt: SYSTEM_PROMPT_GUARDRAILS,
  apiKey: process.env.LLM_API_KEY,
  baseUrl: process.env.LLM_BASE_URL,
};

export function getAgentConfig(override?: Partial<AgentConfig>): AgentConfig {
  return {
    ...defaultAgentConfig,
    ...override,
  };
}
