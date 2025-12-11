const net = require('net');

const clients = [];

const server = net.createServer(client => {
    client.setEncoding('utf8');
    clients.push(client);

    console.log('Client connected');
    client.write('Welcome to the chat room\n');
    clients.forEach(c => {
        if (c !== client) {
            c.write('A new user has joined the chat\n');
        }
    });

    client.on('data', data => {
        const message = 'user'+ ' ' + (clients.indexOf(client) + 1) + ": " + data.toString().trim();
        console.log(message);

        // Broadcast to all other clients
        clients.forEach(c => {
            if (c !== client) {
                c.write(message + '\n');
            }
        });
    });

    client.on('end', () => {
        console.log('user'+ ' ' + (clients.indexOf(client) + 1) + ": " + 'disconnected');
        clients.splice(clients.indexOf(client), 1);
    });
});

server.listen(5000, () => {
    console.log('Server listening on port 5000');
});
