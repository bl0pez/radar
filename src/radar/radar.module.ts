import { Module } from '@nestjs/common';
import { RadarService } from './radar.service';
import { RadarController } from './radar.controller';

@Module({
  controllers: [RadarController],
  providers: [RadarService],
})
export class RadarModule {}
