import { PrismaClientExceptionFilter } from './prisma-client-exception.filter';
import { Prisma } from '@prisma/client';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';

describe('PrismaClientExceptionFilter', () => {
  let filter: PrismaClientExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new PrismaClientExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle P2002 error code and return CONFLICT status', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed on the field',
      {
        code: 'P2002',
        clientVersion: '5.22.0',
      },
    );

    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'Unique constraint failed on the field',
    });
  });

  it('should handle P2025 error code and return NOT_FOUND status', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Record to update not found',
      {
        code: 'P2025',
        clientVersion: '5.22.0',
      },
    );

    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Record to update not found',
    });
  });

  it('should call the BaseExceptionFilter for other error codes', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Some other error',
      {
        code: 'P9999',
        clientVersion: '5.22.0',
      },
    );

    const baseFilterSpy = jest
      .spyOn(BaseExceptionFilter.prototype, 'catch')
      .mockImplementation(() => {});

    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(baseFilterSpy).toHaveBeenCalledWith(exception, mockArgumentsHost);

    baseFilterSpy.mockRestore();
  });
});
