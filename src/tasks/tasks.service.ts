import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './dto/task.entity';
import { Repository } from 'typeorm';
import { User } from '../users/dto/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id, user });

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, status } = createTaskDto;

    const foundTask = await this.tasksRepository.findOneBy({
      title,
      description,
      user,
    });

    if (foundTask) {
      throw new ConflictException('Task already exist for this user');
    }

    const newTask = this.tasksRepository.create({
      title,
      description,
      status,
      user,
    });

    await this.tasksRepository.save(newTask);

    return newTask;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const queriedTask = this.tasksRepository
      .createQueryBuilder('task')
      .where({ user });

    if (status) {
      queriedTask.andWhere('task.status = :status', { status });
    }

    if (search) {
      queriedTask.andWhere(
        'LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const tasks = await queriedTask.getMany();

    if (tasks.length == 0) {
      throw new NotFoundException(`No task found`);
    }
    return tasks;
  }

  async deleteTaskById(
    id: string,
    user: User,
  ): Promise<{ id: string; message: string }> {
    const foundTask = await this.getTaskById(id, user);

    const taskId: string = foundTask.id;
    await this.tasksRepository.delete(foundTask);
    const message = 'Task deleted successfully';
    return { id: taskId, message };
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    if (!(status in TaskStatus)) {
      throw new BadRequestException(`Invalid status value`);
    }

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}
