import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', { timestamp: true });
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(`C'est de la merde et y'a une erreur : ${error.stack}`);
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: { id: id },
    });

    if (!found) {
      throw new NotFoundException(`Task with id: ${id} not found!`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
    const result = await this.tasksRepository.delete({ id: id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id: ${id} not found!`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
  ): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
