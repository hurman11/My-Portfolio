/* ==============================================
   PROJECT DATA — Static content for all projects
   ============================================== */

export const projects = [
    {
        slug: 'media-nft-minter',
        category: 'Blockchain / Web3',
        title: 'Media NFT Minter',
        titleHtml: 'Media NFT<br />Minter',
        description: `Media NFT Minter is a Web3 application that enables creators to mint NFTs from
      multiple media types — including images, audio, and video — with decentralized
      storage on IPFS via Pinata. Built with a Solidity smart contract (ERC-721,
      OpenZeppelin) deployed on Base Sepolia, a Next.js frontend powered by wagmi,
      viem, and RainbowKit, and a Hardhat development/testing pipeline, the platform
      features drag-and-drop minting with custom metadata and licensing, a responsive
      on-chain gallery with integrated media playback, a peer-to-peer private
      marketplace with buyer-restricted listings, and wallet-to-wallet NFT transfers
      — demonstrating end-to-end blockchain development from contract design and
      security patterns to a polished, production-ready user experience.`,
        techStack: [
            'Solidity (ERC-721)', 'OpenZeppelin', 'Base Sepolia', 'Next.js',
            'wagmi', 'viem', 'RainbowKit', 'Hardhat', 'IPFS / Pinata',
        ],
        features: [
            'Drag-and-drop NFT minting with support for images, audio, and video',
            'Custom metadata and licensing configuration per token',
            'Responsive on-chain NFT gallery with integrated media playback',
            'Peer-to-peer private marketplace with buyer-restricted listings',
            'Wallet-to-wallet NFT transfers',
            'ERC-721 compliant smart contract with OpenZeppelin security patterns',
            'Decentralized storage on IPFS via Pinata',
            'Full Hardhat development, testing, and deployment pipeline',
        ],
        image: '/MintIt.png',
        imageAlt: 'Media NFT Minter — Project Preview',
        gradient: null,
        screenshots: ['Screenshot 1', 'Screenshot 2', 'Screenshot 3'],
        cardDescription: 'Full-stack Web3 application for minting multi-media NFTs.',
        cardGradient: null,
        // SEO
        seoTitle: 'Media NFT Minter — Hurman | Project',
        seoDescription: 'Media NFT Minter — a Web3 application for minting multi-media NFTs with decentralized storage on IPFS, built with Solidity, Next.js, wagmi, and RainbowKit.',
        ogDescription: 'Full-stack Web3 application for minting multi-media NFTs with IPFS storage, on-chain gallery, and peer-to-peer marketplace.',
    },
    {
        slug: 'log-security-analyzer',
        category: 'Cybersecurity / Python',
        title: 'Log File Security Analyzer',
        titleHtml: 'Log File<br />Security Analyzer',
        description: `Log File Security Analyzer is a Python-based web application built with Flask
      that enables users to upload and analyze server log files for potential security
      threats. The application parses .log and .txt files using regex-based pattern
      matching to detect failed login attempts, extract IP addresses associated with
      suspicious activity, and flag IPs with repeated failed authentication attempts.
      Analysis results are presented through a clean web interface and can be
      downloaded as a detailed text report, making it a practical tool for system
      administrators and cybersecurity enthusiasts to quickly identify brute-force
      attack patterns and unauthorized access attempts.`,
        techStack: ['Python', 'Flask', 'Regex', 'HTML / CSS', 'Log Analysis'],
        features: [
            'Upload and analyze server log files (.log, .txt formats)',
            'Regex-based pattern matching for threat detection',
            'Extraction of IP addresses linked to suspicious activity',
            'Detection of repeated failed login attempts (brute-force patterns)',
            'Clean web interface for viewing analysis results',
            'Downloadable detailed analysis report in .txt format',
            'Practical tool for system administrators and cybersecurity professionals',
        ],
        image: null,
        imageAlt: null,
        gradient: 'linear-gradient(135deg, #0c0c1d, #1b1b3a, #2d1b69)',
        screenshots: ['Screenshot 1', 'Screenshot 2', 'Screenshot 3'],
        cardDescription: 'Automated log analysis for detecting brute-force and unauthorized access.',
        cardGradient: 'linear-gradient(135deg, #0c0c1d, #1b1b3a, #2d1b69)',
        // SEO
        seoTitle: 'Log File Security Analyzer — Hurman | Project',
        seoDescription: 'Log File Security Analyzer — a Python-based web application built with Flask for uploading and analyzing server log files to detect security threats.',
        ogDescription: 'Automated log analysis tool that detects brute-force attacks, failed logins, and suspicious IP addresses using regex-based pattern matching.',
    },
    {
        slug: 'project-3',
        category: 'Web Development',
        title: 'Project 3',
        titleHtml: 'Project 3',
        description: null,
        techStack: [],
        features: [],
        image: null,
        imageAlt: null,
        gradient: 'linear-gradient(135deg, #1a0a2e, #2d1b55, #4a1c7a)',
        screenshots: [],
        cardDescription: 'Building secure and functional web applications from the ground up.',
        cardGradient: 'linear-gradient(135deg, #1a0a2e, #2d1b55, #4a1c7a)',
        isPlaceholder: true,
        // SEO
        seoTitle: 'Project 3 — Hurman | Project',
        seoDescription: 'Project 3 — coming soon. A new project by Hurman in web development and cybersecurity.',
        ogDescription: 'This project is currently in development. Check back for a full breakdown.',
    },
];

export function getProjectBySlug(slug) {
    return projects.find((p) => p.slug === slug) || null;
}

export function getAllSlugs() {
    return projects.map((p) => p.slug);
}
