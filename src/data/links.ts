export interface Link {
    id: string
    name: string
    url: string
    icon?: string
}

export const links: Link[] = [
    {
        id: '1',
        name: 'ChatGPT',
        url: 'https://chat.openai.com',
        icon: '/icons/chatgpt.svg'
    },
    {
        id: '2',
        name: 'Claude',
        url: 'https://claude.ai',
        icon: '/icons/claude.svg'
    },
    {
        id: '3',
        name: 'Gemini',
        url: 'https://gemini.google.com',
        icon: '/icons/gemini.svg'
    },
    {
        id: '4',
        name: 'Perplexity',
        url: 'https://www.perplexity.ai',
        icon: '/icons/perplexity.svg'
    },
    {
        id: '5',
        name: 'ElevenLabs',
        url: 'https://elevenlabs.io',
        icon: '/icons/elevenlabs.svg'
    },
    {
        id: '6',
        name: 'Runway',
        url: 'https://runwayml.com',
        icon: '/icons/runway.svg'
    },
    {
        id: '7',
        name: 'DeepSeek',
        url: 'https://www.deepseek.com',
        icon: '/icons/deepseek.svg'
    }
]
