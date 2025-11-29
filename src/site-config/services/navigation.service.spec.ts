import { NotFoundException } from '@nestjs/common';
import { NavigationService } from './navigation.service';

type MockRepository = {
  find: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  preload: jest.Mock;
  findOne: jest.Mock;
  remove: jest.Mock;
};

const createMockRepository = (): MockRepository => ({
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('NavigationService', () => {
  let service: NavigationService;
  let repository: MockRepository;

  beforeEach(() => {
    repository = createMockRepository();
    service = new NavigationService(repository as never);
  });

  it('menetapkan default ketika membuat navigation link baru', async () => {
    repository.create.mockImplementation((payload) => payload);
    repository.save.mockImplementation((payload) => payload);

    const dto = { label: 'Home', url: '/' };
    const result = await service.createNavigation(dto as never);

    expect(repository.create).toHaveBeenCalledWith({
      label: 'Home',
      url: '/',
      position: 0,
      isPrimary: false,
      isExternal: false,
    });
    expect(result).toEqual({
      label: 'Home',
      url: '/',
      position: 0,
      isPrimary: false,
      isExternal: false,
    });
  });

  it('throw NotFoundException ketika update target tidak ditemukan', async () => {
    repository.preload.mockResolvedValue(null);

    await expect(
      service.updateNavigation('missing-id', { label: 'About' } as never),
    ).rejects.toThrow(NotFoundException);
  });

  it('menghapus navigation link yang ada', async () => {
    repository.findOne.mockResolvedValue({ id: 'nav-123' });

    await service.removeNavigation('nav-123');

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'nav-123' } });
    expect(repository.remove).toHaveBeenCalledWith({ id: 'nav-123' });
  });
});

