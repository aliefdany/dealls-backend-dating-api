import { Test, TestingModule } from '@nestjs/testing';
import { SwipesController } from './swipes.controller';
import { SwipesService } from './swipes.service';
import { UpdateSwipeDto } from './dto/update-swipe.dto';

// Mocking the SwipesService
const mockSwipesService = {
  swipeProfile: jest.fn(),
};

describe('SwipesController', () => {
  let controller: SwipesController;
  let swipesService: SwipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwipesController],
      providers: [
        {
          provide: SwipesService,
          useValue: mockSwipesService,
        },
      ],
    }).compile();

    controller = module.get<SwipesController>(SwipesController);
    swipesService = module.get<SwipesService>(SwipesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should update the swipe and return the updated swipe', async () => {
      const id = '1';
      const updateSwipeDto: UpdateSwipeDto = { like: true };
      const userId = 2;

      const mockUpdatedSwipe = {
        id,
        swiper_id: userId,
        swipee_id: 3,
        like: true,
        date: new Date(),
      };

      mockSwipesService.swipeProfile.mockResolvedValue(mockUpdatedSwipe);

      const result = await controller.update(id, updateSwipeDto, {
        user: { id: userId },
      });

      expect(mockSwipesService.swipeProfile).toHaveBeenCalledWith(
        +id, // convert id to a number
        updateSwipeDto,
        userId,
      );
      expect(result).toEqual(mockUpdatedSwipe);
    });
  });
});
