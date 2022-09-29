import { Test, TestingModule } from "@nestjs/testing";
import { CooksService } from "./cooks.service";

describe("CooksService", () => {
  let service: CooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CooksService],
    }).compile();

    service = module.get<CooksService>(CooksService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
