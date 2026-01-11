const net = require('net');

const clients = [];
let clientId = 1;

const server = net.createServer(client => {
    client.id = clientId++;
    clients.push(client);

    const setClientName = () => client.username || `user${client.id}`;

    console.log('Client connected');
    client.write('Welcome to the chat room');

    clients.forEach(c => {
        if (c !== client) {
            c.write(`${setClientName()} has joined the chat\n`);
        }
    });

    client.on('data', data => {
        const trimmed = data.toString().trim();

        if (trimmed.startsWith('/username ')) {
            const username = trimmed.split(' ')[1];
            if (username) {
                client.username = username;
                client.write(`Username set to ${username}`);
            } else {
                client.write('Usage: /username <name>');
            }
            return;
        }
        if (trimmed.toLowerCase() === '/exit') {
            client.end();
            return;
        }
        if (trimmed === '/clientlist') {
            const names = clients.map(c => setClientName()).join(', ');
            client.write(`Connected clients: ${names}`);
            return;
        }

        const message = `${setClientName()}: ${trimmed}`;
        console.log(message);

        // Broadcast to others
        clients.forEach(c => {
            if (c !== client) {
                c.write(message + '\n');
            }
        });
    });

    client.on('end', () => {
        const name = setClientName();
        console.log(`${name} disconnected`);
        clients.splice(clients.indexOf(client), 1);

        clients.forEach(c => {
            c.write(`${name} has left the chat`);
        });
    });

    client.on('error', () => {
        clients.splice(clients.indexOf(client), 1);
    });
});

server.listen(5000, () => {
    console.log('Server listening on port 5000');
});