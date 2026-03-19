export type Link = {
    id: string
    name: string
    url: string
    searchUrl?: string
    category: 'LLM' | 'Productivity' | 'Dev'
    icon?: string
}

export const links: Link[] = [
    {
        id: 'claude',
        name: 'Claude',
        url: 'https://claude.ai/new',
        category: 'LLM',
        icon: 'claude.svg',
    },
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        searchUrl: 'https://chatgpt.com/?q=',
        category: 'LLM',
        icon: 'chatgpt.svg',
    },
    {
        id: 'perplexity',
        name: 'Perplexity',
        url: 'https://www.perplexity.ai',
        searchUrl: 'https://www.perplexity.ai/search?q=',
        category: 'LLM',
        icon: 'perplexity.svg',
    },
    {
        id: 'genspark',
        name: 'Genspark',
        url: 'https://www.genspark.ai/agents?type=ai_chat',
        category: 'Productivity',
        icon: 'genspark.svg'
    },
    {
        id: 'grok',
        name: 'Grok',
        url: 'https://grok.com/',
        searchUrl: 'https://grok.com/?q=',
        category: 'LLM',
        icon: 'grok.png',
    },
    {
        id: 'manus',
        name: 'Manus',
        url: 'https://manus.im/chat',
        category: 'Dev',
        icon: 'manus.svg',
    },
    {
        id: 'felo',
        name: 'Felo',
        url: 'https://felo.ai',
        searchUrl: 'https://felo.ai/search?q=',
        category: 'Productivity',
        icon: 'felo.svg'
    },
    {
        id: 'gemini',
        name: 'Gemini',
        url: 'https://gemini.google.com/u/1/app',
        category: 'LLM',
        icon: 'gemini.svg',
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        url: 'https://chat.deepseek.com/',
        searchUrl: 'https://chat.deepseek.com/?q=',
        category: 'LLM',
        icon: 'deepseek.png'
    },
    {
        id: 'kimi',
        name: 'Kimi',
        url: 'https://kimi.moonshot.cn',
        searchUrl: 'https://kimi.moonshot.cn/chat?q=',
        category: 'LLM',
        icon: 'kimi.svg',
    }
]
