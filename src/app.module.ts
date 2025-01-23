import { Module } from '@nestjs/common';
// import { GptModule } from './gpt/gpt.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RadarModule } from './radar/radar.module';

@Module({
  imports: [ScheduleModule.forRoot(), RadarModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
