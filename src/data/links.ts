export interface Link {
    id: string
    name: string
    description: string
    url: string
    category: 'LLM' | 'Image' | 'Audio' | 'Video' | 'Productivity' | 'Dev'
    icon?: string
    isNew?: boolean
}

export const links: Link[] = [
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        description: 'Advanced conversational AI by OpenAI, capable of understanding and generating human-like text.',
        url: 'https://chat.openai.com',
        category: 'LLM',
        icon: 'chatgpt.svg'
    },
    {
        id: 'claude',
        name: 'Claude',
        description: 'AI assistant by Anthropic, focused on being helpful, harmless, and honest.',
        url: 'https://claude.ai',
        category: 'LLM',
        icon: 'claude.svg',
        isNew: true
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
        icon: 'perplexity.svg'
    },
    {
        id: 'genspark',
        name: 'Genspark',
        description: 'AI agents that help you search, shop, and learn more efficiently.',
        url: 'https://www.genspark.ai/agents?type=ai_chat',
        category: 'Productivity',
        icon: 'genspark.svg',
        isNew: true
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
        id: 'manus',
        name: 'Manus',
        description: 'Next-generation AI research assistant for deep dives and complex information synthesis.',
        url: 'https://manus.ai',
        category: 'Dev',
        icon: 'manus.svg',
        isNew: true
    }
]
