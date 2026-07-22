import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod, RpcException } from '@nestjs/microservices';
import { Observable, Subject, from, throwError } from 'rxjs';
import { status as gRPCStatus } from '@grpc/grpc-js';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { ProductionGrpcExceptionFilter } from '../common/filters/grpc-exception.filter';

interface HeroRequest {
  hero_id: string;
}

interface HeroResponse {
  hero_id: string;
  name: string;
  alias: string;
  power_level: number;
  abilities: string[];
}

interface PowerResponse {
  power_name: string;
  intensity: number;
  status: string;
}

interface BattleMetric {
  battle_id: string;
  damage_dealt: number;
  damage_taken: number;
  timestamp: number;
}

interface BattleSummary {
  battle_id: string;
  total_damage_dealt: number;
  total_damage_taken: number;
  combat_rating: string;
}

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
}

@Controller()
@UseInterceptors(LoggingInterceptor)
@UseFilters(ProductionGrpcExceptionFilter)
export class HeroController {

  // Mock database repository
  private readonly heroDatabase = new Map<string, HeroResponse>([
    [
      'HERO-101',
      {
        hero_id: 'HERO-101',
        name: 'Iron Man',
        alias: 'Tony Stark',
        power_level: 95,
        abilities: ['Flight', 'Repulsor Rays', 'JARVIS AI', 'Nanotech Armor'],
      },
    ],
    [
      'HERO-102',
      {
        hero_id: 'HERO-102',
        name: 'Spider-Man',
        alias: 'Peter Parker',
        power_level: 88,
        abilities: ['Spider-Sense', 'Web Shooting', 'Wall Crawling'],
      },
    ],
  ]);

  // 1. Unary RPC Handler with Error Handling & Validation
  @GrpcMethod('HeroService', 'GetHero')
  getHero(data: HeroRequest): HeroResponse {
    if (!data || !data.hero_id || data.hero_id.trim() === '') {
      throw new RpcException({
        code: gRPCStatus.INVALID_ARGUMENT,
        message: 'Hero ID must be provided and non-empty.',
      });
    }

    const hero = this.heroDatabase.get(data.hero_id);
    if (!hero) {
      throw new RpcException({
        code: gRPCStatus.NOT_FOUND,
        message: `Hero with ID "${data.hero_id}" was not found in registry.`,
      });
    }

    return hero;
  }

  // 2. Server Streaming RPC Handler using RxJS Observable
  @GrpcMethod('HeroService', 'StreamHeroPowers')
  streamHeroPowers(data: HeroRequest): Observable<PowerResponse> {
    if (!data.hero_id) {
      return throwError(() => new RpcException({
        code: gRPCStatus.INVALID_ARGUMENT,
        message: 'Invalid Hero ID for power streaming.',
      }));
    }

    return from([
      { power_name: 'Nano Shield Active', intensity: 100, status: 'ONLINE' },
      { power_name: 'Arc Reactor Boost', intensity: 150, status: 'CHARGING' },
      { power_name: 'Unibeam Energy Charge', intensity: 200, status: 'READY' },
    ]);
  }

  // 3. Client Streaming RPC Handler using RxJS Subject & Stream Aggregation
  @GrpcStreamMethod('HeroService', 'CollectBattleMetrics')
  collectBattleMetrics(data$: Observable<BattleMetric>): Observable<BattleSummary> {
    const subject = new Subject<BattleSummary>();

    let totalDealt = 0;
    let totalTaken = 0;
    let battleId = '';

    data$.subscribe({
      next: (metric) => {
        if (metric.damage_dealt < 0 || metric.damage_taken < 0) {
          console.warn('⚠️ Received negative damage metric, ignoring...');
          return;
        }
        battleId = metric.battle_id;
        totalDealt += metric.damage_dealt;
        totalTaken += metric.damage_taken;
      },
      error: (err) => {
        console.error('❌ Stream Error:', err);
        subject.error(new RpcException({
          code: gRPCStatus.INTERNAL,
          message: 'Client stream failed abruptly.',
        }));
      },
      complete: () => {
        subject.next({
          battle_id: battleId || 'BATTLE-PRODUCTION',
          total_damage_dealt: totalDealt,
          total_damage_taken: totalTaken,
          combat_rating: totalDealt >= totalTaken ? 'VICTORY' : 'DEFENCE_REQUIRED',
        });
        subject.complete();
      },
    });

    return subject.asObservable();
  }

  // 4. Bidirectional Streaming RPC Handler
  @GrpcStreamMethod('HeroService', 'HeroLiveChat')
  heroLiveChat(data$: Observable<ChatMessage>): Observable<ChatMessage> {
    const subject = new Subject<ChatMessage>();

    data$.subscribe({
      next: (msg) => {
        if (!msg.message || msg.message.trim() === '') return;

        subject.next({
          sender: 'JARVIS AI Engine',
          message: `Acknowledged [${msg.sender}]: "${msg.message}". Tactical matrix synced.`,
          timestamp: Date.now(),
        });
      },
      error: (err) => {
        subject.error(new RpcException({
          code: gRPCStatus.ABORTED,
          message: 'Bidirectional chat session aborted.',
        }));
      },
      complete: () => {
        subject.complete();
      },
    });

    return subject.asObservable();
  }
}
