import { TestBed } from '@angular/core/testing';

import { TriviaApiService } from './trivia-api.service';

describe('TriviaApiService', () => {
  let service: TriviaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TriviaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
