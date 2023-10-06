import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '6e94b3ed-e6d7-4d62-8464-e061f05b5643',
      title: 'Clean my room',
      description: 'Lots of cleaning has to be done',
      status: TaskStatus.OPEN,
    },
    {
      id: 'cbbd266f-1b56-4531-a835-fe8c2d3c87b5',
      title: 'Visit saloon',
      description: 'Get your hair done',
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: '9708e787-a421-4d72-a24b-3eeeec1f70ac',
      title: 'Go to church',
      description: 'Service God while worshiping him in spirit and in truth',
      status: TaskStatus.OPEN,
    },
    {
      id: '79805fdb-9cfc-4124-9619-100716cc26fd',
      title: 'Visit The Pool',
      description: 'Swim while having fun',
      status: TaskStatus.DONE,
    },
  ];

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status.toUpperCase());
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (
          task.title.includes(search.toLowerCase()) ||
          task.description.includes(search.toLowerCase())
        ) {
          return true;
        }

        return false;
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const foundTask = this.tasks.find((task) => task.id == id);

    if (!foundTask) {
      throw new NotFoundException(`Task not found`);
    }

    return foundTask;
  }

  updateTaskById(id: string, statusDto: UpdateTaskStatusDto): Task {
    const task = this.getTaskById(id);
    task.status = statusDto.status;

    return task;
  }

  deleteTaskById(id: string): { id: string; message: string } {
    const foundIndex = this.tasks.findIndex((task) => task.id === id);

    const foundTask = this.getTaskById(id);
    this.tasks.splice(foundIndex, 1);
    const message = 'Task deleted successfully';

    return { id: foundTask.id, message: message };
  }
}
