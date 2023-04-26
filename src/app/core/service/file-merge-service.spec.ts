import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { FileMergeService } from "./file-merge.service";

describe("FileMergeService", () => {
  let service: FileMergeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FileMergeService],
    });
    service = TestBed.inject(FileMergeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
