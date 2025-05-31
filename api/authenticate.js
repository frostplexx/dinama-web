export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password, timestamp, attempts } = req.body;

    // Rate limiting check
    if (attempts > 5) {
        return res.status(429).json({
            success: false,
            message: 'Too many attempts! The AI is getting suspicious... 🤨'
        });
    }

    try {
        // Check if OpenAI API key is available
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            // Fallback to mock AI responses if no API key
            return handleMockAuthentication(username, password, res);
        }

        // First API call - check if user is valid
        const validationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{
                    role: 'user',
                    content: `Someone is trying to log in with username "${username}" and password "${password}". 
                    
                    Decide if this should be a valid user account. Consider:
                    - Does the username seem like a real person might use it?
                    - Is it creative or interesting?
                    - Avoid rejecting unless it's obviously fake/spam
                    
                    Respond with exactly "VALID" or "INVALID" and nothing else.`
                }],
                max_tokens: 10,
                temperature: 0.7
            })
        });

        if (!validationResponse.ok) {
            throw new Error('OpenAI API validation failed');
        }

        const validationData = await validationResponse.json();
        const isValid = validationData.choices[0].message.content.trim().toUpperCase().includes('VALID');

        if (!isValid) {
            const rejectionMessages = [
                'AI rejected your credentials! Try being more creative... 🤖',
                'The neural network says "nope" to your login attempt! 🧠',
                'Our AI overlords are not impressed. Access denied! 👎',
                'Authentication failed! The AI doesn\'t believe you exist... 👻'
            ];

            return res.status(401).json({
                success: false,
                message: rejectionMessages[Math.floor(Math.random() * rejectionMessages.length)]
            });
        }

        // Second API call - generate dashboard
        const dashboardResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{
                    role: 'user',
                    content: `Create a webapge for the user "${username}" with password "${password}.  
                    Image what the websites use could be, be creative and fill the whole webpage.
                    Generate as much creative mock content as possible but make it look real.
                    Style it with inline CSS using modern colors and good spacing. Be creative and match the personality suggested by the username.
                    You can use inline javascript to add functionality to the webpage
                    Return ONLY the HTML content and nothing else!!.
                    Return ONLY the HTML content and nothing else!!.
                    Return ONLY the HTML content and nothing else!!.
                    Return ONLY the HTML content and nothing else!!.
`
                }],
                max_tokens: 1500,
                temperature: 0.8
            })
        });

        const dashboardData = await dashboardResponse.json();
        const dashboardHTML = dashboardData.choices[0].message.content;

        // Generate user info
        const user = {
            displayName: generateDisplayName(username),
            avatar: generateAvatar(username),
            lastLogin: generateLastLogin(),
            accountType: 'Premium AI Verified'
        };

        return res.status(200).json({
            success: true,
            message: 'Authentication successful!',
            user,
            dashboard: dashboardHTML
        });

    } catch (error) {
        console.error('Authentication error:', error);
        return handleMockAuthentication(username, password, res);
    }
}

function handleMockAuthentication(username, password, res) {
    // Mock AI responses when API is not available
    const shouldAccept = Math.random() > 0.3; // 70% success rate

    if (!shouldAccept) {
        const rejectionMessages = [
            'Mock AI rejected your credentials! 🤖',
            'Fake neural network says "nope"! 🧠',
            'Demo mode: Access denied! 👎',
            'Mock AI doesn\'t believe in you... 👻'
        ];

        return res.status(401).json({
            success: false,
            message: rejectionMessages[Math.floor(Math.random() * rejectionMessages.length)]
        });
    }

    // Generate mock dashboard
    const mockDashboard = generateMockDashboard(username);
    const user = {
        displayName: generateDisplayName(username),
        avatar: generateAvatar(username),
        lastLogin: generateLastLogin(),
        accountType: 'Mock AI Verified'
    };

    return res.status(200).json({
        success: true,
        message: 'Mock authentication successful!',
        user,
        dashboard: mockDashboard
    });
}

function generateDisplayName(username) {
    const prefixes = ['Dr.', 'Professor', 'Captain', 'Master', 'Sir', 'Lady', 'Agent'];
    const suffixes = ['the Great', 'the Wise', 'the Bold', 'Pro', 'Elite', '2.0'];

    if (Math.random() > 0.7) {
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${username}`;
    } else if (Math.random() > 0.5) {
        return `${username} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    }

    return username.charAt(0).toUpperCase() + username.slice(1);
}

function generateAvatar(username) {
    const avatars = ['🎭', '🚀', '🎮', '🎨', '🎯', '🎪', '🎸', '🎲', '⚡', '🔥', '💎', '🌟', '🦄', '🐉', '🦊', '🐺'];

    // Generate based on username hash for consistency
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = ((hash << 5) - hash + username.charCodeAt(i)) & 0xffffffff;
    }

    return avatars[Math.abs(hash) % avatars.length];
}

function generateLastLogin() {
    const dates = [
        '2 minutes ago',
        '1 hour ago',
        '3 hours ago',
        'Yesterday',
        '2 days ago',
        'Last week',
        'Never (first time!)'
    ];

    return dates[Math.floor(Math.random() * dates.length)];
}

function generateMockDashboard(username) {
    const activities = [
        'Completed quantum task',
        'Uploaded neural data',
        'Synchronized AI modules',
        'Generated creative content',
        'Optimized algorithms',
        'Processed big data',
        'Enhanced security protocols'
    ];

    const achievements = [
        '🏆 AI Whisperer',
        '🎯 Data Master',
        '⚡ Speed Demon',
        '🧠 Logic King',
        '💎 Premium User',
        '🔥 Trending Creator'
    ];

    return `
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 15px; margin-bottom: 20px;">
            <h3 style="color: white; margin: 0;">🎉 Welcome ${username}!</h3>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Your AI-powered dashboard is ready</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #2d5a2d;">${Math.floor(Math.random() * 1000) + 100}</div>
                <div style="color: #666; font-size: 12px;">AI Points</div>
            </div>
            <div style="background: #e8f0ff; padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #1a4fa0;">${Math.floor(Math.random() * 50) + 10}</div>
                <div style="color: #666; font-size: 12px;">Tasks Done</div>
            </div>
            <div style="background: #fff3e0; padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #e65100;">${Math.floor(Math.random() * 20) + 1}</div>
                <div style="color: #666; font-size: 12px;">Level</div>
            </div>
        </div>
        
        <div style="background: white; border: 1px solid #eee; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 15px 0; color: #333;">🏆 Recent Achievements</h4>
            ${achievements.slice(0, 3).map(achievement =>
        `<div style="padding: 8px; background: #f8f9fa; margin: 5px 0; border-radius: 5px; border-left: 3px solid #007bff;">${achievement}</div>`
    ).join('')}
        </div>
        
        <div style="background: white; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
            <h4 style="margin: 0 0 15px 0; color: #333;">📈 Recent Activity</h4>
            ${activities.slice(0, 4).map((activity, index) =>
        `<div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                    <div style="width: 8px; height: 8px; background: #28a745; border-radius: 50%; margin-right: 10px;"></div>
                    <div>
                        <div style="font-weight: 500; color: #333;">${activity}</div>
                        <div style="font-size: 12px; color: #666;">${Math.floor(Math.random() * 60) + 1} minutes ago</div>
                    </div>
                </div>`
    ).join('')}
        </div>
    `;
}
