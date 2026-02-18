import fs from 'fs';
import path from 'path';

// 監視対象のモデルIDマッピング（誤動作防止のため厳密に定義）
const MODEL_MAPPING: Record<string, string[]> = {
    'claude': ['anthropic/claude-sonnet', 'anthropic/claude-opus', 'anthropic/claude-3.5-sonnet', 'anthropic/claude-3-opus'],
    'chatgpt': ['openai/gpt-4o', 'openai/gpt-4-turbo', 'openai/gpt-4.1', 'openai/gpt-5'],
    'gemini': ['google/gemini-pro', 'google/gemini-flash', 'google/gemini-2.5-pro', 'google/gemini-3.0-pro'],
    'deepseek': ['deepseek/deepseek-chat', 'deepseek/deepseek-reasoner'],
    'perplexity': ['perplexity/llama-3.1-sonar-huge-128k-online', 'perplexity/sonar-reasoning'],
    'grok': ['x-ai/grok-2', 'x-ai/grok-3', 'x-ai/grok-4'],
    'kimi': ['moonshot/kimi-v1']
};

const DYNAMIC_KEYWORDS = ['claude', 'gpt', 'gemini', 'deepseek', 'sonar', 'grok', 'kimi'];

/**
 * Google News RSSから最新ニュースを取得し、特定キーワードのリリース情報を検知する (Day 0 Detection)
 */
async function fetchNewsReleaseDate(keyword: string): Promise<number> {
    try {
        const query = encodeURIComponent(`"${keyword}" release launch`);
        const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
        const response = await fetch(url);
        const text = await response.text();

        // 簡易的なXML解析（タイトルと公開日を抽出）
        const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
        for (const item of items) {
            const title = (item.match(/<title>(.*?)<\/title>/) || [])[1] || "";
            const pubDateStr = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "";

            // キーワードとリリース関連語が含まれているか厳密にチェック
            const hasKeyword = title.toLowerCase().includes(keyword.toLowerCase());
            const hasRelease = /release|launch|announced|available|out now/i.test(title);

            if (hasKeyword && hasRelease) {
                const pubDate = new Date(pubDateStr).getTime();
                if (!isNaN(pubDate)) {
                    return Math.floor(pubDate / 1000);
                }
            }
        }
    } catch (e) {
        console.warn(`Failed to fetch news for ${keyword}:`, e);
    }
    return 0;
}

async function updateModels() {
    try {
        console.log('Fetching models from OpenRouter (Source A)...');
        const response = await fetch('https://openrouter.ai/api/v1/models');
        const json = await response.json() as { data: { id: string, created: number }[] };

        const updates: Record<string, string> = {};

        for (const [serviceId, modelIds] of Object.entries(MODEL_MAPPING)) {
            let latestCreated = 0;

            // 1. OpenRouter (Source A) からの取得
            for (const model of json.data) {
                if (modelIds.some(id => model.id.startsWith(id))) {
                    if (model.created > latestCreated) {
                        latestCreated = model.created;
                    }
                }
            }

            // 2. ニュース速報 (Source B) からの補完検知
            console.log(`Checking News for ${serviceId} (Source B)...`);
            const newsCreated = await fetchNewsReleaseDate(serviceId === 'chatgpt' ? 'GPT-4' : serviceId);
            if (newsCreated > latestCreated) {
                console.log(`[Day 0 Detection] New release info found in news for ${serviceId}: ${new Date(newsCreated * 1000).toISOString()}`);
                latestCreated = newsCreated;
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
