const userId = '804660273444159518';
const lanyardAPI = `https://api.lanyard.rest/v1/users/${userId}`;

async function fetchDiscordData() {
    try {
        const response = await fetch(lanyardAPI);
        const data = await response.json();
        
        if (data.success) {
            const { discord_status } = data.data;
            const statusCircle = document.getElementById('status-circle');

            let statusText;
            switch (discord_status) {
                case 'online':
                    statusCircle.style.backgroundColor = '#43b581'; 
                    statusText = 'Online';
                    break;
                case 'idle':
                    statusCircle.style.backgroundColor = '#faa61a'; 
                    statusText = 'Idle';
                    break;
                case 'dnd':
                    statusCircle.style.backgroundColor = '#f04747'; 
                    statusText = 'Do Not Disturb';
                    break;
                case 'offline':
                    statusCircle.style.backgroundColor = '#747f8d'; 
                    statusText = 'Offline';
                    break;
                default:
                    statusCircle.style.backgroundColor = '#747f8d'; 
                    statusText = 'Unknown';
                    break;
            }
            statusCircle.setAttribute('title', statusText);
        }
    } catch (error) {
        console.error('Error fetching Discord data:', error);
    }
}


fetchDiscordData();

const socket = new WebSocket(`wss://api.lanyard.rest/socket`);

socket.onopen = () => {
    socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
};

socket.onmessage = (event) => {
    const { t } = JSON.parse(event.data);
    if (t === 'PRESENCE_UPDATE') {
        fetchDiscordData();
    }
};
