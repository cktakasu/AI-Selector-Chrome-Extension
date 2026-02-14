export interface Link {
    id: string;
    name: string;
    url: string;
    icon?: string;
}

export const links: Link[] = [
    {
        id: '1',
        name: 'ChatGPT',
        url: 'https://chat.openai.com',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg'
    },
    {
        id: '2',
        name: 'Claude',
        url: 'https://claude.ai',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg'
    },
    {
        id: '9',
        name: 'Gemini',
        url: 'https://gemini.google.com',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini.svg'
    },
    {
        id: '10',
        name: 'Perplexity',
        url: 'https://www.perplexity.ai',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/perplexity.svg'
    },
    {
        id: '3',
        name: 'Midjourney',
        url: 'https://www.midjourney.com',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/midjourney.svg'
    },
    {
        id: '4',
        name: 'Stable Diffusion',
        url: 'https://stability.ai',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/stability.svg'
    },
    {
        id: '5',
        name: 'ElevenLabs',
        url: 'https://elevenlabs.io',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/elevenlabs.svg'
    },
    {
        id: '6',
        name: 'Runway',
        url: 'https://runwayml.com',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/runway.svg'
    },
    {
        id: '7',
        name: 'GitHub Copilot',
        url: 'https://github.com/features/copilot',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/github-copilot.svg'
    },
    {
        id: '8',
        name: 'Notion AI',
        url: 'https://www.notion.so/product/ai',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/notion.svg'
    },
    {
        id: '11',
        name: 'Grok',
        url: 'https://grok.x.ai',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/grok.svg'
    },
    {
        id: '12',
        name: 'DeepSeek',
        url: 'https://www.deepseek.com',
        icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek.svg'
    }
];
