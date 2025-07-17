import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository'; // adjust path if needed
import { UpdateLocationDto } from './dto/update-location.dto';
import { Users } from './entities/user.entity'; // or user.model, whichever is correct
