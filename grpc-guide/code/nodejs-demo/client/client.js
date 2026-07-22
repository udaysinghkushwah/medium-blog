const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '../proto/hero.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const heroProto = grpc.loadPackageDefinition(packageDefinition).hero;
const client = new heroProto.HeroService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// 1. Execute Unary RPC
function runUnary() {
  console.log('\n--- 1. Testing Unary RPC ---');
  client.getHero({ hero_id: 'HERO-101' }, (err, response) => {
    if (err) return console.error(err);
    console.log('Hero Details Received:', response);
    runServerStreaming();
  });
}

// 2. Execute Server Streaming RPC
function runServerStreaming() {
  console.log('\n--- 2. Testing Server Streaming RPC ---');
  const stream = client.streamHeroPowers({ hero_id: 'HERO-101' });

  stream.on('data', (power) => {
    console.log('Streamed Power Event:', power);
  });

  stream.on('end', () => {
    console.log('Server stream complete.');
    runClientStreaming();
  });
}

// 3. Execute Client Streaming RPC
function runClientStreaming() {
  console.log('\n--- 3. Testing Client Streaming RPC ---');
  const stream = client.collectBattleMetrics((err, summary) => {
    if (err) return console.error(err);
    console.log('Final Battle Summary Received:', summary);
    runBidirectionalStreaming();
  });

  const metrics = [
    { battle_id: 'BATTLE-99', damage_dealt: 450, damage_taken: 100, timestamp: Date.now() },
    { battle_id: 'BATTLE-99', damage_dealt: 800, damage_taken: 250, timestamp: Date.now() + 1000 },
    { battle_id: 'BATTLE-99', damage_dealt: 1200, damage_taken: 300, timestamp: Date.now() + 2000 },
  ];

  metrics.forEach((m) => stream.write(m));
  stream.end();
}

// 4. Execute Bidirectional Streaming RPC
function runBidirectionalStreaming() {
  console.log('\n--- 4. Testing Bidirectional Streaming RPC ---');
  const chatStream = client.heroLiveChat();

  chatStream.on('data', (reply) => {
    console.log(` -> Server Replied: [${reply.sender}] ${reply.message}`);
  });

  chatStream.on('end', () => {
    console.log('Bidirectional stream terminated.');
    console.log('\n✨ All gRPC RPC patterns executed successfully!');
  });

  chatStream.write({ sender: 'Tony Stark', message: 'Status check on nanotech suit.', timestamp: Date.now() });
  setTimeout(() => {
    chatStream.write({ sender: 'Tony Stark', message: 'Prepare energy redirect to chest repulsor.', timestamp: Date.now() });
    chatStream.end();
  }, 1000);
}

// Start Client Workflow
runUnary();
