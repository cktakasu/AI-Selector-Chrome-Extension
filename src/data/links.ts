export interface Link {
    id: string
    name: string
    description: string
    url: string
    category: 'LLM' | 'Image' | 'Audio' | 'Video' | 'Productivity' | 'Dev'
    icon?: string
    updatedAt?: string // ISO date string (YYYY-MM-DD)
}

export const links: Link[] = [
    {
        id: 'manus',
        name: 'Manus',
        description: 'Next-generation AI research assistant for deep dives and complex information synthesis.',
        url: 'https://manus.ai',
        category: 'Dev',
        icon: 'manus.svg'
    },
    {
        id: 'felo',
        name: 'Felo',
        description: 'Free AI search engine and chat to get answers and create content.',
        url: 'https://felo.ai',
        category: 'Productivity',
        icon: 'felo.png'
    },
    {
        id: 'grok',
        name: 'Grok',
        description: 'AI model developed by xAI, designed to answer questions with a bit of wit and has a rebellious streak.',
        url: 'https://x.ai',
        category: 'LLM',
        icon: 'grok.png'
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        description: 'Advanced AI models for reasoning, coding, and mathematical problem-solving.',
        url: 'https://chat.deepseek.com/',
        category: 'LLM',
        icon: 'deepseek.png',
        updatedAt: '2026-02-18'
    },
    {
        id: 'kimi',
        name: 'Kimi',
        description: 'AI assistant by Moonshot AI, capable of processing long context and assisting with research.',
        url: 'https://kimi.moonshot.cn',
        category: 'LLM',
        icon: 'kimi.svg'
    },
    {
        id: 'claude',
        name: 'Claude',
        description: 'AI assistant by Anthropic, focused on being helpful, harmless, and honest.',
        url: 'https://claude.ai',
        category: 'LLM',
        icon: 'claude.svg',
        updatedAt: '2026-02-18'
    },
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        description: 'Advanced conversational AI by OpenAI, capable of understanding and generating human-like text.',
        url: 'https://chat.openai.com',
        category: 'LLM',
        icon: 'chatgpt.svg'
    },
    {
        id: 'gemini',
        name: 'Gemini',
        description: 'Google\'s most capable AI model, built for a variety of tasks and integrated into Google Workspace.',
        url: 'https://gemini.google.com',
        category: 'LLM',
        icon: 'gemini.svg'
    },
    {
        id: 'perplexity',
        name: 'Perplexity',
        description: 'AI-powered search engine and chatbot that provides accurate and verified answers.',
        url: 'https://www.perplexity.ai',
        category: 'LLM',
        icon: 'perplexity.svg',
        updatedAt: '2026-02-18'
    },
    {
        id: 'genspark',
        name: 'Genspark',
        description: 'AI agents that help you search, shop, and learn more efficiently.',
        url: 'https://www.genspark.ai/agents?type=ai_chat',
        category: 'Productivity',
        icon: 'genspark.svg'
    }
]
