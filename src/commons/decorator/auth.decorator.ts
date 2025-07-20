import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
export function Authenticated() {
  return applyDecorators(ApiBearerAuth(), UseGuards(AuthGuard('jwt')));
}
