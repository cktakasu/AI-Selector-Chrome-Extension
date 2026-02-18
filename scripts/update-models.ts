import fs from 'fs';
import path from 'path';

// 監視対象のモデルIDマッピング（誤動作防止のため厳密に定義）
const MODEL_MAPPING: Record<string, string[]> = {
    'claude': ['anthropic/claude-sonnet', 'anthropic/claude-opus', 'anthropic/claude-3.5-sonnet', 'anthropic/claude-3-opus'],
    'chatgpt': ['openai/gpt-4o', 'openai/gpt-4-turbo', 'openai/gpt-4.1', 'openai/gpt-5'],
    'gemini': ['google/gemini-pro', 'google/gemini-flash', 'google/gemini-2.5-pro', 'google/gemini-3.0-pro'],
    'deepseek': ['deepseek/deepseek-chat', 'deepseek/deepseek-reasoner'],
    'perplexity': ['perplexity/llama-3.1-sonar-huge-128k-online', 'perplexity/sonar-reasoning'] // Perplexityはモデルの更新が早い
};

// 特定のキーワードで新しいモデルを検索する（例: "claude-4" など）
const DYNAMIC_KEYWORDS = ['claude', 'gpt', 'gemini', 'deepseek', 'sonar'];

async function updateModels() {
    try {
        console.log('Fetching models from OpenRouter...');
        const response = await fetch('https://openrouter.ai/api/v1/models');
        const json = await response.json() as { data: { id: string, created: number }[] };

        const updates: Record<string, string> = {};

        // 各サービスの最新更新日を特定
        for (const [serviceId, modelIds] of Object.entries(MODEL_MAPPING)) {
            let latestCreated = 0;

            // 1. 厳密なマッピングからの取得
            for (const model of json.data) {
                if (modelIds.some(id => model.id.startsWith(id))) {
                    if (model.created > latestCreated) {
                        latestCreated = model.created;
                    }
                }
            }

            // 2. ダイナミックキーワードによる検知（新しいバージョンが出た場合）
            const keyword = DYNAMIC_KEYWORDS.find(k => serviceId.includes(k));
            if (keyword) {
                for (const model of json.data) {
                    if (model.id.includes(keyword) && model.created > latestCreated) {
                        // "free" や "alpha" などのデリケートなものは除外するヒューリスティック
                        if (!model.id.includes(':free') && !model.id.includes('alpha')) {
                            latestCreated = model.created;
                        }
                    }
                }
            }

            if (latestCreated > 0) {
                const date = new Date(latestCreated * 1000);
                updates[serviceId] = date.toISOString().split('T')[0];
            }
        }

        const outputPath = path.join(process.cwd(), 'public', 'model_updates.json');
        fs.writeFileSync(outputPath, JSON.stringify(updates, null, 2));
        console.log(`Updated model info saved to ${outputPath}`);
        console.log(updates);

    } catch (error) {
        console.error('Failed to update models:', error);
        process.exit(1);
    }
}

updateModels();
