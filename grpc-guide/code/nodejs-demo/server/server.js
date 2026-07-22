const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '../../proto/hero.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const heroProto = grpc.loadPackageDefinition(packageDefinition).hero;

// Mock database registry
const heroesDb = new Map([
  ['HERO-101', { hero_id: 'HERO-101', name: 'Iron Man', alias: 'Tony Stark', power_level: 95, abilities: ['Flight', 'Repulsor Rays', 'JARVIS AI'] }],
  ['HERO-102', { hero_id: 'HERO-102', name: 'Spider-Man', alias: 'Peter Parker', power_level: 88, abilities: ['Spider-Sense', 'Web Shooting'] }],
]);

// 1. Production Unary RPC Handler with gRPC Error Status Codes
function getHero(call, callback) {
  const { hero_id } = call.request;
  console.log(`[Unary RPC] Client requested Hero ID: "${hero_id}"`);

  if (!hero_id || hero_id.trim() === '') {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: 'Parameter hero_id must be specified and non-empty.',
    });
  }

  const hero = heroesDb.get(hero_id);
  if (!hero) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: `Hero record with ID "${hero_id}" does not exist.`,
    });
  }

  callback(null, hero);
}

// 2. Server Streaming RPC Handler
function streamHeroPowers(call) {
  const { hero_id } = call.request;
  console.log(`[Server Streaming] Telemetry stream initiated for Hero ID: ${hero_id}`);

  if (!hero_id) {
    call.emit('error', {
      code: grpc.status.INVALID_ARGUMENT,
      message: 'Hero ID is required for telemetry streaming.',
    });
    return;
  }

  const powers = [
    { power_name: 'Nano Shield Active', intensity: 100, status: 'ONLINE' },
    { power_name: 'Arc Reactor Boost', intensity: 150, status: 'CHARGING' },
    { power_name: 'Unibeam Energy Blast', intensity: 200, status: 'READY' },
  ];

  powers.forEach((power, index) => {
    setTimeout(() => {
      if (!call.cancelled) {
        call.write(power);
        if (index === powers.length - 1) call.end();
      }
    }, (index + 1) * 800);
  });
}

// 3. Client Streaming RPC Handler
function collectBattleMetrics(call, callback) {
  console.log(`[Client Streaming] Collecting combat telemetry stream...`);
  
  let totalDealt = 0;
  let totalTaken = 0;
  let battleId = '';

  call.on('data', (metric) => {
    battleId = metric.battle_id;
    totalDealt += metric.damage_dealt;
    totalTaken += metric.damage_taken;
    console.log(` -> Metric Received: Dealt ${metric.damage_dealt}, Taken ${metric.damage_taken}`);
  });

  call.on('end', () => {
    callback(null, {
      battle_id: battleId || 'BATTLE-PROD-001',
      total_damage_dealt: totalDealt,
      total_damage_taken: totalTaken,
      combat_rating: totalDealt >= totalTaken ? 'VICTORY' : 'DEFENCE_REQUIRED',
    });
  });

  call.on('error', (err) => {
    console.error('❌ Stream Error encountered:', err);
  });
}

// 4. Bidirectional Streaming RPC Handler
function heroLiveChat(call) {
  console.log(`[Bidirectional Streaming] Real-time session opened.`);

  call.on('data', (chatMessage) => {
    console.log(` [${chatMessage.sender}]: ${chatMessage.message}`);

    // Echo back response stream
    call.write({
      sender: 'JARVIS Server',
      message: `Acknowledged: "${chatMessage.message}". Core temperature nominal.`,
      timestamp: Date.now(),
    });
  });

  call.on('end', () => {
    console.log(`[Bidirectional Streaming] Session ended.`);
    call.end();
  });
}

// Initialize & Launch Production gRPC Server with Graceful Shutdown
function main() {
  const server = new grpc.Server();
  
  server.addService(heroProto.HeroService.service, {
    getHero,
    streamHeroPowers,
    collectBattleMetrics,
    heroLiveChat,
  });

  const PORT = process.env.PORT || '0.0.0.0:50051';

  server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(`💥 Failed to bind gRPC server: ${err.message}`);
      process.exit(1);
    }
    console.log(`🚀 Production gRPC Server running securely on ${PORT}`);
  });

  // Handle Graceful Shutdown for Kubernetes / System Signals
  const shutdown = (signal) => {
    console.log(`\n🛑 ${signal} received. Initiating graceful gRPC server shutdown...`);
    server.tryShutdown((shutdownErr) => {
      if (shutdownErr) {
        console.error('⚠️ Graceful shutdown timed out, forcing termination.');
        server.forceShutdown();
      } else {
        console.log('✅ gRPC server terminated cleanly. Connections drained.');
      }
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main();
