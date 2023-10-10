import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  ApiTags,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './dto/task.entity';
import { TaskStatus } from './task.model';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/dto/user.entity';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  /**
   * Create a new task
   * @param createTaskDto - The data for creating a new task.
   * @returns The newly created task.
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: Task,
  })
  @ApiBadRequestResponse({ status: 400, description: 'Invalid input' })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  /**
   * Get a task by its ID
   * @param id - The ID of the task.
   * @returns The task with the given ID.
   */
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'The task with the given ID.',
    type: Task,
  })
  @ApiNotFoundResponse({ status: 404, description: 'Task not found' })
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  /**
   * Get a list of tasks with optional filters
   * @param filterDto - The filters to apply to the tasks.
   * @returns A list of tasks.
   */
  @Get()
  @ApiResponse({ status: 200, description: 'List of tasks.', type: [Task] })
  @ApiNotFoundResponse({ status: 404, description: 'Task not found' })
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }

  /**
   * Delete a task by its ID
   * @param id - The ID of the task to delete.
   * @returns An object containing the ID of the deleted task and a success message.
   */
  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.',
  })
  @ApiNotFoundResponse({ status: 404, description: 'Task not found' })
  async deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<{ id: string; message: string }> {
    return this.tasksService.deleteTaskById(id, user);
  }

  /**
   * Update the status of a task by its ID
   * @param id - The ID of the task to update.
   * @param status - The new status value for the task.
   * @returns The updated task.
   */
  @Patch('/:id')
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
    type: Task,
  })
  @ApiNotFoundResponse({ status: 404, description: 'Task not found' })
  @ApiBadRequestResponse({ status: 400, description: 'Invalid status value' })
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
