const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = net.createConnection(5000, () => {
    console.log('Connected');
});

client.setEncoding('utf8');
client.on('data', (data) => {
    console.log('Message from server: ');
    console.log(data);
});

client.on('end', () => {
    console.log('Disconnected from server');
});

rl.on('line', (input) => {
    client.write(input);
    if (input.toLowerCase() === 'exit') {
        client.end();
        rl.close();
    }
});
