export type Link = {
    id: string
    name: string
    description: string
    url: string
    searchUrl?: string // URL pattern for direct search (e.g., https://.../?q=)
    category: 'LLM' | 'Image' | 'Audio' | 'Video' | 'Productivity' | 'Dev'
    icon?: string
    updatedAt?: string // ISO date string (YYYY-MM-DD)
}

export const links: Link[] = [
    {
        id: 'claude',
        name: 'Claude',
        description: 'AI assistant by Anthropic, focused on being helpful, harmless, and honest.',
        url: 'https://claude.ai',
        searchUrl: 'https://claude.ai/new?q=',
        category: 'LLM',
        icon: 'claude.svg',
        updatedAt: '2026-02-17'
    },
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        description: 'Advanced conversational AI by OpenAI, capable of understanding and generating human-like text.',
        url: 'https://chat.openai.com',
        searchUrl: 'https://chat.openai.com/?q=',
        category: 'LLM',
        icon: 'chatgpt.svg',
        updatedAt: '2026-01-14'
    },
    {
        id: 'perplexity',
        name: 'Perplexity',
        description: 'AI-powered search engine and chatbot that provides accurate and verified answers.',
        url: 'https://www.perplexity.ai',
        searchUrl: 'https://www.perplexity.ai/search?q=',
        category: 'LLM',
        icon: 'perplexity.svg',
        updatedAt: '2026-02-18'
    },
    {
        id: 'genspark',
        name: 'Genspark',
        description: 'AI agents that help you search, shop, and learn more efficiently.',
        url: 'https://www.genspark.ai/agents?type=ai_chat',
        searchUrl: 'https://www.genspark.ai/search?q=',
        category: 'Productivity',
        icon: 'genspark.svg'
    },
    {
        id: 'grok',
        name: 'Grok',
        description: 'AI model developed by xAI, designed to answer questions with a bit of wit and has a rebellious streak.',
        url: 'https://grok.com/',
        searchUrl: 'https://grok.com/?q=',
        category: 'LLM',
        icon: 'grok.png',
        updatedAt: '2026-02-18'
    },
    {
        id: 'manus',
        name: 'Manus',
        description: 'Next-generation AI research assistant for deep dives and complex information synthesis.',
        url: 'https://manus.ai',
        category: 'Dev',
        icon: 'manus.svg',
        updatedAt: '2026-02-17'
    },
    {
        id: 'felo',
        name: 'Felo',
        description: 'Free AI search engine and chat to get answers and create content.',
        url: 'https://felo.ai',
        searchUrl: 'https://felo.ai/search?q=',
        category: 'Productivity',
        icon: 'felo.png'
    },
    {
        id: 'gemini',
        name: 'Gemini',
        description: 'Google\'s most capable AI model, built for a variety of tasks and integrated into Google Workspace.',
        url: 'https://gemini.google.com',
        searchUrl: 'https://gemini.google.com/app?q=',
        category: 'LLM',
        icon: 'gemini.svg',
        updatedAt: '2026-02-19'
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        description: 'Advanced AI models for reasoning, coding, and mathematical problem-solving.',
        url: 'https://chat.deepseek.com/',
        searchUrl: 'https://chat.deepseek.com/?q=',
        category: 'LLM',
        icon: 'deepseek.png'
    },
    {
        id: 'kimi',
        name: 'Kimi',
        description: 'AI assistant by Moonshot AI, capable of processing long context and assisting with research.',
        url: 'https://kimi.moonshot.cn',
        searchUrl: 'https://kimi.moonshot.cn/chat?q=',
        category: 'LLM',
        icon: 'kimi.svg',
        updatedAt: '2026-02-17'
    }
]
